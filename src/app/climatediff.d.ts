declare module climatediff {

    export interface ChartConfig {
        unit: string;
    }
    
    /**
     * Debug information about the remote call for city info we made server-side.  This is essentially
     * debug information from curl.
     */
    export interface CityDebugInfo {
        total_time: number;
        url: string;
    }

    export interface MonthRecord {
        city1: any;
        city2: any;
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
}

interface Window {
    d3: any;
}

/**
 * d3-tip library does not have typings defined
 */
declare namespace d3 {

    export function tip(): any;
    export var legend: any;
}