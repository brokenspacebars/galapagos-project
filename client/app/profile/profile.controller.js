'use strict';

angular.module('galapagosApp')
  .controller('ProfileUserCtrl', function ($scope, $http, socket, User, $stateParams) {
    var id = $stateParams._id;
    $scope.user = {};
    $scope.errors = {};

    $http.get('api/users/' + id)
    	.success(function(res) {
    		$scope.user = res;
	    })
	    .catch(function(err) {
	    	$scope.errors.other = err;
	    });
  })
  .controller('ProfileSailboatCtrl', function ($scope, $http, socket, User, $stateParams) {
    var id = $stateParams._id;
    $scope.sailboat = {};
    $scope.errors = {};

    $http.get('api/sailboats/' + id)
      .success(function(res) {
        $scope.sailboat = res;
        console.log(res);
      })
      .catch(function(err) {
        $scope.errors.other = err;
      });
  });
