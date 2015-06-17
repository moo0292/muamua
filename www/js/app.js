// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform, $rootScope, $state, $ionicLoading) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }

        $ionicLoading.show({
            template: '<ion-spinner icon="ripple" class="spinner-balanced"></ion-spinner>'
        });

        //if first time then show pop up



    });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js


    $ionicConfigProvider.views.transition('none')

    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.hot', {
        url: '/hot',
        views: {
            'hot': {
                templateUrl: 'templates/hot.html',
                controller: 'HomeCtrl'
            }
        }
    })

    .state('tab.peek', {
            url: '/peek',
            views: {
                'peek': {
                    templateUrl: 'templates/peek.html',
                    controller: 'PeekCtrl'
                }
            }
        })
        .state('tab.peek-detail', {
            url: '/peek/detail',
            views: {
                'peek': {
                    templateUrl: 'templates/peek-detail.html',
                    controller: 'PeekCtrl'
                }
            }
        })
        .state('tab.peek-detail-message', {
            url: '/peek/detail/message',
            views: {
                'peek': {
                    templateUrl: 'templates/peek-detail-message.html',
                    controller: 'PeekCtrl'
                }
            }
        })
        .state('tab.home', {
            url: '/home',
            views: {
                'home': {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('tab.home-detail', {
            url: '/home/detail',
            views: {
                'home': {
                    templateUrl: 'templates/message.html',
                    controller: 'MessageCtrl'
                }
            }
        })
        .state('tab.profile', {
            url: '/profile',
            views: {
                'profile': {
                    templateUrl: 'templates/profile.html',
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('tab.profile-detail', {
            url: '/profile/detail',
            views: {
                'profile': {
                    templateUrl: 'templates/profile-detail.html',
                    controller: 'ProfileCtrl'
                }
            }
        })
        .state('tab.write', {
            url: '/write',
            views: {
                'write': {
                    templateUrl: 'templates/write.html',
                    controller: 'WriteCtrl'
                }
            }
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/tab/home');

});