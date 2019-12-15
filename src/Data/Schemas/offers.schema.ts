import * as mongoose from 'mongoose';

export const OfferSchema = new mongoose.Schema({
    available: Boolean,
    portfolio: String,
    visible: Boolean,
    detailUrl: String,
    labels: [
        {
            name: String
        }
    ],
    segment: String,
    id: String,
    estimatedDeliveryTime: String,
    images: [
        {
            width: Number,
            height: Number,
            title: String,
            src: String
        }
    ],
    pricing: {
        startingFee: Number,
        deliveryFee: Number,
        monthlyExcessKilometers: Number,
        excessKilometers: Number,
        unusedKilometers: Number,
        deductiblePartialCover: Number,
        price: Number,
        bookableOptions: [
            {
                name: String,
                price: Number,
                selected: Boolean
            }
        ],
        deductibleFullyComprehensive: Number,
        includedAnnualKilometers: Number
    },
    teaser: {
        title: String,
        teaserImage: String,
        equipmentHighlights: [
            {
                name: String
            }
        ]
    },
    conditions: {
        maximumAge: Number,
        minimumAge: Number,
        minLicenseDuration: Number
    },
    car: {
        equipmentDetails: [
            {
                name: String
            }
        ],
        fueltype: String,
        ps: Number,
        offerExtColor: String,
        gearingType: String,
        ccm: String,
        kw: Number,
        version: String,
        doors: String,
        environment: {
            emissionLabel: String,
            emissionClass: String,
            consumptionCity: Number,
            emissionCO2: Number,
            consumptionCombined: Number,
            consumptionCountry: Number
        },
        model: String,
        drive: String,
        make: String,
    }
});