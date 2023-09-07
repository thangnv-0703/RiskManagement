import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

import { AdminService } from './admin.service';
import { Admin } from '../../models/schemas/admin.schema';
import { FirebaseService } from '../firebase/firebase.service';

describe('AdminService', () => {
  let adminService: AdminService;
  let adminModel: Model<Admin>;
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        FirebaseService,
        {
          provide: getModelToken(Admin.name),
          useValue: Model,
        },
      ],
    }).compile();

    adminService = module.get<AdminService>(AdminService);
    adminModel = module.get<Model<Admin>>(getModelToken(Admin.name));
    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  describe('getAdminById', () => {
    it('should return the admin if found', async () => {
      const adminMock = { _id: '123', name: 'John Doe' };
      jest.spyOn(adminModel, 'findById').mockResolvedValue(adminMock as Admin);

      const result = await adminService.getAdminById('123');

      expect(result).toEqual(adminMock);
      expect(adminModel.findById).toHaveBeenCalledWith('123');
    });

    it('should throw an HttpException with NOT_FOUND status if admin not found', async () => {
      jest.spyOn(adminModel, 'findById').mockResolvedValue(null);

      await expect(adminService.getAdminById('123')).rejects.toThrowError(
        new HttpException(
          'No admin with this ID has been found',
          HttpStatus.NOT_FOUND,
        ),
      );
      expect(adminModel.findById).toHaveBeenCalledWith('123');
    });
  });

  // Add more test cases for other methods...
});
