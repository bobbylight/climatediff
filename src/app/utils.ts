import { TempDataPoint } from './climatediff';

/**
 * Obligatory utility methods.
 */
export default class Utils {

    static arrayCtoF(data: TempDataPoint[]): TempDataPoint[] {
        return Utils.convertTemperature(data, Utils.celsiusToFahrenheit);
    }

    static arrayFtoC(data: TempDataPoint[]): TempDataPoint[] {
        return Utils.convertTemperature(data, Utils.fahrenheitToCelsius);
    }

    private static convertTemperature(data: TempDataPoint[], converter: Function): TempDataPoint[] {
        return data.map((elem: TempDataPoint) => {
            // Ensure 'min' is defined as empty city objects can be sent down on error
            if (elem && typeof elem.min === 'number') {
                elem.min = converter(elem.min);
                elem.median = converter(elem.median);
                elem.max = converter(elem.max);
            }
            return elem;
        });
    }

    static celsiusToFahrenheit(c: number): number {
        // tslint:disable-next-line:no-magic-numbers
        return c * (9 / 5) + 32;
    }

    static fahrenheitToCelsius(f: number): number {
        // tslint:disable-next-line:no-magic-numbers
        return (f - 32) * (5 / 9);
    }

    static cityRouteFormToReadableForm(routeFormCity: string): string {
        return routeFormCity.replace(/_/g, ' ');
    }

    static cityReadableFormToRouteForm(readableFormCity: string): string {
        return readableFormCity.replace(/ /g, '_');
    }
}
