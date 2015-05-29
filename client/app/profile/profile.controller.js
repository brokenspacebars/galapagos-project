'use strict';

angular.module('galapagosApp')
  .controller('ProfileCtrl', function ($scope, $http, socket, User, $stateParams) {
    var id = $stateParams._id;
    $scope.user = {};
    $scope.errors = {};

    $http.get('api/users/' + id)
    	.success(function(res) {
    		$scope.user = res;
	    	socket.syncSingleUser('user', $scope.user);
	    })
	    .catch(function(err) {
	    	$scope.errors.other = err;
	    });
  });
