import { Injectable } from '@nestjs/common';
import { DataService } from './Data/data.service';
import { ParsedItem } from './Data/DTOs/Parsed-Cluno-DTO';

@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private dataService: DataService) {

  }

  public async getListOfOffers(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number): Promise<Array<ParsedItem>> {
    return await this.dataService.filterData(portfolio, make, priceStart, priceEnd);
  }

  public async offerDetail(id: string): Promise<ParsedItem> {
    return await this.dataService.filterOne(id);
  }
}
