export default class Utils {

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
