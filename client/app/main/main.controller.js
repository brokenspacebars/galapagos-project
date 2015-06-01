'use strict';

angular.module('galapagosApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.awesomeThings = [];
    $scope.availableUsers = [];
    $scope.availableSailboats = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $http.get('/api/users').success(function(users) {
      console.log('users is array: ', Array.isArray(users));
      console.log(users);
      console.log(users[1]);
      console.log(users[1].isAvailable);
      for (var i = 0; i < users.length; i++) {
        if (users[i].isAvailable) {
          $scope.availableUsers.push(users[i]);
        }

        // Debugg
        // console.log(user);
      }
      socket.syncUpdatesAvailable('user', $scope.availableUsers);

      // Debug
      // console.log(users);
      // console.log($scope.availableUsers);
    });

    $http.get('/api/sailboats')
      .success(function(res) {
        // var sailboats = res.data;
        // console.log('res it is: ', res);
        console.log(Array.isArray(res), res.length);
        console.log(res[0]);
        console.log(res[0].isAvailable);
        console.log(res[0].name);
        for (var i = 0; i < res.length; i++) {
          if (res[i].isAvailable) {
            console.log(i, ' is available');
            $scope.availableSailboats.push(res[i]);
          }
        }

        socket.syncUpdatesAvailable('sailboat', $scope.availableSailboats);
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
      socket.unsyncUpdates('sailboat');
    });
  });
