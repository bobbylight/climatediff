/**
 * Supported HTTP methods.
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * A simple key/value pair map for storing query parameters.
 */
export interface QueryParams {
    [ key: string ]: string;
}

/**
 * A very simple Ajax utility, suitable for this app's needs.  Even smaller than axios.  Micro-optimizations FTW!
 */
export default class Ajax {

    static get(url: string, queryParams: QueryParams, success: Function, failure: Function) {
        return Ajax.ajax('GET', url, queryParams, success, failure);
    }

    static ajax(verb: HttpMethod, url: string, queryParams: QueryParams, success: Function, failure: Function) {

        const request: XMLHttpRequest = new XMLHttpRequest();

        request.onload = (e: Event) => {

            if (request.status < 400) {
                success(request.response);
            } else if (failure) {
                failure(request.response);
            }
        };

        // Network errors
        request.onerror = (e: Event) => {
            if (failure) {
                failure(request.response);
            }
        };

        if (queryParams) {
            url = url + '?' + this.createQueryString(queryParams);
        }

        request.open(verb, url);
        request.responseType = 'json';
        request.send();
    }

    static createQueryString(queryParams: QueryParams): string {
        return Object.keys(queryParams)
            .map(key => {
                return `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`; 
            })
            .join('&');
    }
}
