import { Injectable } from "@nestjs/common";
import { IAdapter } from "../Interfaces/IAdapter";
import { ParsedItem, ClunoParsed } from "../DTOs/Parsed-Cluno-DTO";
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class MongoDBDataAdapterService implements IAdapter {

    constructor(
        @InjectModel('Offers') private readonly offersModel: Model<ClunoParsed>
    ) {

    }

    /**
     * initialize
     * @description initializes the memory and objects.
     * @param count Count of the objects
     * @param scannedCount Scanned count of objects
     * @returns { Promise<void> }
     */
    public async initialize(count: number, scannedCount: number): Promise<void> {
        await this.removeAllOffers();
    }
    /**
     * onElementReceived
     * @description Received parsed Cluno item and creates indexes for it and stores it in mongodb.
     * @param parsedItem Parsed CLuno Item
     * @returns { Promise<void> }
     */
    public async onElementReceived(parsedItem: ParsedItem): Promise<void> {
        const CreateData = new this.offersModel(parsedItem);
        await CreateData.save();
    }

    /**
     * filter
     * @param portfolio Portfolio to filter
     * @param make Array of car manufacturers to filter.
     * @param priceStart Starting price, greater then equals to filter. priceEnd Parameter is Required !
     * @param priceEnd Ending price, lower then equals to filter. priceStart Parameter is Required !
     * @returns { Promise<Array<ParsedItem>> }
     */
    public async filter(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number): Promise<Array<ParsedItem>> {
        let NewQuery = { visible: true };
        if (make) if(make.length > 0) NewQuery["car.make.$in"] = make;
        if (portfolio) NewQuery["portfolio"] = portfolio;
        if (priceEnd != null && priceStart != null) NewQuery['pricing.price'] = { $gte: priceStart, $lte: priceEnd };
        try {
            return await this.offersModel.aggregate([{$match: NewQuery}, { $sort: { 'pricing.price': -1 } }]).exec();
        } catch (e) {
            throw e;
        }
    }

    /**
     * filterOne
     * @param id Id of item
     * @description Gets details of item for given Id if it's visible
     * @returns { Promise<ParsedItem> }
     */
    async filterOne(id: string): Promise<ParsedItem> {
        return await this.offersModel.findOne({ id: id, visible: true }, { teaser: 0, detailUrl: 0 }).exec();
    }

    /**
     * removeAllOffers
     * @description Remove all offers in db for start project
     * @returns { Promise<void> }
     */
    private async removeAllOffers(): Promise<void> {
        try {
            await this.offersModel.remove({});
        } catch (e) {
            throw e;
        }
    }
};