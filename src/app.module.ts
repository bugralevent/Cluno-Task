import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataModule } from './Data/data.module';
import { DataService } from './Data/data.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    DataModule,
    MongooseModule.forRoot('mongodb+srv://levent:5MQooNzQRs09xODq@cluster0-f8ejm.mongodb.net/test?retryWrites=true&w=majority')
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
