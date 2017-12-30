import { CityInfo, PrecipDataPoint, TempDataPoint, Response } from './climatediff';
import Ajax from './ajax';
import Utils from './utils';

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

    private tempCache: Cache<CityInfo<TempDataPoint>>;
    private precipCache: Cache<CityInfo<PrecipDataPoint>>;

    constructor() {
        this.tempCache = {};
        this.precipCache = {};
    }

    getPrecipitationData(callback: Callback<PrecipDataPoint>, failureCallback: Function, ...cities: string[]) {

        const cityData: CityInfo<PrecipDataPoint>[] = [];
        const cached: boolean[] = [];

        for (let i: number = 0; i < cities.length; i++) {
            const city: string = cities[i];
            cached.push(!!this.precipCache[city]);
            if (cached[i]) {
                cityData.push(this.precipCache[city]);
            }
        }

        if (DataSource.isSomethingNotCached(cached)) {

            let url: string = 'api/precipitation';
            for (let i: number = 0; i < cities.length; i++) {
                if (!cached[i]) {
                    url += `/${cities[i]}`;
                }
                else {
                    cityData[i] = cityData[i];
                }
            }

            const tempSuccess: Callback<PrecipDataPoint> = (data: Response<PrecipDataPoint>) => {

                Object.keys(data).forEach((city: string) => {

                    const temp: CityInfo<PrecipDataPoint> = data[city];

                    cityData[city] = this.precipCache[city] = {
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

        else {
            this.runCallback(this.precipCache, callback, failureCallback, ...cities);
        }
    }

    getTemperatureData(callback: Callback<TempDataPoint>, failureCallback: Function, ...cities: string[]) {

        const cityData: CityInfo<TempDataPoint>[] = [];
        const cached: boolean[] = [];

        for (let i: number = 0; i < cities.length; i++) {
            const city: string = cities[i];
            cached.push(!!this.tempCache[city]);
            if (cached[i]) {
                cityData.push(this.tempCache[city]);
            }
        }

        if (DataSource.isSomethingNotCached(cached)) {

            let url: string = 'api/temperature';
            for (let i: number = 0; i < cities.length; i++) {
                if (!cached[i]) {
                    url += `/${cities[i]}`;
                }
                else {
                    cityData[i] = cityData[i];
                }
            }

            const tempSuccess: Callback<TempDataPoint> = (data: Response<TempDataPoint>) => {

                Object.keys(data).forEach((city: string) => {

                    const temp: CityInfo<TempDataPoint> = data[city];

                    cityData[city] = this.tempCache[city] = {
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

        else {
            this.runCallback(this.tempCache, callback, failureCallback, ...cities);
        }
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
