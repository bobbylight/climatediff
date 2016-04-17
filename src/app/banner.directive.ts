module climatediff {
    'use strict';

    export class BannerController {

        showAbout: boolean;

        constructor() {
            this.showAbout = false;
        }
    }
}

angular.module('cdApp').directive('cdBanner', [() => {
    'use strict';

    return {
        restrict: 'E',
        controller: climatediff.BannerController,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'directives/banner.html'
    };
}]);
