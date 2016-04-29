module climatediff {
    'use strict';

    export class BannerController {

        showAbout: boolean;

        static $inject: string[] = [ '$window' ];

        constructor(private $window: ng.IWindowService) {
            this.showAbout = false;
        }

        viewOnGitHub() {
            this.$window.open('https://github.com/bobbylight/climatediff', '_blank');
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
