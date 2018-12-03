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


        this.downloadArchivo = function (file, microservicio) {
            var urlRequest = url + 'api/' + microservicio + '/report/' + file;
            return urlRequest;
        };

        this.downloadReporte = function (urlRequest, itemArc) {
            $http({
                method: 'GET',
                url: appGenericConstant.URL + urlRequest,
                header: {Authorization: localStorage.autorizacion},
                responseType: 'arraybuffer'
            }).then(function (data, status, headers) {
                data = data.data;
                // headers = headers();
                var filename = itemArc + '.pdf';
                var contentType = 'application/pdf';
                var linkElement = document.createElement('a');
                try {
                    var blob = new Blob([data], {type: contentType});
                    var url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute("download", filename);
                    var clickEvent = new MouseEvent("click", {
                        view: window,
                        bubbles: true,
                        cancelable: false
                    });
                    linkElement.dispatchEvent(clickEvent);
                } catch (ex) {
                }
            }).catch(function (data) {
            });
        };

    }]);