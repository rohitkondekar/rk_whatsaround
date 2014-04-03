// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
'use strict';
angular.module('Whatsaround',
        [
            'ionic',
            'Whatsaround.services',
            'Whatsaround.controllers',
            'ngAnimate',
            'kinvey'])


    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {


        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            .state('unauthorizedhome', {
                url: "/unauthorizedhome",
                templateUrl: 'templates/unauthorizedhome.html',
                controller: function () {
                    console.log("In unauthorizedHome controller");
                }
            })

            .state('login', {
                url: "/login",
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl'
            })

            .state('signup', {
                url: "/signup",
                templateUrl: 'templates/signup.html',
                controller: 'SignupCtrl'
            })

            .state('home',{
                url: "/home",
                templateUrl: 'templates/home.html',
                abstract: true,
                controller: 'HomeCtrl'
            })

            .state('home.all', {
                url: "/all",
                abstract: true,
                views: {
                    'home-partial': {
                        templateUrl: 'templates/tabs.all.html'
                    }
                }
            })

            .state('home.restaurants', {
                url: "/restaurants",
                abstract: true,
                views: {
                    'home-partial': {
                        templateUrl: 'templates/tabs.restaurants.html'
                    }
                }
            })

            .state('home.clothing', {
                url: "/clothing",
                abstract: true,
                views: {
                    'home-partial': {
                        templateUrl: 'templates/tabs.clothing.html'
                    }
                }
            })

            .state('home.electronics', {
                url: "/electronics",
                abstract: true,
                views: {
                    'home-partial': {
                        templateUrl: 'templates/tabs.electronics.html'
                    }
                }
            })

            .state('home.all.recommended', {
                url: "/recommended",
                views: {
                    'tab-recommended': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.all.nearby', {
                url: "/nearby",
                views: {
                    'tab-nearby': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.restaurants.recommended', {
                url: "/recommended",
                views: {
                    'tab-recommended': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.restaurants.nearby', {
                url: "/nearby",
                views: {
                    'tab-nearby': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.clothing.recommended', {
                url: "/recommended",
                views: {
                    'tab-recommended': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.clothing.nearby', {
                url: "/nearby",
                views: {
                    'tab-nearby': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.electronics.recommended', {
                url: "/recommended",
                views: {
                    'tab-recommended': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            })

            .state('home.electronics.nearby', {
                url: "/nearby",
                views: {
                    'tab-nearby': {
                        templateUrl: 'templates/data.html',
                        controller: 'ShopCtrl'
                    }
                }
            });


        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/unauthorizedhome');

    }])

    //Connect to kinvey
    .run(['$kinvey', '$rootScope', '$state', function ($kinvey, $rootScope, $state) {
        var promise = $kinvey.init({
            appKey: 'kid_VeQQoIkavO',
            appSecret: '0fa1deccde0a40fa84f9e82f8cd8c78e'
        });
        promise.then(function (response) {
           console.log("Successful Kinvey Init - " + JSON.stringify(response));

            if(response){
                $state.go('home.all.recommended');
            }

        }, function (error) {
            console.log("error - " + JSON.stringify(error));
        });

        $rootScope.toTitleCase = function (str) {
            return str.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        };
    }])


    //Skip login page - still unauthorized page is show right now
    .run(['$rootScope', '$state', '$window', 'Auth',function($rootScope, $state, $window, Auth){
        $rootScope.$on("$stateChangeStart",function(event, toState, toParams, fromState, fromParams){
            console.log("State Change Start "+toState.url);
            if(toState.url.indexOf("login")!=-1 || toState.url.indexOf("signup")!=-1){
                var user;
                if(user=Auth.getCurrentUser()){
                    //$window.localStorage.setItem("user", JSON.stringify(user));
                    $rootScope.currentUser = user;
                    event.preventDefault();
                    $state.go("home.all.recommended");
                }
            }
        });
    }])



//    .directive('animateads', function () {
//        return {
//            require: 'ngModel',
//            link: function (scope, elem, attrs, ngModel) {
//                scope.$watch(
//                    function () {
//                        return ngModel.$modelValue;
//                    },
//                    function (newValue, oldValue) {
//
//                        // to show in animation - fade out old value and fade in new value
//                        if (newValue === oldValue) {
//                            elem.html(newValue);
//                        } else {
//                            elem.html(oldValue);
//
//                            elem.fadeOut(1000,function () {
//                                elem.html(newValue);
//                            }).fadeIn(1000);
//                        }
//
//                    }
//                );
//            }
//        }
//    })


   

