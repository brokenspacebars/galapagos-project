'use strict';

angular.module('galapagosApp')
  .controller('SettingsCtrl', function ($http, $scope, User, Auth) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();
    // console.log($scope.user.availablePeriod.startDate);
    console.log($scope.user.name);
    console.log($scope.user);



    $scope.changePassword = function(form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
        .then( function() {
          $scope.message = 'Password successfully changed.';
        })
        .catch( function() {
          form.password.$setValidity('mongoose', false);
          $scope.errors.other = 'Incorrect password';
          $scope.message = '';
        });
      }
		};

    $scope.updateUser = function() {
      // if($scope.newThing === '') {
      //   return;
      // }
      $http.put('/api/users/' + $scope.user._id + '/update', $scope.user)
      .then(function() {
        $scope.message = "Profile updated.";
        $scope.errors = {};
      })
      .catch(function () {
        $scope.errors.other = "Unable to update";
        $scope.message = '';
      });
      console.log('Update user...');
    };

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.isAvailable = function() {
      return User.isAvailable;
    };
  });
