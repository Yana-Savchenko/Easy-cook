const Api = (function () {
    //const token = localStorage.getItem('token');

    function Api() {
        this.get = function (url, options) {
            var options = options || {};
            options.method = 'GET';
            options.headers = options.headers || {};
            // options.headers["Authorization"] = "bearer " + localStorage.getItem('token') || null;
            return fetch(url, options);
        }

        this.post = function (url, options) {
            var options = options || {};
            options.method = 'POST';
            options.headers = options.headers || {};
           // options.headers["Authorization"] = "bearer " + localStorage.getItem('token') || null;
            options.body = options.body || {};
            console.log(options.body);
            return fetch(url, options);
        }

        this.put = function (url, options) {
            var options = options || {};
            options.method = 'PUT';
            options.headers = options.headers || {};
            // options.headers["Authorization"] = "bearer " + localStorage.getItem('token') || null;
            options.body = options.body || {};
            return fetch(url, options);
        }

        this.delete = function (url, options) {
            var options = options || {};
            options.method = 'DELETE';
            options.headers = options.headers || {};
            // options.headers["Authorization"] = "bearer " + localStorage.getItem('token') || null;
            return fetch(url, options);
        }
    }

    // if (!getCookie('token') && window.location.pathname !== '/') {
    //     window.location.replace('/auth/sign-in');
    // }
    // function getCookie(token) {
    //     var matches = document.cookie.match(new RegExp(
    //         "(?:^|; )" + token.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    //     ));
    //     return matches ? decodeURIComponent(matches[1]) : false;
    // }
    return new Api;

})()