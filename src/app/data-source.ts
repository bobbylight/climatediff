import { CityInfo, PrecipDataPoint, TempDataPoint, Response } from './climatediff';
import Ajax from './ajax';
import Utils from './utils';

/**
 * A mapping from strings to data points.
 */
interface Cache<T extends CityInfo<TempDataPoint | PrecipDataPoint>> {
    [ key: string ]: T;
}

/**
 * Callback that receives responses from our asynchronous <code>get*()</code> methods.
 */
export interface Callback<T extends TempDataPoint | PrecipDataPoint> {
    (data: Response<T>): void;
}

/**
 * Loads precipitation and temperature data.  All data is returned from a local cache if a city has been queried
 * previously.
 */
export class DataSource {

    private readonly tempCache: Cache<CityInfo<TempDataPoint>>;
    private readonly precipCache: Cache<CityInfo<PrecipDataPoint>>;

    constructor() {
        this.tempCache = {};
        this.precipCache = {};
    }

    getPrecipitationData(callback: Callback<PrecipDataPoint>, failureCallback: Function, ...cities: string[]) {

        const cached: boolean[] = [];
        for (let i: number = 0; i < cities.length; i++) {
            cached.push(!!this.precipCache[cities[i]]);
        }

        if (DataSource.isSomethingNotCached(cached)) {
            this.getPrecipitationDataSomeUncached(callback, failureCallback, cached, ...cities);
        }
        else {
            this.runCallback(this.precipCache, callback, failureCallback, ...cities);
        }
    }

    private getPrecipitationDataSomeUncached(callback: Callback<PrecipDataPoint>, failureCallback: Function,
                                           cached: boolean[], ...cities: string[]) {

        // Build the URL to fetch data for cities not yet cached
        let url: string = 'api/precipitation';
        for (let i: number = 0; i < cities.length; i++) {
            if (!cached[i]) {
                url += `/${cities[i]}`;
            }
        }

        const tempSuccess: Callback<PrecipDataPoint> = (data: Response<PrecipDataPoint>) => {

            Object.keys(data).forEach((city: string) => {

                const temp: CityInfo<PrecipDataPoint> = data[city];

                this.precipCache[city] = {
                    data: temp.data,
                    metadata: temp.metadata,
                    debug: temp.debug,
                    errors: temp.errors,
                    queries: temp.queries
                };
            });
            this.runCallback(this.precipCache, callback, failureCallback, ...cities);
        };

        Ajax.get(url, null, tempSuccess, failureCallback);
    }

    getTemperatureData(callback: Callback<TempDataPoint>, failureCallback: Function, ...cities: string[]) {

        const cached: boolean[] = [];
        for (let i: number = 0; i < cities.length; i++) {
            cached.push(!!this.tempCache[cities[i]]);
        }

        if (DataSource.isSomethingNotCached(cached)) {
            this.getTemperatureDataSomeUncached(callback, failureCallback, cached, ...cities);
        }
        else {
            this.runCallback(this.tempCache, callback, failureCallback, ...cities);
        }
    }

    private getTemperatureDataSomeUncached(callback: Callback<TempDataPoint>, failureCallback: Function,
                                           cached: boolean[], ...cities: string[]) {

        // Build the URL to fetch data for cities not yet cached
        let url: string = 'api/temperature';
        for (let i: number = 0; i < cities.length; i++) {
            if (!cached[i]) {
                url += `/${cities[i]}`;
            }
        }

        const tempSuccess: Callback<TempDataPoint> = (data: Response<TempDataPoint>) => {

            Object.keys(data).forEach((city: string) => {

                const temp: CityInfo<TempDataPoint> = data[city];

                this.tempCache[city] = {
                    data: Utils.arrayCtoF(temp.data),
                    metadata: temp.metadata,
                    debug: temp.debug,
                    errors: temp.errors,
                    queries: temp.queries
                };
            });
            this.runCallback(this.tempCache, callback, failureCallback, ...cities);
        };

        Ajax.get(url, null, tempSuccess, failureCallback);
    }

    static isSomethingNotCached(cached: boolean[]): boolean {
        for (let i: number = 0; i < cached.length; i++) {
            if (!cached[i]) {
                return true;
            }
        }
        return false;
    }

    private runCallback(cache: Cache<any>, callback: Callback<any>, failureCallback: Function,
                           ...cities: string[]) {

        const response: Response<any> = {};

        cities.forEach((city: string) => {
            response[city] = cache[city];
        });
        callback(response);
    }
}

const dataSource: DataSource = new DataSource();
export default dataSource;
