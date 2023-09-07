import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Admin } from '../../models/schemas/admin.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
// import AdminEntity from 'src/models/entities/admin.entity';
// import { AdminRepository } from 'src/models/repositories/admin.repository';
import { AVATAR_PATH } from './admin.constants';
import UpdateProfileDto from './dtos/update-profile.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AdminService {
  private logger = new Logger(AdminService.name);
  constructor(
    @InjectModel(Admin.name)
    private readonly adminModel: Model<Admin>,
    private firebaseService: FirebaseService,
  ) {}

  async getAdminByUsername(username: string) {
    const admin = await this.adminModel.findOne({ username: username });

    if (admin) {
      return admin;
    }
  }

  async getAllAdmins() {
    const admins = await this.adminModel.find();
    return admins;
  }

  async getAdminById(id: string) {
    const admin = await this.adminModel.findById(id);

    if (admin) {
      return admin;
    }

    throw new HttpException(
      'No admin with this ID has been found',
      HttpStatus.NOT_FOUND,
    );
  }

  async saveAvatar(admin: Admin, file: Express.Multer.File) {
    // upload ảnh lên storage
    const avatar = await this.uploadImage(file, AVATAR_PATH);
    // cập nhật db
    // await this.adminModel.update({ id: admin.id }, { avatar });
    await this.adminModel.findByIdAndUpdate({ _id: admin._id }, { avatar });
    const newAdmin = await this.getAdminById(admin._id);
    return newAdmin;
  }

  async uploadImage(file: Express.Multer.File, path: string) {
    const url: string = await this.firebaseService.uploadFile(file, path);
    return url;
  }

  async updateProfile(adminId: string, adminData: UpdateProfileDto) {
    const toUpdate = await this.getAdminById(adminId);

    // TODO why delete?
    delete toUpdate.password;
    delete toUpdate.username;

    // Update other fields as needed
    toUpdate.name = adminData.name;
    toUpdate.email = adminData.email;
    return await toUpdate.save();
  }

  async setNewPassword(username: string, password: string) {
    const admin = await this.getAdminByUsername(username);

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.adminModel.findByIdAndUpdate(admin._id, {
      password: hashedPassword,
    });
  }
}
