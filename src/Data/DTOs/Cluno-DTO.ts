export interface ClunoNotParsed {
    Items:            Item[];
    Count:            number;
    ScannedCount:     number;
    ConsumedCapacity: null;
}

export interface Item {
    portfolio:              StringDTO;
    conditions:             Conditions;
    visible:                Available;
    car:                    Car;
    available:              Available;
    detailUrl:              StringDTO;
    teaser:                 Teaser;
    labels:                 Labels;
    segment?:               StringDTO | undefined;
    images:                 Images;
    id:                     StringDTO;
    pricing:                Pricing;
    estimatedDeliveryTime?: StringDTO;
}

export interface Available {
    BOOL: boolean;
}

export interface Car {
    M: CarM;
}

export interface CarM {
    equipmentDetails: Labels;
    fueltype:         StringDTO;
    ps:               NumberDTO;
    offerExtColor:    StringDTO;
    gearingType:      StringDTO;
    ccm?:             StringDTO | undefined;
    kw:               NumberDTO;
    version?:         StringDTO;
    doors:            StringDTO;
    environment:      Environment;
    model:            StringDTO;
    drive:            StringDTO;
    make:             StringDTO;
}

export interface StringDTO {
    S: string;
}

export interface Environment {
    M: EnvironmentM;
}

export interface EnvironmentM {
    emissionLabel:       StringDTO;
    emissionClass:       StringDTO;
    consumptionCity:     NumberDTO;
    emissionCO2:         NumberDTO;
    consumptionCombined: NumberDTO;
    consumptionCountry:  NumberDTO;
}

export interface NumberDTO {
    N: String;
}

export interface Labels {
    L: LabelsL[];
}

export interface LabelsL {
    M: PurpleM;
}

export interface PurpleM {
    name: StringDTO;
}

export interface Conditions {
    M: ConditionsM;
}

export interface ConditionsM {
    minimumAge:         NumberDTO;
    maximumAge:         NumberDTO;
    minLicenseDuration: NumberDTO;
}

export interface Images {
    L: ImagesL[];
}

export interface ImagesL {
    M: FluffyM;
}

export interface FluffyM {
    width:  NumberDTO;
    title:  StringDTO;
    src:    StringDTO;
    height: NumberDTO;
}

export interface Pricing {
    M: PricingM;
}

export interface PricingM {
    startingFee:                  NumberDTO;
    deliveryFee:                  NumberDTO;
    monthlyExcessKilometers:      NumberDTO;
    excessKilometers:             NumberDTO;
    unusedKilometers:             NumberDTO;
    deductiblePartialCover:       NumberDTO;
    price:                        NumberDTO;
    bookableOptions:              BookableOptions;
    deductibleFullyComprehensive: NumberDTO;
    includedAnnualKilometers:     NumberDTO;
}

export interface BookableOptions {
    L: BookableOptionsL[];
}

export interface BookableOptionsL {
    M: TentacledM;
}

export interface TentacledM {
    name:     StringDTO;
    price:    NumberDTO;
    selected: Available;
}

export interface Teaser {
    M: TeaserM;
}

export interface TeaserM {
    title:                StringDTO;
    teaserImage:          StringDTO;
    equipmentHighlights?: Labels;
}
