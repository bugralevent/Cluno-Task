import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ListRequest } from './DTOs/list-request';
import { DataModule } from './Data/data.module';
import { DataService } from './Data/data.service';
import { MongoDBDataAdapterService } from './Data/Adapters/mongodb.service';
import { InMemoryDataAdapterService } from './Data/Adapters/in-memory.service';
import { IAdapter } from './Data/Interfaces/IAdapter';
import { MongooseModule } from '@nestjs/mongoose';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async (done) => {
    if (process.env.DB_ADAPTER == 'mongodb') {
      jest.setTimeout(30000);
    }
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
      imports: [
        DataModule,
        MongooseModule.forRoot('mongodb+srv://levent:5MQooNzQRs09xODq@cluster0-f8ejm.mongodb.net/test?retryWrites=true&w=majority')
      ]
    }).compile();

    const dataService = app.select(DataModule).get(DataService);
    let dataAdapter: IAdapter;
    if (process.env.DB_ADAPTER == 'mongodb') {
      dataAdapter = app.select(DataModule).get(MongoDBDataAdapterService);
    } else if (process.env.DB_ADAPTER == 'inmemory') {
      dataAdapter = app.select(DataModule).get(InMemoryDataAdapterService);
    } else {
      dataAdapter = app.select(DataModule).get(InMemoryDataAdapterService); // default in memory.
    }
    dataService.setAdapter(dataAdapter);
    await dataService.setData();
    done();
  });

  describe('listOffers', () => {
    it('should return list of offers only returns visible offers', async (done) => {
      const appController = app.get<AppController>(AppController);
      const request = new ListRequest();
      const response = await appController.listOffers(request);
      expect(response.success).toBe(true);
      done();
    });

    it('should return list of offers only return visible and portfolio 0001 filter', async (done) => {
      const appController = app.get<AppController>(AppController);
      const request = new ListRequest();
      request.portfolio = "0001";
      const response = await appController.listOffers(request);
      expect(response.success).toBe(true);
      done();
    });

    it('should return list of offers only return visible and price filter', async (done) => {
      const appController = app.get<AppController>(AppController);
      const request = new ListRequest();
      request.priceStart = 100;
      request.priceEnd = 290;
      const response = await appController.listOffers(request);
      expect(response.success).toBe(true);
      for (let res of response.data) {
        expect(res.price).toBeGreaterThanOrEqual(100);
        expect(res.price).toBeLessThanOrEqual(290);
      }
      done();
    });

    it('should return list of offers only return visible and make filter', async (done) => {
      const appController = app.get<AppController>(AppController);
      const request = new ListRequest();
      request.make = ["Opel", "Peugeot"];
      const response = await appController.listOffers(request);
      expect(response.success).toBe(true);
      done();
    });

    it('should return list of offers only return visible with all filter', async (done) => {
      const appController = app.get<AppController>(AppController);
      const request = new ListRequest();
      request.make = ["Opel", "Peugeot"];
      request.priceStart = 100;
      request.priceEnd = 290;
      request.portfolio = "0001";
      const response = await appController.listOffers(request);
      expect(response.success).toBe(true);
      for (let res of response.data) {
        expect(res.price).toBeGreaterThanOrEqual(100);
        expect(res.price).toBeLessThanOrEqual(290);
      }
      done();
    });


    it('should return details', async (done) => {
      const appController = app.get<AppController>(AppController);
      const id = "115";
      const response = await appController.details(id);
      expect(response.success).toBe(true);
      expect(response.data.visible).toBe(true);
      done();
    });
  });
  afterAll(() => setTimeout(() => process.exit(), 1000));
});
