module climatediff {
    'use strict';

    export class MonthService {

        private static MONTHS: string[] = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

        static get(i: number): string {
            return MonthService.MONTHS[i];
        }
    }
}

angular.module('cdApp').constant('Months', climatediff.MonthService);