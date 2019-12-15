import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ParsedItem } from './Data/DTOs/Parsed-Cluno-DTO';
import { ListRequest } from './DTOs/list-request';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/listOffers')
  public async listOffers(@Body() reqBody: ListRequest): Promise<Array<ParsedItem>> {
    try {
      return await this.appService.getListOfOffers(reqBody.portfolio, reqBody.make, reqBody.priceStart, reqBody.priceEnd);
    } catch (e) {
      console.log(e);
    }
  }

  @Get('/details/:id')
  public async details(@Param('id') id: string): Promise<ParsedItem> {
    try{
      return await this.appService.offerDetail(id);
    }catch(e){
      console.log(e);
    }
  }


}