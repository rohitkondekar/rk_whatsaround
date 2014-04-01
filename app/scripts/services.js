'use strict';
angular.module('Whatsaround.services', ['kinvey'])

    .service('Auth',['$kinvey',function Auth($kinvey) {
        // AngularJS will instantiate a singleton by calling "new" on this function

        var Auth = {

            signUp: function(user){
                var promise = $kinvey.User.signup({
                    username : user.username,
                    password : user.password
                });
                return promise;
            },

            login: function(user){
                var promise = $kinvey.User.login({
                    username : user.username,
                    password : user.password
                });
                return promise;
            },

            logout: function(){
                var user = $kinvey.getActiveUser();
                if(null !== user) {
                    var promise = $kinvey.User.logout({ force: true });
                    return promise;
                }
                console.log("Logged out");
                return true;
            },

            getCurrentUser: function(){
                return $kinvey.getActiveUser();
            }
        }
        return Auth;

    }])

    .factory('cordovaReady', function () {
        return function (fn) {

            var queue = [];

            var impl = function () {
                queue.push(Array.prototype.slice.call(arguments));
            };

            document.addEventListener('deviceready', function () {

                console.log("in device ready");
                queue.forEach(function (args) {
                    fn.apply(this, args);
                });
                impl = fn;

            }, false);

            return function () {
                return impl.apply(this, arguments);
            };
        };
    });

