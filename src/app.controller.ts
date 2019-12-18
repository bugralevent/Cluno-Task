import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ParsedItem, ResItem } from './Data/DTOs/Parsed-Cluno-DTO';
import { ListRequest } from './DTOs/list-request';
import { CResponse } from './DTOs/Response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/listOffers')
  public async listOffers(@Body() reqBody: ListRequest): Promise<CResponse<Array<ResItem>>> {
    try {
      return new CResponse<Array<ResItem>>(true, (await this.appService.getListOfOffers(reqBody.portfolio, reqBody.make, reqBody.priceStart, reqBody.priceEnd, reqBody.limit)), "");
    } catch (e) {
      return new CResponse<Array<ResItem>>(false, undefined, e.toString());
    }
  }

  @Get('/details/:id')
  public async details(@Param('id') id: string): Promise<CResponse<ParsedItem>> {
    try {
      return new CResponse<ParsedItem>(true, await this.appService.offerDetail(id), "");
    } catch (e) {
      return new CResponse<ParsedItem>(false, undefined, e.toString());
    }
  }


}