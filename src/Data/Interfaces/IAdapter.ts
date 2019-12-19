import { ParsedItem, ResItem } from "../DTOs/Parsed-Cluno-DTO";

export interface IAdapter {
    onElementReceived(parsedItem: ParsedItem, parsedResItem: ResItem): Promise<void>;
    initialize(count: number, scannedCount: number): Promise<void>;
    filter(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number, limit?: number): Promise<Array<ResItem>>;
    filterOne(id: string): Promise<ParsedItem>;
};