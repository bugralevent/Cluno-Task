import { Module } from '@nestjs/common';
import { DataService } from './data.service';
import { ParserService } from './Parser/parser.service';
import { InMemoryDataAdapterService } from './Adapters/in-memory.service';
import { MongoDBDataAdapterService } from './Adapters/mongodb.service';
import { MongooseModule } from '@nestjs/mongoose';
import { OfferSchema } from './Schemas/offers.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Offers',
        schema: OfferSchema
      }
    ])
  ],
  controllers: [],
  providers: [DataService, ParserService, InMemoryDataAdapterService, MongoDBDataAdapterService],
  exports: [DataService, InMemoryDataAdapterService, MongoDBDataAdapterService],
})
export class DataModule {}
