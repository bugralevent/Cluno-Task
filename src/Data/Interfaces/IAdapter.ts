import { ParsedItem } from "../DTOs/Parsed-Cluno-DTO";

export interface IAdapter {
    onElementReceived(parsedItem: ParsedItem): Promise<void>;
    initialize(count: number, scannedCount: number): Promise<void>;
    filter(portfolio?: string, make?: string[], priceStart?: number, priceEnd?: number): Promise<Array<ParsedItem>>;
    filterOne(id: string): Promise<ParsedItem>;
};