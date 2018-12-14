app.service('utilServices', ['$http', '$q', 'appGenericConstant', function ($http, $q, appGenericConstant) {
        var util = this;
        this.SOCKET_SERVER = io.connect('http://localhost:2000/');

        this.SERVICE_GET = function (urlRequest) {
            var defered = $q.defer();
            $http.get(urlRequest).then(function (status, data) {
                defered.resolve(status.data);
            }).catch(function (error, response) {
                defered.reject(error);
            });
            return defered.promise;
        };

        this.SERVICE_POST = function (urlRequest, rs) {
            var defered = $q.defer();
            $http.post(urlRequest, rs).success(function (response) {
                defered.resolve(response);
            }).error(function (error) {
                defered.reject(error);
            });
            return defered.promise;
        }
        
    }]);