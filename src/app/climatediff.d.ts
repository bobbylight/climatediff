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

export interface CityMetadataInfo {
    city_id: string;
    city_name: string;
    total_time: number[];
}

export interface CityTemperatureInfo {
    min: number;
    minCount: number;
    median: number;
    medianCount: number;
    max: number;
    maxCount: number;
}

export interface MonthRecord {
    city1: CityTemperatureInfo;
    city2: CityTemperatureInfo;
}

export interface TemperatureResponse {
    data: MonthRecord[];
    debug: { // TODO: Make not arrays!!
        city1: CityDebugInfo[],
        city2: CityDebugInfo[]
    };
    errors?: Notification[];
    metadata: CityMetadataInfo[];
    queries: string[];
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

export interface UnitConfig {
    axisSuffix: string;
    label: string;
    convert: UnitConversionFunction;
}

export interface UnitConversionFunction {
    (data: MonthRecord[]): MonthRecord[];
}

interface Window {
    d3: any;
}
