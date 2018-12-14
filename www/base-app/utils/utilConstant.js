app.service('appConstant', ['growl', function (growl) {
        this.SHOW_MSG_ERROR = function (Mensaje) {
            $.notify({
                icon: "add_alert",
                message: Mensaje
            }, {
                type: 'danger',
                timer: 1000,
                z_index: 100000,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }

        this.SHOW_MSG_INFO = function (Mensaje) {
            $.notify({
                icon: "add_alert",
                message: Mensaje
            }, {
                type: 'info',
                timer: 1000,
                z_index: 100000,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }

        this.SHOW_MSG_WARNING = function (Mensaje) {
            $.notify({
                icon: "add_alert",
                message: Mensaje
            }, {
                type: 'warning',
                timer: 1000,
                z_index: 100000,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }

        this.SHOW_MSG_SUCCESS = function (Mensaje) {
            $.notify({
                icon: "done",
                message: Mensaje
            }, {
                type: 'success',
                timer: 1000,
                z_index: 100000,
                placement: {
                    from: 'top',
                    align: 'right'
                }
            });
        }

        this.CREATE_CHAT_BUBBLE = function (globalStyle, username, message, time, divBubblelStyle) {
            return '<div class="' + globalStyle + '">' +
                    '<div class="txt">' +
                    '<p class="name">' + username + '</p>' +
                    '<p class="message">' + message + '</p>' +
                    '<span class="timestamp">' + time + '</span>' +
                    '</div>' +
                    '<div class="' + divBubblelStyle + '"></div>' +
                    '</div>';
        };

    }]).constant('appGenericConstant', {
    'URL': 'http://localhost:2000/api/',
    'URL_FILE': 'C:/chat_images/',
    'ERROR_INESPERADO': 'Ha ocurrido un error inesperado, por favor contactar al administrador'
});