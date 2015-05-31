'use strict';

angular.module('galapagosApp')
  .controller('SettingsCtrl', function ($http, $scope, User, Auth, socket) {
    $scope.errors = {};
    $scope.user = Auth.getCurrentUser();
    $scope.sailboats = [];
    // console.log($scope.user.availablePeriod.startDate);
    console.log($scope.user._id);
    console.log($scope.user);
    // console.log($scope.sailboat);

    $http.get('/api/sailboats/user/' + $scope.user._id)
      .then(function (res) {
        console.log(res);
        $scope.sailboats = res.data;
        socket.syncUpdates('sailboat', $scope.sailboats);
      })
      .catch(function (res) {
        if (res.status != 500) {
          $scope.errors.other = 'Unable to fetch data.';
        } else {
          console.log('No saved sailboats found.')
        }
        $scope.message = '';
      });

    $scope.createBoat = function () {
      $http.post('/api/sailboats')
        .then(function () {
          $scope.message = 'Sailboat successfully created.';
        })
        .catch(function () {
          $scope.errors.other = 'Unable to create sailboat.';
          $scope.message = '';
        });
    };

    $scope.updateBoat = function (index) {
      $http.put('/api/sailboats/' + $scope.sailboats[index]._id, $scope.sailboats[index])
        .then(function () {
          $scope.message = 'Sailboat successfully updated.';
        })
        .catch(function () {
          $scope.errors.other = 'Unable to update sailboat.';
          $scope.message = '';
        });
    };

    $scope.deleteBoat = function(index) {
      $http.delete('/api/sailboats/' + $scope.sailboats[index]._id)
        .then(function () {
          $scope.message = 'Sailboat successfully deleted.';
        })
        .catch(function () {
          $scope.errors.other = 'Unable to delete sailboat.';
          $scope.message = '';
        });
    }

    $scope.changePassword = function (form) {
      $scope.submitted = true;
      if(form.$valid) {
        Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
          .then(function () {
            $scope.message = 'Password successfully changed.';
          })
          .catch(function () {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password.';
            $scope.message = '';
        });
      }
		};

    $scope.updateUser = function () {
      // if($scope.newThing === '') {
      //   return;
      // }
      $http.post('/api/users/' + $scope.user._id, $scope.user)
        .then(function () {
          $scope.message = 'Profile updated.';
          $scope.errors = {};
        })
        .catch(function () {
          console.log('cathck');
          $scope.errors.other = 'Unable to update.';
          $scope.message = '';
        });
      console.log('Update user...');
      console.log($scope.errors);
    };

    $scope.open = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.isAvailable = function () {
      return User.isAvailable;
    };
  });
