import { Injectable } from "@nestjs/common";
import { IAdapter } from "../Interfaces/IAdapter";
import { ParsedItem, ClunoParsed, ResItem } from "../DTOs/Parsed-Cluno-DTO";

@Injectable()
export class InMemoryDataAdapterService implements IAdapter {

    /**
     * @description This adapter is written for the cases of no limitations of memory usage
     * instead of cpu intensive loops, we use more memory to store indexes and create them once.
     */
    constructor() { }
    parsedData: ClunoParsed;
    OnlyVisibleKeys: Map<string, boolean> = new Map<string, boolean>();
    Indexes: Map<string, Array<ParsedItem>> = new Map<string, Array<ParsedItem>>();
    OfferIndexes: Map<string, Array<ResItem>> = new Map<string, Array<ResItem>>();
    IndexedVisibleOffers: Array<ResItem> = new Array<ResItem>();

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
    }
    /**
     * onElementReceived
     * @description Received parsed Cluno item and creates indexes for it and stores it in memory.
     * @param parsedItem Parsed CLuno Item
     * @returns { Promise<void> }
     */
    public async onElementReceived(parsedItem: ParsedItem, parsedResItem: ResItem): Promise<void> {
        if (parsedItem.visible) {
            this.IndexedVisibleOffers.push(parsedResItem);
            this.OnlyVisibleKeys[parsedItem.id] = true;
            this.indexCreation(parsedItem);
            this.OfferIndexes[this.portfolioIndex(parsedItem.portfolio)].push(parsedItem);
            this.OfferIndexes[this.makeIndex(parsedItem.car.make)].push(parsedItem);
            this.Indexes[this.idIndex(parsedItem.id)].push(parsedItem);
            this.OfferIndexes[this.portfolioIndex(parsedItem.portfolio) + "|" + this.makeIndex(parsedItem.car.make)].push(parsedItem);
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
    public async filter(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number, limit?: number): Promise<Array<ResItem>> {
        let dataToFilter = this.indexDecision(portfolio, make);
        if (priceEnd != null && priceStart != null) {
            dataToFilter = dataToFilter.filter((item: ResItem) => {
                return item.price >= priceStart && item.price <= priceEnd;
            });
        }
        if (limit) {
            return dataToFilter.slice(0, limit);
        }
        return dataToFilter;
    }

    /**
     * inndexCreation
     * @description creates indexes if not exists by given parsed cluno item.
     * @param parsedItem Parsed CLuno Item
     */
    private indexCreation(parsedItem: ParsedItem) {
        if (!this.Indexes[this.idIndex(parsedItem.id)]) {
            this.Indexes[this.idIndex(parsedItem.id)] = [];
        }
        //create portfolio index if not exists
        if (!this.OfferIndexes[this.portfolioIndex(parsedItem.portfolio)]) {
            this.OfferIndexes[this.portfolioIndex(parsedItem.portfolio)] = [];
        }
        //create portfolio index if not exists
        if (!this.OfferIndexes[this.makeIndex(parsedItem.car.make)]) {
            this.OfferIndexes[this.makeIndex(parsedItem.car.make)] = [];
        }
        if (!this.OfferIndexes[this.portfolioIndex(parsedItem.portfolio) + "|" + this.makeIndex(parsedItem.car.make)]) {
            this.OfferIndexes[this.portfolioIndex(parsedItem.portfolio) + "|" + this.makeIndex(parsedItem.car.make)] = [];
        }
    }

    /**
     * indexDecision
     * @description index desicion of the given parameters and returns indexed items.
     * @param portfolio Portfolio of the item
     * @param make Make of the car
     * @returns { Array<ResItem> }
     */
    private indexDecision(portfolio?: string, make?: string[]): Array<ResItem> {
        let dataToFilter: Array<ResItem> = this.IndexedVisibleOffers;
        let indexKey = "";
        if (portfolio != null) {
            indexKey = this.portfolioIndex(portfolio);
            if (make == null) {
                dataToFilter = this.OfferIndexes[indexKey];
            } else {
                indexKey += "|";
            }
        }

        if (make != null) {
            if (make.length == 1) {
                indexKey += this.makeIndex(make[0]);
                let tempData = this.OfferIndexes[indexKey];
                dataToFilter = tempData.length < dataToFilter.length ? tempData : dataToFilter;
            } else if (make.length > 1) {
                let data: Array<ResItem> = [];
                for (let m of make) {
                    data = data.concat(this.OfferIndexes[indexKey + this.makeIndex(m)]);
                }
                // if there are more then 1 make then we have to sort pricings again...
                data = data.sort((a: ResItem, b: ResItem) => a.price - b.price);
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