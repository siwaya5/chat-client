var app = angular.module('app', ['ui.router', 'objectTable','angular-growl']);

app.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/index');
  var array = [
  {
      name: 'index',
      url: '/index',
      template: '<h3>Welcome to Infinity Chat</h3>'
    },
	{
      name: 'profile',
      url: '/profile',
      templateUrl: 'base-app/profile/profile.html'
    },
    {
      name: 'group-chat',
      url: '/group-chat',
      templateUrl: 'base-app/group-chat/group-chat.html'
    },
	{
      name: 'infinito',
      url: '/infinito',
      templateUrl: 'base-app/chat/infinito.html'
    }

  ];

  for (let index = 0; index < array.length; index++) {
    $stateProvider.state(array[index]);;
  }

});

app.config(['growlProvider', function(growlProvider) {
  growlProvider.onlyUniqueMessages(true);
  growlProvider.globalTimeToLive(5000);
}]);