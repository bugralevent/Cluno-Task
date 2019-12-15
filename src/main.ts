import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataModule } from './Data/data.module';
import { DataService } from './Data/data.service';
import { InMemoryDataAdapterService } from './Data/Adapters/in-memory.service';
import { IAdapter } from './Data/Interfaces/IAdapter';
import { MongoDBDataAdapterService } from './Data/Adapters/mongodb.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataService = app.select(DataModule).get(DataService);
  let dataAdapter: IAdapter;
  if (process.env.DB_ADAPTER == 'mongodb') {
    dataAdapter = app.select(DataModule).get(MongoDBDataAdapterService);
  }else if(process.env.DB_ADAPTER == 'inmemory') {
    dataAdapter = app.select(DataModule).get(InMemoryDataAdapterService);
  }else{
    dataAdapter = app.select(DataModule).get(InMemoryDataAdapterService); // default in memory.
  }
  dataService.setAdapter(dataAdapter);
  await dataService.setData();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
