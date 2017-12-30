import { TempDataPoint } from './climatediff';

export default class Utils {

    static arrayCtoF(data: TempDataPoint[]): TempDataPoint[] {
        return data.map((elem: TempDataPoint) => {
            // Ensure 'min' is defined as empty city objects can be sent down on error
            if (elem && typeof elem.min === 'number') {
                elem.min = Utils.celsiusToFahrenheit(elem.min);
                elem.median = Utils.celsiusToFahrenheit(elem.median);
                elem.max = Utils.celsiusToFahrenheit(elem.max);
            }
            return elem;
        });
    }

    static arrayFtoC(data: TempDataPoint[]): TempDataPoint[] {
        return data.map((elem: TempDataPoint) => {
            // Ensure 'min' is defined as empty city objects can be sent down on error
            if (elem && typeof elem.min === 'number') {
                elem.min = Utils.fahrenheitToCelsius(elem.min);
                elem.median = Utils.fahrenheitToCelsius(elem.median);
                elem.max = Utils.fahrenheitToCelsius(elem.max);
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
