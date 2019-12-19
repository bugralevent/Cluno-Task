import { Injectable } from '@nestjs/common';
import { Item, BookableOptionsL, LabelsL, ImagesL } from '../DTOs/Cluno-DTO';
import { ParsedPricing, ParsedItem, ParsedTeaser, ParsedConditions, ParsedCar, ParsedEnvironment, ResItem } from '../DTOs/Parsed-Cluno-DTO';

@Injectable()
export class ParserService {
    ParseResItem(item: ParsedItem): ResItem {
        return {
            id: item.id,
            teaser: item.teaser,
            detailUrl: item.detailUrl,
            labels: item.labels,
            price: item.pricing.price
        };
    }
    ParsePricing(item: Item): ParsedPricing {
        return {
            startingFee: Number(item.pricing.M.startingFee.N),
            deliveryFee: Number(item.pricing.M.deliveryFee.N),
            monthlyExcessKilometers: Number(item.pricing.M.monthlyExcessKilometers.N),
            excessKilometers: Number(item.pricing.M.excessKilometers.N),
            unusedKilometers: Number(item.pricing.M.unusedKilometers.N),
            deductiblePartialCover: Number(item.pricing.M.deductiblePartialCover.N),
            price: Number(item.pricing.M.price.N),
            bookableOptions: item.pricing.M.bookableOptions.L.map((value: BookableOptionsL) => { return { name: value.M.name.S, price: Number(value.M.price.N), selected: value.M.selected.BOOL }; }),
            deductibleFullyComprehensive: Number(item.pricing.M.deductibleFullyComprehensive.N),
            includedAnnualKilometers: Number(item.pricing.M.includedAnnualKilometers.N)
        };
    }

    ParseTeaser(item: Item): ParsedTeaser {
        return {
            title: item.teaser.M.title.S,
            teaserImage: item.teaser.M.teaserImage.S,
            equipmentHighlights: item.teaser.M.equipmentHighlights?.L.map((label: LabelsL) => { return { name: label.M.name.S }; })
        };
    }

    ParseConditions(item: Item): ParsedConditions {
        return {
            maximumAge: Number(item.conditions.M.maximumAge.N),
            minimumAge: Number(item.conditions.M.minimumAge.N),
            minLicenseDuration: Number(item.conditions.M.minLicenseDuration.N)
        };
    }

    ParseEnvironment(item: Item): ParsedEnvironment {
        return {
            emissionLabel: item.car.M.environment.M.emissionLabel.S,
            emissionClass: item.car.M.environment.M.emissionClass.S,
            consumptionCity: Number(item.car.M.environment.M.consumptionCity.N),
            emissionCO2: Number(item.car.M.environment.M.emissionCO2.N),
            consumptionCombined: Number(item.car.M.environment.M.consumptionCombined.N),
            consumptionCountry: Number(item.car.M.environment.M.consumptionCountry.N)
        };
    }

    ParseCar(item: Item): ParsedCar {
        return {
            equipmentDetails: item.car.M.equipmentDetails.L.map((equipmentDetail) => { return { name: equipmentDetail.M.name.S } }),
            fueltype: item.car.M.fueltype.S,
            ps: Number(item.car.M.ps.N),
            offerExtColor: item.car.M.offerExtColor.S,
            gearingType: item.car.M.gearingType.S,
            ccm: item.car.M.ccm?.S,
            kw: Number(item.car.M.kw.N),
            version: item.car.M.version?.S,
            doors: item.car.M.doors.S,
            environment: this.ParseEnvironment(item),
            model: item.car.M.model.S,
            drive: item.car.M.drive.S,
            make: item.car.M.make.S,
        };
    }

    ParseItem(item: Item): ParsedItem {
        return {
            available: item.available.BOOL,
            portfolio: item.portfolio.S,
            visible: item.visible.BOOL,
            detailUrl: item.detailUrl.S,
            labels: item.labels.L.map((label: LabelsL) => { return { name: label.M.name.S } }),
            segment: item.segment?.S,
            id: item.id.S,
            estimatedDeliveryTime: item.estimatedDeliveryTime?.S,
            images: item.images.L.map((x: ImagesL) => { return { width: Number(x.M.width.N), height: Number(x.M.height.N), title: x.M.title.S, src: x.M.src.S } }),
            pricing: this.ParsePricing(item),
            teaser: this.ParseTeaser(item),
            conditions: this.ParseConditions(item),
            car: this.ParseCar(item)
        };
    }
};