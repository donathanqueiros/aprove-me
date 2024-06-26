import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { AssignorsController } from './assignors.controller';
import { AssignorsService } from './assignors.service';
import { UpdateAssignorDto } from './dto/update-assignor.dto';
import { AuthGuard } from '../auth/auth.guard';
import { Assignor } from '@prisma/client';

describe('AssignorsController', () => {
  let controller: AssignorsController;
  let service: DeepMockProxy<AssignorsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssignorsController],
      providers: [
        {
          provide: AssignorsService,
          useValue: mockDeep<AssignorsService>(),
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn().mockReturnValue(true) })
      .compile();

    controller = module.get<AssignorsController>(AssignorsController);
    service = module.get<AssignorsService>(
      AssignorsService,
    ) as DeepMockProxy<AssignorsService>;
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAssignorById', () => {
    it('should return an assignor if it exists', async () => {
      const assignorDto: Assignor = {
        id: randomUUID(),
        document: '12345678901',
        email: 'email@example.com',
        phone: '1234567890',
        name: 'Assignor Name',
        userId: undefined,
      };
      service.getAssignorById.mockResolvedValue(assignorDto);

      expect(await controller.getAssignorById(assignorDto.id)).toBe(
        assignorDto,
      );
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      service.getAssignorById.mockResolvedValue(null);
      await expect(
        controller.getAssignorById('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateAssignor', () => {
    it('should update an assignor', async () => {
      const updateAssignorDto: Assignor = {
        document: '12345678901',
        email: 'updated@example.com',
        phone: '1234567890',
        name: 'Updated Assignor Name',
        id: randomUUID(),
        userId: undefined,
      };
      const randomId = randomUUID();
      const data = {
        ...updateAssignorDto,
        id: randomId,
      };

      service.updateAssignor.mockResolvedValue(data);

      expect(await controller.updateAssignor(data.id, updateAssignorDto)).toBe(
        data,
      );
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      service.updateAssignor.mockRejectedValue(
        new NotFoundException('Assignor not found'),
      );
      const updateAssignorDto: UpdateAssignorDto = {
        document: '12345678901',
        email: 'updated@example.com',
        phone: '1234567890',
        name: 'Updated Assignor Name',
      };

      await expect(
        controller.updateAssignor('non-existent-id', updateAssignorDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createAssignor', () => {
    it('should create an assignor', async () => {
      const assignorDto: Assignor = {
        id: randomUUID(),
        document: '12345678901',
        email: 'email@example.com',
        phone: '1234567890',
        name: 'Assignor Name',
        userId: undefined,
      };
      service.createAssignor.mockResolvedValue(assignorDto);

      expect(await controller.create(assignorDto)).toBe(assignorDto);
    });
  });

  describe('deleteAssignor', () => {
    it('should delete an assignor', async () => {
      const assignorDto = {
        id: randomUUID(),
        document: '12345678901',
        email: 'email@example.com',
        phone: '1234567890',
        name: 'Assignor Name',
        userId: randomUUID(),
      } as Assignor;
      service.deleteAssignor.mockResolvedValue(assignorDto);

      expect(await controller.deleteAssignor(assignorDto.id)).toBe(assignorDto);
    });

    it('should throw NotFoundException if assignor does not exist', async () => {
      service.deleteAssignor.mockRejectedValue(
        new NotFoundException('Assignor not found'),
      );

      await expect(
        controller.deleteAssignor('non-existent-id'),
      ).rejects.toThrow(NotFoundException);
    });
  });
  describe('getAssignors', () => {
    it('should return a list of assignors', async () => {
      const assignors = [
        {
          id: randomUUID(),
          document: '12345678901',
          email: 'email@email.com',
          phone: '1234567890',
          name: 'Assignor Name',
          userId: randomUUID(),
        },
        {
          id: randomUUID(),
          document: '12345678902',
          email: 'email2@email.com',
          phone: '1234567890',
          name: 'Assignor Name 2',
          userId: randomUUID(),
        },
      ] as Assignor[];
      service.getAssignors.mockResolvedValue(assignors);

      expect(await controller.getAssignors()).toBe(assignors);

      expect(service.getAssignors).toHaveBeenCalled();
      expect(service.getAssignors).toHaveBeenCalledTimes(1);
      expect(service.getAssignors).toHaveBeenCalledWith();
      expect(service.getAssignors).toHaveReturned();
    });
  });
});
