import { Injectable } from "@nestjs/common";
import { IAdapter } from "../Interfaces/IAdapter";
import { ParsedItem, ClunoParsed } from "../DTOs/Parsed-Cluno-DTO";

@Injectable()
export class InMemoryDataAdapterService implements IAdapter {

    /**
     * @description This adapter is written for the cases of no limitations of memory usage
     * instead of cpu intensive loops, we use more memory to store indexes and create them once.
     */
    constructor() { }
    parsedData: ClunoParsed;
    OnlyVisibleKeys: Map<String, Boolean> = new Map<String, Boolean>();
    Indexes: Map<String, Array<ParsedItem>> = new Map<String, Array<ParsedItem>>();
    IndexedVisibleOffers: ClunoParsed;

    /**
     * initialize
     * @description initializes the memory and objects.
     * @param count Count of the objects
     * @param scannedCount Scanned count of objects
     * @returns { Promise<void> }
     */
    public async initialize(count: number, scannedCount: number): Promise<void> {
        this.parsedData = {
            Items: [],
            Count: count,
            ScannedCount: scannedCount,
            ConsumedCapacity: null
        };

        this.IndexedVisibleOffers = {
            Items: [],
            Count: 0,
            ScannedCount: 0,
            ConsumedCapacity: null
        }
    }
    /**
     * onElementReceived
     * @description Received parsed Cluno item and creates indexes for it and stores it in memory.
     * @param parsedItem Parsed CLuno Item
     * @returns { Promise<void> }
     */
    public async onElementReceived(parsedItem: ParsedItem): Promise<void> {
        if (parsedItem.visible) {
            this.IndexedVisibleOffers.Items.push(parsedItem);
            this.OnlyVisibleKeys[parsedItem.id] = true;
            //create id index if not exists
            if (!this.Indexes[this.idIndex(parsedItem.id)]) {
                this.Indexes[this.idIndex(parsedItem.id)] = [];
            }
            //create portfolio index if not exists
            if (!this.Indexes[this.portfolioIndex(parsedItem.portfolio)]) {
                this.Indexes[this.portfolioIndex(parsedItem.portfolio)] = [];
            }
            //create portfolio index if not exists
            if (!this.Indexes[this.makeIndex(parsedItem.car.make)]) {
                this.Indexes[this.makeIndex(parsedItem.car.make)] = [];
            }
            if (!this.Indexes[this.portfolioIndex(parsedItem.portfolio) + "|" + this.makeIndex(parsedItem.car.make)]) {
                this.Indexes[this.portfolioIndex(parsedItem.portfolio) + "|" + this.makeIndex(parsedItem.car.make)] = [];
            }
            this.Indexes[this.portfolioIndex(parsedItem.portfolio)].push(parsedItem);
            this.Indexes[this.makeIndex(parsedItem.car.make)].push(parsedItem);
            this.Indexes[this.idIndex(parsedItem.id)].push(parsedItem);
            this.Indexes[this.portfolioIndex(parsedItem.portfolio) + "|" + this.makeIndex(parsedItem.car.make)].push(parsedItem);
        }

        this.parsedData.Items.push(parsedItem);
    }

    /**
     * filter
     * @param portfolio Portfolio to filter
     * @param make Array of car manufacturers to filter.
     * @param priceStart Starting price, greater then equals to filter. priceEnd Parameter is Required !
     * @param priceEnd Ending price, lower then equals to filter. priceStart Parameter is Required !
     * @description Fetch data and filter it.
     * @returns { Promise<Array<ParsedItem>> }
     */
    public async filter(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number): Promise<Array<ParsedItem>> {
        let dataToFilter = this.indexDecision(portfolio, make);
        if (priceEnd != null && priceStart != null) {
            dataToFilter = dataToFilter.filter((item: ParsedItem) => {
                return item.pricing.price >= priceStart && item.pricing.price <= priceEnd;
            });
        }
        return dataToFilter;
    }

    /**
     * indexDecision
     * @description index desicion of the given parameters and returns indexed items.
     * @param portfolio Portfolio of the item
     * @param make Make of the car
     * @returns { Array<ParsedItem> }
     */
    private indexDecision(portfolio?: string, make?: string[]): Array<ParsedItem> {
        let dataToFilter: Array<ParsedItem> = this.IndexedVisibleOffers.Items;
        let indexKey = "";
        if (portfolio != null) {
            indexKey = this.portfolioIndex(portfolio);
            if (make == null) {
                dataToFilter = this.Indexes[indexKey];
            }else{
                indexKey += "|";
            }
        }

        if (make != null) {
            if (make.length == 1) {
                indexKey += this.makeIndex(make[0]);
                let tempData = this.Indexes[indexKey];
                dataToFilter = tempData.length < dataToFilter.length ? tempData : dataToFilter;
            } else if (make.length > 1) {
                let data: Array<ParsedItem> = [];
                for (let m of make) {
                    data = data.concat(this.Indexes[indexKey + this.makeIndex(m)]);
                }
                // if there are more then 1 make then we have to sort pricings again...
                data = data.sort((a: ParsedItem, b: ParsedItem) => a.pricing.price - b.pricing.price);
                dataToFilter = data;
            }
        }

        return dataToFilter;
    }

    /**
     * filterOne
     * @param id Id param
     * @description Returns the parsed item object if given id is visible and available.
     * @returns { Promise<ParsedItem> }
     */
    public async filterOne(id: string): Promise<ParsedItem> {
        if (!this.OnlyVisibleKeys[id]) {
            throw "Given id is not visible!";
        }
        let Data = this.Indexes[this.idIndex(id)][0];
        delete Data.teaser;
        delete Data.detailUrl;
        return Data;
    }

    /**
     * portfolioIndex
     * @param str Portfolio param
     * @description Creates a index key for given portfolio.
     * @returns { string }
     */
    private portfolioIndex(str: string): string {
        return "portfolio|" + str;
    }
    /**
     * makeIndex
     * @param str Make param
     * @description Creates a index key for given make.
     * @returns { string }
     */
    private makeIndex(str: string): string {
        return "make|" + str;
    }
    /**
     * idIndex
     * @param str Id param
     * @description Creates a index key for given id.
     * @returns { string }
     */
    private idIndex(str: string): string {
        return "id|" + str;
    }
}