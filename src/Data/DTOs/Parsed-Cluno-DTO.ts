export interface ClunoParsed {
    Items:            ParsedItem[];
    Count:            number;
    ScannedCount:     number;
    ConsumedCapacity: null;
}

export interface ParsedItem {
    portfolio:              string;
    conditions:             ParsedConditions;
    visible:                boolean;
    car:                    ParsedCar;
    available:              boolean;
    detailUrl:              string;
    teaser:                 ParsedTeaser;
    labels:                 ParsedLabel[];
    segment:                string | undefined;
    images:                 ParsedImage[];
    id:                     string;
    pricing:                ParsedPricing;
    estimatedDeliveryTime : string | undefined;
}

export interface ResItem {
    id: string;
    price: number;
    labels: ParsedLabel[];
    teaser: ParsedTeaser;
    detailUrl: string;

};

export interface ParsedCar {
    equipmentDetails: ParsedLabel[];
    fueltype:         string;
    ps:               number;
    offerExtColor:    string;
    gearingType:      string;
    ccm:              string | undefined;
    kw:               number;
    version:          string | undefined;
    doors:            string;
    environment:      ParsedEnvironment;
    model:            string;
    drive:            string;
    make:             string;
}

export interface ParsedConditions {
    minimumAge:         number;
    maximumAge:         number;
    minLicenseDuration: number;
}

export interface ParsedPricing {
    startingFee:                  number;
    deliveryFee:                  number;
    monthlyExcessKilometers:      number;
    excessKilometers:             number;
    unusedKilometers:             number;
    deductiblePartialCover:       number;
    price:                        number;
    bookableOptions:              ParsedBookableOptions[];
    deductibleFullyComprehensive: number;
    includedAnnualKilometers:     number;
}

export interface ParsedTeaser {
    title:                string;
    teaserImage:          string;
    equipmentHighlights: ParsedLabel[] | undefined;
}

export interface ParsedLabel {
    name:                 string;
}

export interface ParsedEnvironment {
    emissionLabel:       string;
    emissionClass:       string;
    consumptionCity:     number;
    emissionCO2:         number;
    consumptionCombined: number;
    consumptionCountry:  number;
}

export interface ParsedBookableOptions {
    name:     string;
    price:    number;
    selected: boolean;
}

export interface ParsedImage {
    width:  number;
    title:  string;
    src:    string;
    height: number;
}