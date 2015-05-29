'use strict';

angular.module('galapagosApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.availableUsers = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('/api/users').success(function(users) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].isAvailable) {
          $scope.availableUsers.push(users[i]);
        }

        // Debugg
        // console.log(user);
      }
      socket.syncUpdatesAvailableUsers('user', $scope.availableUsers);

      // Debug
      // console.log(users);
      // console.log($scope.availableUsers);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
      socket.unsyncUpdates('user');
    });
  });
