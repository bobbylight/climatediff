module climatediff {
    'use strict';
    
    export interface AboutDialogScope extends ng.IScope {
        showAbout: boolean;
    }
}

angular.module('cdApp').directive('cdAbout', [() => {
    'use strict';
    
    const link: Function = function(scope: climatediff.AboutDialogScope, element: JQuery, attrs: ng.IAttributes) {
        
        scope.$watch('showAbout', (newValue: boolean, oldValue: boolean) => {
            if (newValue) {

                const aboutDialog: JQuery = element.find('#aboutDialog');
                aboutDialog.modal();

                const hideHandler: Function = (e: JQueryEventObject) => {
                    scope.$apply('showAbout = false;');
                    aboutDialog.off('hidden.bs.modal', <any>hideHandler);
                };
                aboutDialog.on('hidden.bs.modal', <any>hideHandler);
            }
        })
    };
    
    return {
        restrict: 'E',
        scope: {
            showAbout: '='
        },
        link: link,
        templateUrl: 'directives/about.html'
    };
}]);
