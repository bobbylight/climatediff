class BannerController {

    showAbout: boolean;

    static $inject: string[] = [ '$window' ];

    constructor(private $window: ng.IWindowService) {
        this.showAbout = false;
    }

    viewOnGitHub() {
        this.$window.open('https://github.com/bobbylight/climatediff', '_blank');
    }
}

export default () => {

    return {
        restrict: 'E',
        controller: BannerController,
        controllerAs: 'vm',
        bindToController: true,
        templateUrl: 'directives/banner.html'
    };
};
