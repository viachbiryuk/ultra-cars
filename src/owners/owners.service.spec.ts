import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateCarObjectFromPayload, generateCreateCarPayload } from '../../test/utils';
import { OwnersService } from './owners.service';
import { Owner } from './owner.entity';

describe('OwnersService', () => {
  let service: OwnersService;
  let ownersRepository: Repository<Owner>;

  const mockedCreateCarPayload = generateCreateCarPayload();
  const mockedCar = generateCarObjectFromPayload(mockedCreateCarPayload);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnersService,
        {
          provide: getRepositoryToken(Owner),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<OwnersService>(OwnersService);
    ownersRepository = module.get<Repository<Owner>>(getRepositoryToken(Owner));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('.deleteOwnersWhoBoughtTheirCarsBefore() should delete N owners', async () => {
    const deleteResult = { affected: 50, raw: null };
    jest.spyOn(ownersRepository, 'delete').mockResolvedValueOnce(deleteResult);
    const result = await service.deleteOwnersWhoBoughtTheirCarsBefore(18);
    expect(result).toEqual(deleteResult.affected);
  });
});

