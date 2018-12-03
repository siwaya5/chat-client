(function () {
    'use strict';
    angular.module('app')
            .value('appConstantsView', {
                'URL_FILE': 'C:/chat_images/'
            }).run(function ($rootScope, appConstantsView) {
        $rootScope.appConstantsView = appConstantsView;
    });
})();