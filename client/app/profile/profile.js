'use strict';

angular.module('galapagosApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('profile', {
        url: '/profile/:_id',
        templateUrl: 'app/profile/profile.html',
        controller: 'ProfileCtrl'
      });
  });