import { IAngularStatic } from 'angular';

declare global {

    /**
     * Work around @types/angular* not using "global" typings like the typings tool did.
     * https://stackoverflow.com/questions/40664298/angular-1-x-with-typescript-2-x-types-and-systemjs-using-global-typings
     */
    const angular: IAngularStatic;
}

export interface ChartConfig {
    units: UnitConfig[];
}

/**
 * Debug information about the remote call for city info we made server-side.  This is essentially
 * debug information from curl.
 */
export interface CityDebugInfo {
    total_time: number;
    url: string;
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
    metadata: any;
    queries: string[];
}

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