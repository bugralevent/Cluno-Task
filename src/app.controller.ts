import { Controller, Get, Body, Post, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { ParsedItem } from './Data/DTOs/Parsed-Cluno-DTO';
import { ListRequest } from './DTOs/list-request';
import { CResponse } from './DTOs/Response';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/listOffers')
  public async listOffers(@Body() reqBody: ListRequest): Promise<CResponse<Array<ParsedItem>>> {
    try {
      return new CResponse<Array<ParsedItem>>(true, (await this.appService.getListOfOffers(reqBody.portfolio, reqBody.make, reqBody.priceStart, reqBody.priceEnd)), "");
    } catch (e) {
      return new CResponse<Array<ParsedItem>>(false, undefined, e.toString());
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