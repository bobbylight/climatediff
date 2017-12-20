import { Notification, NotificationParam } from './climatediff';

interface Resources {
    [ key: string ]: string;
}

/**
 * Localization utilities.  One day all this text should actually be localized.
 */
class Messages {

    private resources: Resources;

    constructor() {

        this.resources = {
            'error.noDataForCity': 'No data available for {0}',
            'error.noDataForCityForMonth': 'No data available for {0} for {1}',

            'month.0': 'January',
            'month.1': 'February',
            'month.2': 'March',
            'month.3': 'April',
            'month.4': 'May',
            'month.5': 'June',
            'month.6': 'July',
            'month.7': 'August',
            'month.8': 'September',
            'month.9': 'October',
            'month.10': 'November',
            'month.11': 'December'
        };

        this.localizeNotification = this.localizeNotification.bind(this);
    }

    /**
     * Fetch a localized string, similar to Java resource bundles.
     *
     * @param {string} key
     * @param {string[]} params
     * @returns {string}
     */
    get(key: string, params: string[] = null): string {

        let value: string = this.resources[key];

        if (params && params.length) {
            for (let i: number = 0; i < params.length; i++) {
                const pattern: RegExp = new RegExp(`\\{${i}\\}`, 'g');
                value = value.replace(pattern, params[i]);
            }
        }

        return value;
    }

    private localizeNotification(notification: Notification): string {

        let params: string[];
        if (notification.params && notification.params.length) {
            params = [];
            notification.params.forEach((param: NotificationParam) => {
                params.push(this.localizeNotificationParam(param));
            });
        }

        return this.get(notification.code, params);
    }

    /**
     * Converts a notification's parameter into a localized string.
     *
     * @param {NotificationParam} param The notification parameter.
     * @returns {string} The localized string for the parameter.
     */
    private localizeNotificationParam(param: NotificationParam): string {

        let strParam: string;

        if (typeof param === 'string') {
            strParam = param;
        }
        else if (typeof param === 'number') {
            strParam = param.toString();
        }
        else {
            strParam = this.localizeNotification(param);
        }

        return strParam;
    }

    /**
     * Convert a set of notifications from the server into localized strings.
     *
     * @param {Notification[]} notifications The set of notifications from the server.
     * @returns {string[]} Localized text strings for the notifications.
     */
    localizeNotifications(notifications: Notification[]): string[] {
        return notifications.map(this.localizeNotification);
    }
}

export default new Messages();
