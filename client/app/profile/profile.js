'use strict';

angular.module('galapagosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profileUser', {
        url: '/profile/:_id',
        templateUrl: 'app/profile/profileUser.html',
        controller: 'ProfileUserCtrl'
      })
      .state('profileSailboat', {
        url: '/profile/sailboat/:_id',
        templateUrl: 'app/profile/profileSailboat.html',
        controller: 'ProfileSailboatCtrl'
      });
  });