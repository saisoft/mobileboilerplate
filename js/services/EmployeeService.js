'use strict';
myApp.factory("EmployeeService",["$http", "$q", "$rootScope", "commonService", "constantValues" ,function($http, $q, $rootScope, commonService, constantValues) {

	return {
		getEmployee : getEmployee,
                getEmployees : getEmployees,
		submitEmployee : submitEmployee,
		updateEmployee : updateEmployee,
		deleteEmployee : deleteEmployee,
                deleteEmployees : deleteEmployees,
                getEmployeesCount : getEmployeesCount
	};
	
	function deleteEmployees(EmployeeIds){
		var deferred = $q.defer();
                var token = new Date().getMilliseconds();
		return $http({
			method : 'DELETE',
			url    : constantValues.SERVER_HOST + '/Employees/' + EmployeeIds + '?token=' + token,
			 headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}
		}).success(function(respData) {
			deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while deleting Employee.");
		});

		return deferred.promise;
	};

	function getEmployee(EmployeeId){
		var deferred = $q.defer();
		var token = new Date().getMilliseconds();
		return $http({
			method : 'GET',
			url    : constantValues.SERVER_HOST + '/Employees/'+EmployeeId+'?token=' + token,
                        headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}
			
		}).success(function(respData) {
        		deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while getting Employee.");
		});

		return deferred.promise;
	};

	function getEmployees(currentPage){
		var deferred = $q.defer();
		var token = new Date().getMilliseconds();
		return $http({
			method : 'GET',
			url    : constantValues.SERVER_HOST + '/Employees/'+currentPage+'/'+constantValues.MAX_NUMBER_ROW_ON_PAGE+'?token=' + token,
                        headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}			
		}).success(function(respData) {
        		deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while getting Employees.");
		});

		return deferred.promise;
	};

        function getEmployeesCount(){
		var deferred = $q.defer();
		var token = new Date().getMilliseconds();
		return $http({
			method : 'GET',
			url    : constantValues.SERVER_HOST + '/EmployeesCount?token=' + token,
                        headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}			
		}).success(function(respData) {
        		deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while getting Employees total count.");
		});

		return deferred.promise;
	};

	function submitEmployee(Employee){
		var deferred = $q.defer();
		return $http({
			method : 'POST',
			url    : constantValues.SERVER_HOST + '/Employees',
			data   : Employee,
                        headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}			
		}).success(function(respData) {
			deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while adding Employee.");
		});

		return deferred.promise;
	};
	
	function updateEmployee(Employee){
		var deferred = $q.defer();
		return $http({
			method : 'PUT',
			url    : constantValues.SERVER_HOST + '/Employees/' + Employee.id,
			data   : Employee,
                        headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}			
		}).success(function(respData) {
			deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while updating Employee.");
		});

		return deferred.promise;
	};

	function deleteEmployee(Employee){
		var deferred = $q.defer();
		return $http({
			method : 'DELETE',
			url    : constantValues.SERVER_HOST + '/Employees/' + Employee.id,
                        headers : {'APP_LOGIN': 'saisoftpune', 'APPID_LOGIN': '1'}			
		}).success(function(respData) {
			deferred.resolve(respData);			
		}).error(function(errorData) {
			commonService.showErrorMessage(errorData ,"Error while deleting Employee.");
		});
		return deferred.promise;
	};
}]);

