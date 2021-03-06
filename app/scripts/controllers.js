'use strict';
angular.module('Whatsaround.controllers', ['Whatsaround.services','ionic'])



    .controller('unauthorizedhomeCtrl', function(){

    })

//    Login Controller
    .controller('LoginCtrl', ['$scope', '$location', 'Auth', '$state', 'Loader', '$rootScope', function ($scope, $location, Auth, $state, Loader, $rootScope) {


        $scope.login = function(user){
            if(user){
                Loader.show();
                Auth.login(user).then(function(response){
                        Loader.hide();
                        $rootScope.currentUser = response;
                        $state.go('home.all.recommended');
                    },
                    function(error){
                        Loader.hide();
                        console.log("Error in logging user -- "+JSON.stringify(error));
                    });
            }
            else{
                console.log("User not defined");
            }
        };

    }])


//    Signup Controller
    .controller('SignupCtrl', ['$scope', '$location', 'Auth', '$ionicLoading', 'LoadingService', '$rootScope', function ($scope, $location, Auth, $ionicLoading, LoadingService, $rootScope) {

        $scope.signup = function (user) {
            if (user) {
               Loader.show();
                Auth.signUp(user).then(function (response) {
                        Loader.hide();
                        console.log("User successfully signed -- " + JSON.stringify(response));
                        $rootScope.currentUser = response;
                        $location.path('home.all.recommended');
                        hide();
                    },
                    function (error) {
                        Loader.hide();
                        console.log("Error signing up user -- " + JSON.stringify(error));
                        hide();
                    });
            }
            else {
                console.log("Error signing up user -- user null");
            }
        }

    }])



    //Home controller handles side menu control

    .controller('HomeCtrl',['$scope','$window', '$ionicSideMenuDelegate', '$state', 'Auth',
        function ($scope,$window, $ionicSideMenuDelegate, $state, Auth) {

            $scope.user = JSON.parse($window.localStorage.getItem("user"));
            $scope.city = $window.localStorage.getItem("currentCity");

            $scope.toggleLeft = function(){
                $ionicSideMenuDelegate.toggleLeft();
            };

            $scope.logout = function(){
                $scope.toggleLeft();
                console.log("Logging out");
                Auth.logout().then(function(response){
                        $state.go('unauthorizedhome');
                    },
                    function(error){
                        console.log("Error in Logout - "+JSON.stringify(error));
                    })

            }

            $scope.ok = function(){
                console.log('pressed');
            }


        }])



//    Main Shop controller handles shops display data

    .controller('ShopCtrl', ['$scope', '$ionicNavBarDelegate', '$location', '$state' ,'$kinvey', 'cordovaReady', '$interval', '$rootScope',
        function ($scope, $ionicNavBarDelegate, $location, $state ,$kinvey, cordovaReady, $interval, $rootScope) {

            //Hide First Nav Bar on Unauthorized page
            $ionicNavBarDelegate.$getByHandle('firstBar').showBar(false);
            $scope.dataLoaded = false;

            //Handle Tab Links
            var location = $location.url().split("/");
            var category = location[2];
            var tab = location[3];

            $scope.title = $rootScope.toTitleCase(location[2]);

            $scope.recommendedTab = location[1]+"/"+(category)+"/"+("recommended");
            $scope.nearbyTab = location[1]+"/"+(category)+"/"+("nearby");
            console.log($scope.recommendedTab);


            //Change Ads after some interval
//            var timeout = 5000;
//            var changeAds = $interval($scope.setCurrentAdv,timeout);

//            $scope.setCurrentAdv = function(){
//
//                for (var i in $scope.shops){
//                    if(!$scope.shops[i].hasOwnProperty('currentAd')){
//                        $scope.shops[i].currentAd = 0;
//                    }
//                    else{
//                        $scope.shops[i].currentAd = ($scope.shops[i].currentAd+ Math.floor((Math.random()*($scope.shops[i].ads.length-1))+1)) % $scope.shops[i].ads.length;
//                    }
//                }
//
//                changeAds = $interval($scope.setCurrentAdv,timeout,1);
//
//            }
            //------

            //Set Shop type for Image
            $scope.setShopType = function(){
                for (var i in $scope.shops){
                    $scope.shops[i].typeImage = "images/"+$scope.shops[i].Category.toLowerCase()+"Icons/layer"+ Math.floor((Math.random()*9+1))+".png";
                }
            }

            var getDistanceInKilometer = function(lat1, lon1, lat2, lon2, unit) {
                var radlat1 = Math.PI * lat1/180
                var radlat2 = Math.PI * lat2/180
                var radlon1 = Math.PI * lon1/180
                var radlon2 = Math.PI * lon2/180
                var theta = lon1-lon2
                var radtheta = Math.PI * theta/180
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                dist = Math.acos(dist)
                dist = dist * 180/Math.PI
                dist = dist * 60 * 1.1515
                if (unit=="K") { dist = dist * 1.609344 }
                if (unit=="N") { dist = dist * 0.8684 }
                return dist.toFixed(2);
            };

            var calcDistances = function(cord){
                for (var i in $scope.shops){
                    $scope.shops[i].distance = getDistanceInKilometer($scope.shops[i]._geoloc[1],$scope.shops[i]._geoloc[0],cord[1],cord[0],"K");
                };
            };

            var getShops = function(){
                cordovaReady(
                    navigator.geolocation.getCurrentPosition(

                        //success
                        function(pos){
                            console.log(pos.coords.longitude+"   "+pos.coords.latitude);
                            getShopsHelper(pos);
                        },
                        function(error){
                            console.log("error while getting device location");
                        }
                    )
                );
            };

            getShops();


            var getShopsHelper = function(position){

                var cord = [position.coords.longitude,position.coords.latitude];
                var query = new $kinvey.Query();

                query.near('_geoloc', cord , 100000);


                if(tab.indexOf("recommend")!=-1){
                    query.equalTo("isRecommended", 1);
                }

                if(category.indexOf("restaurant")!=-1){
                    query.equalTo("Category", "Restaurants");
                }
                else if(category.indexOf("clothing")!=-1){
                    query.equalTo("Category", "Clothing");
                }
                else if(category.indexOf("electronics")!=-1){
                    query.equalTo("Category", "Electronics");
                }

                var promise = $kinvey.DataStore.find("shops",query);

                promise.then(function(response){
                        $scope.shops = response;
                        $scope.setShopType();
                        calcDistances(cord);
                        $scope.dataLoaded = true;
                        console.log("data loaded-------------------------------------")
                    },
                    function(error){
                        console.log(category+" "+tab+" --- "+ error);
                    });
            }

//        $scope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
//            console.log("state Changed");
//            $scope.Recommended();
//        });

        }]);




