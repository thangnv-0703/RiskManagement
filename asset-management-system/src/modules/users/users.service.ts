import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import CreateUserDto from './dtos/create-user.dto';
import { UserDto } from './dtos/user.dto';
import { UserQueryDto } from './dtos/userQuery.dto';
import UpdateProfileDto from './dtos/update-profile.dto';
import { AVATAR_PATH } from './user.constants';
import { DepartmentService } from '../department/department.service';
import { FirebaseService } from '../firebase/firebase.service';
import { User } from '../../models/schemas/user.schema';
import { AssetToUser } from '../../models/schemas/assetToUser.schema';
@Injectable()
export class UsersService {
  private logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    @InjectModel(AssetToUser.name)
    private readonly assetToUserModel: Model<AssetToUser>,
    private departmentService: DepartmentService,
    private firebaseService: FirebaseService,
  ) {}

  async getAll(userQuery?: UserQueryDto): Promise<any> {
    const users = await this.userModel
      .find({
        deletedAt: null,
        ...(userQuery.departmentId && {
          department: { _id: userQuery.departmentId },
        }),
      })
      .populate('department')
      .populate('assetToUsers');
    const res = await Promise.all(
      users.map(async (user) => {
        const {
          _id,
          department,
          password,
          assetToUsers,
          sourceCodeToUsers,
          requestAssets,
          ...rest
        } = user.toObject();
        const assets = await this.assetToUserModel.countDocuments({
          deletedAt: null,
          user: { _id: _id },
        });
        return {
          _id: _id.toString(),
          ...rest,
          department: department?.name,
          assets,
        };
      }),
    );
    return res;
  }

  async getUserByUserId(id: string): Promise<any> {
    const user = await this.userModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .populate('department');
    const { _id, department, password, ...rest } = user.toObject();
    return { _id: _id.toString(), department: department?.name, ...rest };
  }

  async createNewUser(userDto: UserDto): Promise<any> {
    const department = await this.departmentService.getDepartmentById(
      userDto.departmentId,
    );
    const userData = {
      name: userDto.name,
      username: userDto.username,
      password: await bcrypt.hash(userDto.password, 10),
      phone: userDto.phone,
      email: userDto.email,
      birthday: userDto.birthday,
      avatar: userDto.avatar,
      department: department,
    };
    const user = new this.userModel(userData);
    await user.save();
    return user;
  }

  async importUser(userDtos: UserDto[]): Promise<any> {
    // const session = await mongoose.startSession();
    // session.startTransaction();
    try {
      await Promise.all(
        userDtos.map(async (userDto: UserDto) => {
          const user = new this.userModel();
          const { password, departmentId, ...rest } = userDto;
          Object.assign(user, rest);
          const department = await this.departmentService.getDepartmentById(
            userDto.departmentId,
          );
          user.password = await bcrypt.hash(userDto.password, 10);
          user.department = department;
          // console.log(user);
          await user.save();
        }),
      );
      // await session.commitTransaction();
      console.log('Imported sucessfully');
    } catch (err) {
      // await session.abortTransaction();
      console.log(err);
      // throw err;
    }
    // finally {
    //   session.endSession();
    // }
    return userDtos;
  }

  async updateUser(id: string, userDto: UserDto) {
    const toUpdate = await this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });
    const { password, departmentId, ...rest } = userDto;
    const department = await this.departmentService.getDepartmentById(
      userDto.departmentId,
    );
    const updated = Object.assign(toUpdate, rest);
    updated.password = await bcrypt.hash(userDto.password, 10);
    updated.department = department;
    return await updated.save();
  }

  async deleteUser(id: string) {
    const toRemove = await this.userModel
      .findOne({
        _id: id,
        deletedAt: null,
      })
      .populate('assetToUsers')
      .populate('sourceCodeToUsers')
      .populate('requestAssets');
    if (toRemove) {
      toRemove.deletedAt = new Date(Date.now());
      await toRemove.save();
    }
    return toRemove;
  }

  async getUserByUsername(username: string) {
    const user = await this.userModel.findOne({ username, deletedAt: null });

    if (user) {
      return user.toObject();
    }
  }

  async getUserById(id: string) {
    const user = await this.userModel.findOne({
      _id: id,
      deletedAt: null,
    });
    return user.toObject();
  }

  async saveAvatar(user: User, file: Express.Multer.File) {
    // upload ảnh lên storage
    const avatar = await this.uploadImage(file, AVATAR_PATH);
    // cập nhật db
    await this.userModel.updateOne({ _id: user._id }, { avatar });
    const newUser = await this.getUserById(user._id);
    return newUser;
  }

  async uploadImage(file: Express.Multer.File, path: string) {
    const url: string = await this.firebaseService.uploadFile(file, path);
    return url;
  }

  async createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel();
    newUser.username = createUserDto.username;
    newUser.password = createUserDto.password;

    return await newUser.save();
  }

  async updateProfile(userId: string, userData: UpdateProfileDto) {
    const toUpdate = await this.getUserById(userId);

    // TODO why delete?
    delete toUpdate.password;
    delete toUpdate.username;

    const updated = Object.assign(toUpdate, userData);
    return await updated.save();
  }

  async setNewPassword(username: string, password: string) {
    const user = await this.getUserByUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
    });
  }
}
