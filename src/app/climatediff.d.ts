export interface ChartConfig {
    units: UnitConfig[];
}

/**
 * Debug information about the remote call for cty info we made server-side.  This is essentially
 * debug information from curl.
 */
export interface CityDebugInfo {
    total_time: number;
    url: string;
}

/**
 * Monthly information about a city's climate.
 */
export interface CityInfo<T extends PrecipDataPoint | TempDataPoint> {
    data: T[];
    debug?: CityDebugInfo;
    errors?: Notification[];
    metadata?: CityMetadataInfo;
    queries: string[];
}

/**
 * Metadata about a city whose climate information was returned.
 */
export interface CityMetadataInfo {
    city_id: string;
    city_name: string;
    total_time: number[];
}

/**
 * Precipitation information, i.e. monthly or yearly, for a city.
 */
export interface PrecipDataPoint {
    precip: number;
    precipCount: number;
}

/**
 * Temperature information, i.e. monthly or yearly, for a city.
 */
export interface TempDataPoint {
    min: number;
    minCount: number;
    median: number;
    medianCount: number;
    max: number;
    maxCount: number;
}

/**
 * A notification from the server that is part of a temperature response.  Typically these contain notices that
 * some data was unavailable.
 */
export interface Notification {
    code: string;
    params: NotificationParam[];
}

/**
 * A parameter of a server notification.
 */
export type NotificationParam = Notification | string | number;

/**
 * Response from REST APIs for historical temperature and precipitation data of a city.
 */
export interface Response<T extends PrecipDataPoint | TempDataPoint> {
    [ cityName: string ]: CityInfo<T>;
}

export interface UnitConfig {
    axisSuffix: string;
    label: string;
    convert: UnitConversionFunction;
}

export interface UnitConversionFunction {
    (data: TempDataPoint[]): TempDataPoint[];
}
