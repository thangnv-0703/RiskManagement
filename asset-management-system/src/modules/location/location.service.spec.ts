import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { LocationService } from './location.service';
import { Location } from '../../models/schemas/location.schema';

describe('LocationService', () => {
  let locationService: LocationService;
  let locationModel: Model<Location>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationService,
        {
          provide: getModelToken(Location.name),
          useValue: Model,
        },
      ],
    }).compile();

    locationService = module.get<LocationService>(LocationService);
    locationModel = module.get<Model<Location>>(getModelToken(Location.name));
  });

  describe('getAllLocations', () => {
    it('should return all locations with the number of departments', async () => {
      const locationMock1 = {
        _id: '1',
        name: 'Location 1',
        departments: [{}, {}],
      };
      const locationMock2 = { _id: '2', name: 'Location 2', departments: [] };
      jest
        .spyOn(locationModel, 'find')
        .mockResolvedValue([locationMock1, locationMock2]);

      const result = await locationService.getAllLocations();

      expect(result).toEqual([
        { _id: '1', name: 'Location 1', numOfDepartments: 2 },
        { _id: '2', name: 'Location 2', numOfDepartments: 0 },
      ]);
      expect(locationModel.find).toHaveBeenCalled();
    });
  });

  describe('getLocationById', () => {
    it('should return the location if found', async () => {
      const locationId = '123';
      const locationMock = {
        _id: '123',
        name: 'Location 1',
        address: 'Address 1',
      };
      jest
        .spyOn(locationModel, 'findById')
        .mockResolvedValue(locationMock as Location);

      const result = await locationService.getLocationById(locationId);

      expect(result).toEqual(locationMock);
      expect(locationModel.findById).toHaveBeenCalledWith(locationId);
    });

    it('should return null if location is not found', async () => {
      const locationId = '456';
      jest.spyOn(locationModel, 'findById').mockResolvedValue(null);

      const result = await locationService.getLocationById(locationId);

      expect(result).toBeNull();
      expect(locationModel.findById).toHaveBeenCalledWith(locationId);
    });
  });

  // Add more test cases for other methods...
});
