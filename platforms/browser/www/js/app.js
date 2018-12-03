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
      templateUrl: 'base-app/1/profile.html'
    },
    {
      name: 'group-chat',
      url: '/group-chat',
      templateUrl: 'base-app/2/group-chat.html'
    },
	{
      name: 'infinito',
      url: '/infinito',
      templateUrl: 'base-app/3/infinito.html'
    },
    {
      name: 'notas-estudiante',
      url: '/notas-estudiante',
      templateUrl: 'base-app/nota-estudiante/nota-estudiante.html'
    },
	{
      name: 'apoyanos',
      url: '/apoyanos',
      templateUrl: 'base-app/5/apoyanos.html'
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