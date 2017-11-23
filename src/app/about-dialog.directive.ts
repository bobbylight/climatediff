export interface AboutDialogScope extends ng.IScope {
    showAbout: boolean;
}

export default () => {

    return {
        restrict: 'E',
        scope: {
            showAbout: '='
        },
        link: (scope: AboutDialogScope, element: JQuery, attrs: ng.IAttributes) => {

            scope.$watch('showAbout', (newValue: boolean, oldValue: boolean) => {
                if (newValue) {

                    const aboutDialog: JQuery = element.find('#aboutDialog');
                    aboutDialog.modal();

                    const hideHandler: Function = (e: JQuery.Event) => {
                        scope.$apply('showAbout = false;');
                        aboutDialog.off('hidden.bs.modal', <any>hideHandler);
                    };
                    aboutDialog.on('hidden.bs.modal', <any>hideHandler);
                }
            });
        },
        templateUrl: 'directives/about.html'
    };
};
