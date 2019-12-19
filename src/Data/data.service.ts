import { Injectable } from '@nestjs/common';
import { ClunoNotParsed, Item } from './DTOs/Cluno-DTO';
import { ClunoParsed, ParsedItem, ResItem } from './DTOs/Parsed-Cluno-DTO';
import data from './DTOs/dynamodb.export.json';
import { ParserService } from './Parser/parser.service';
import { IAdapter } from './Interfaces/IAdapter';



@Injectable()
export class DataService {

    notParsedData: ClunoNotParsed;
    dataAdapter: IAdapter;

    constructor(private readonly parserService: ParserService) {
    }

    /**
     * setAdapter
     * @description Sets data adapter
     * @param adapter IAdapter Data Adapter to store parsed items and fetch data with it.
     * @returns { void }
     */
    public setAdapter(adapter: IAdapter): void {
        this.dataAdapter = adapter;
    }

    /**
     * @function setData()
     * @description Reads data, Parses it using ParserService, Sorts data, Creates hashed indexes from parsed data, Stores it in Memory.
     * @returns { Promise<void> }
     * This function is going to work for once, before the web server is started
     * Get Data, Parse It, send it Data Adapter.
     */
    public async setData(): Promise<void> {
        this.notParsedData = data;
        await this.dataAdapter.initialize(this.notParsedData.Count, this.notParsedData.ScannedCount); // initialize data adapter
        // sorting the item list for ascending pricing once and will use it for rest of the indexes and parsed data lists in order to response from API.
        this.notParsedData.Items.sort((itemA: Item, itemB: Item) => {
            return Number(itemA.pricing.M.price.N) - Number(itemB.pricing.M.price.N);
        });

        //parse objects
        for (let item of this.notParsedData.Items) {
            let parsedItem: ParsedItem = this.parserService.ParseItem(item);
            let parsedResItem: ResItem = this.parserService.ParseResItem(parsedItem);
            //send the parsed object to data adapter.
            await this.dataAdapter.onElementReceived(parsedItem, parsedResItem);
        }
    }
    /**
     * filterData
     * @param portfolio Portfolio of item
     * @param make Make of car
     * @param priceStart Starting price
     * @param priceEnd Ending price
     * @returns { Promise<Array<ParsedItem>> }
     */
    public async filterData(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number, limit?: number): Promise<Array<ResItem>> {
        return await this.dataAdapter.filter(portfolio, make, priceStart, priceEnd, limit);
    }
    /**
     * filterOne
     * @param id Id of item
     * @returns { Promise<ParsedItem> }
     */
    public async filterOne(id: string): Promise<ParsedItem> {
        return await this.dataAdapter.filterOne(id);
    }
}
