'use strict';

/**********************************************************************************
list Controller
**********************************************************************************/
myApp.controller('EmployeeCtrl',['$scope', '$route','$rootScope','$translate','$location','$modal',
        'EmployeeService','commonService','constantValues','$routeParams', 'EmployeesData', 'EmployeesCount', function($scope, $route, $rootScope, $translate, $location, $modal,
	EmployeeService, commonService, constantValues, $routeParams, EmployeesData, EmployeesCount) {

	$scope.order = 'Employeename';
        $scope.reverse = false;
		
		if(localStorage.getItem('view')){
			$scope.view = localStorage.getItem('view');
		}else{	
			$scope.view = "list";
		}
        $scope.Employees = EmployeesData.data;
        $scope.changeView = function() {
            if ($scope.view === "list") {
                $scope.view = "th-large";
				localStorage.setItem('view', 'th-large');
            } else if ($scope.view === "th-large") {
                $scope.view = "list";
				localStorage.setItem('view', 'list');
            }
        };
		
		commonService.showMessage();

       $scope.resetFilter = function(){
            delete $scope['Employeename'];
        };

         $scope.resetSearch = function(){
            delete $scope['searchText'];
        };

        // Employee selected to delete
        $scope.showDeleteIcon = false;
        var selectedEmployeeList = new Array();
        var EmployeeIds = new Array();

        $scope.bigCurrentPage = 1;
        $scope.maxSize = constantValues.MAX_NUMBER_OF_PAGER;
        $scope.maxRowNumbers = constantValues.MAX_NUMBER_ROW_ON_PAGE;
        $scope.bigTotalItems = 0;

// delete all Employees
        $scope.isAllselected = false;
        $scope.selectAll = function (isAllselected){
            $scope.isAllselected = !isAllselected;
            if ($scope.isAllselected === true){
                selectedEmployeeList.splice(0, selectedEmployeeList.length);
                for(var i=0; i<$scope.Employees.length; i++){
                    $scope.Employees[i].isSelected = true;
                    selectedEmployeeList.push($scope.Employees[i].id);	
                } 
                $scope.showDeleteIcon = true;
            }
            else{
                selectedEmployeeList.splice(0, selectedEmployeeList.length);
                for(var i=0; i<$scope.Employees.length; i++){
                    $scope.Employees[i].isSelected = false;	
                } 
                $scope.showDeleteIcon = false;
            }
        };

        $scope.selectedToDelete = function(Employee){
                if (!Employee.isSelected){
                    selectedEmployeeList.push(Employee.id);
                }
                else{
                    selectedEmployeeList.splice(selectedEmployeeList.indexOf(Employee.id), 1);
                }
                if ($scope.showDeleteIcon == false && selectedEmployeeList.length >0){
                    $scope.showDeleteIcon = true;
                }
                else if(selectedEmployeeList.length == 0){
                    $scope.showDeleteIcon = false;
                }	
        };

        // delete selected Employees
        $scope.deleteSelectedEmployees = function (Employee){

            var deleteSelSceSuccess = function(respData){
                EmployeeIds.splice(0, EmployeeIds.length);
                $route.reload();
            };
            var deleteSelSceFailure = function(errorData){
                EmployeeIds.splice(0, EmployeeIds.length);
            //console.log("Failed to delete Employees");
            };

            var modalInstance = $modal.open({
                templateUrl: constantValues.HTML_LOC + 'angularviews/deleteMessageModal.html',
                controller: 'DeleteMessageCtrl',
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    items: function () {
                        return $translate('DELETE_SELECTED');
                    }
                }
            });
            modalInstance.result.then(function (selectedItem) {
                if (selectedItem === 'yes'){
                    for (var i=0; i< $scope.Employees.length; i++){
                        if ($scope.Employees[i].isSelected){
                            EmployeeIds.push($scope.Employees[i].id);
                        }
                    }
                    if (EmployeeIds.length > 0){
                        EmployeeService.deleteEmployees(EmployeeIds).then(deleteSelSceSuccess, deleteSelSceFailure);
                    }
                    else{
                    //console.log("no Employees selected to delete");
                    }
                }
            }, function () {

                });
        };

	// get list of Employee
        var EmployeeSuccess = function(respData) {
            console.log("Get Employee success for user " + $rootScope.userHeaderName);
            $scope.userNameHeader = respData.config.headers.Employeeloginname;
            $rootScope.userHeaderName = respData.config.headers.Employeeloginname;
            if (respData.data.errorcode && respData.data.errorcode === 1 && !respData.data.status) {
                $scope.noDataFound = true;
            } else {
                $scope.Employees = respData.data;
            }
            commonService.toggleProcessing(false);
        };

        var EmployeeFailure = function(errorData) {
            console.log("Error in getting Employee list");
            commonService.toggleProcessing(false);
            commonService.showAlert($translate('NETWORK_ERROR'));
        };

        //console.log("Getting Employee for user " + $rootScope.userHeaderName);
        if (EmployeesData && 200 <= EmployeesData.status && EmployeesData.status < 300) {
            EmployeeSuccess(EmployeesData);
        } else {
            EmployeeFailure(EmployeesData);
        }

 $scope.pageChanged = function(pageNo) {
            commonService.toggleProcessing(true);
            $scope.bigCurrentPage = pageNo;
            console.log('Page changed to: ' + $scope.bigCurrentPage);
            EmployeeService.getEmployees($scope.bigCurrentPage).then(EmployeeSuccess, EmployeeFailure);
        };

         	// get list of Employee
	var EmployeeCountSuccess = function(respData){
		console.log("Get Employee count success for user " + $rootScope.userHeaderName);
		$scope.userNameHeader = respData.config.headers.Employeeloginname;
		$rootScope.userHeaderName = respData.config.headers.Employeeloginname;
                if(respData.data.errorcode && respData.data.errorcode === 1 && !respData.data.status){
                    $scope.noDataFound = true;
                }else{
                    $scope.bigTotalItems = respData.data;
                }
		commonService.toggleProcessing(false);
	};

	var EmployeeCountFailure = function(errorData){
		console.log("Error in getting Employee count");
		commonService.toggleProcessing(false);
		commonService.showAlert($translate('NETWORK_ERROR'));	
	};
	
        //console.log("Getting Employee count for user " + $rootScope.userHeaderName);
        if(EmployeesCount && 200 <= EmployeesCount.status && EmployeesCount.status < 300){
               EmployeeCountSuccess(EmployeesCount);
         }else{EmployeeCountFailure(EmployeesCount);}

         $scope.addEmployee = function() { 

$location.path('employees/add');
};

 $scope.editEmployee = function(Employee) { 

$location.path('employees/edit/'+Employee.id);
};

 $scope.viewEmployee = function(Employee) { 

$location.path('employees/'+Employee.id);
};

//end edit  Employee popup
	
	
	//delete  Employee
                $scope.deleteEmployee = function(Employee) {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/deleteMessage.html',
                        controller: 'deleteEmployeeCtrl',
                        keyboard: false,
                        resolve: {Employee: function() {
                                return Employee;
                            }}
                    });
                };

    
}]);

/**********************************************************************************
 add Controller
 **********************************************************************************/

        myApp.controller('addEmployeeCtrl', ['$scope', '$rootScope', '$translate', '$location', '$modal',
    'EmployeeService', 'commonService', 'constantValues', '$routeParams', '$window', '$timeout',
    '$route', function($scope, $rootScope, $translate, $location, $modal,
            EmployeeService, commonService, constantValues, $routeParams, $window, $timeout, $route) {//END_ADD_WITH_OR_WITHOUT_MODEL

        commonService.toggleProcessing(false);


        //set the values of slider to 0 if error.
        $scope.options = {       
            from: 1,
            to: 100,
            step: 1,
            dimension: " years",
            scale: [0, '|', 50, '|' , 100]        
          };

        $scope.Employee = {};
        //$scope.Employees = EmployeesData.data;

        //add here if any autocomplete
        //$scope.datas = [];
        //angular.forEach(EmployeeData.data, function (value) {
        //    $scope.datas.push(value.data);
        //});
		
		$scope.calcleAdd = function(){
			 $window.history.back();
		};

        var saveEmployeeSuccess = function(respData) {
            $modalInstance.close();
            commonService.toggleProcessing(false);
            if (respData.data.status && respData.data.status === true) {
                if($location.path()==='/home'){
                    $location.path('Employees');
                }else{
                    $route.reload();
                }
            } else {
                commonService.showAlert($translate('SAVE_Employee_UNSUCCESSFULL'));
                if($location.path()==='/home'){
                    $location.path('Employees');
                }else{
                    $route.reload();
                }
            }
        };
        var saveEmployeeFailure = function(errorData) {
            commonService.showAlert(errorData.data.ex);
            commonService.showAlert($translate('NETWORK_ERROR'));
            commonService.toggleProcessing(false);
        };

        $scope.saveEmployee = function() {
            commonService.toggleProcessing(true);
            EmployeeService.submitEmployee($scope.Employee).then(saveEmployeeSuccess, saveEmployeeFailure);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }]);

/**********************************************************************************
 delete Controller
 **********************************************************************************/
myApp.controller('deleteEmployeeCtrl',
        ['$scope', '$modalInstance', 'Employee', '$translate', 'EmployeeService', 'commonService', '$route',
            function($scope, $modalInstance, Employee, $translate, EmployeeService, commonService, $route) {

                $scope.errorMessage = $translate('DELETE') + ' ' + $translate('EMPLOYEE') + ' ' + Employee.id;

                $scope.cancel = function() {
                    $modalInstance.dismiss('cancel');
                };

                $scope.ok = function() {
                    commonService.toggleProcessing(true);
                    EmployeeService.deleteEmployee(Employee);
                    $modalInstance.dismiss('cancel');
					localStorage.setItem('messsage', "Delete Data Success");
                    $route.reload();
                };
            }]);

/**********************************************************************************
 edit Controller
 **********************************************************************************/

        
        myApp.controller('editEmployeeCtrl', ['$scope', '$rootScope', '$translate', '$location', '$modal',
    'EmployeeService', 'commonService', 'constantValues', '$routeParams', '$window', '$timeout',
    '$route', 'Employee', function($scope, $rootScope, $translate, $location, $modal,
            EmployeeService, commonService, constantValues, $routeParams, $window, $timeout, $route, Employee) {//END_EDIT_WITH_OR_WITHOUT_MODEL

        commonService.toggleProcessing(false);
        //$scope.Employees = EmployeesData.data;

        $scope.options = {       
            from: 1,
            to: 100,
            step: 1,
            dimension: " years",
            scale: [0, '|', 50, '|' , 100]        
          };

        	// get list of Employee
        var EmployeeSuccess = function(respData) {
            console.log("Get Employee success for user " + $rootScope.userHeaderName);
            $scope.userNameHeader = respData.config.headers.Employeeloginname;
            $rootScope.userHeaderName = respData.config.headers.Employeeloginname;
            if (respData.data.errorcode && respData.data.errorcode === 1 && !respData.data.status) {
                $scope.noDataFound = true;
            } else {
                $scope.Employee = respData.data;
            }
            commonService.toggleProcessing(false);
        };

        var EmployeeFailure = function(errorData) {
            console.log("Error in getting Employee list");
            commonService.toggleProcessing(false);
            commonService.showAlert($translate('NETWORK_ERROR'));
        };

        //console.log("Getting Employee for user " + $rootScope.userHeaderName);
        if (Employee && 200 <= Employee.status && Employee.status < 300) {
            EmployeeSuccess(Employee);
        } else {
            EmployeeFailure(Employee);
        }        

        var updateEmployeeSuccess = function(respData) {
            $modalInstance.close();
            commonService.toggleProcessing(false);
            if (respData.data.status && respData.data.status === true) {
                $route.reload();
            } else {
                commonService.showAlert($translate('UPDATE_Employee_UNSUCCESSFULL'));
                $route.reload();
            }
        };
        var updateEmployeeFailure = function(errorData) {
            commonService.showAlert(errorData.data.ex);
            commonService.showAlert($translate('NETWORK_ERROR'));
            commonService.toggleProcessing(false);
        };

        $scope.updateEmployee = function() {
            commonService.toggleProcessing(true);
            EmployeeService.updateEmployee($scope.Employee).then(updateEmployeeSuccess, updateEmployeeFailure);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

    }]);

/**********************************************************************************
 view Controller
 **********************************************************************************/
        
        myApp.controller('viewEmployeeCtrl', ['$scope', '$rootScope', '$translate', '$location', '$modal',
    'EmployeeService', 'commonService', 'constantValues', '$routeParams', '$window', '$timeout',
    '$route', 'Employee', function($scope, $rootScope, $translate, $location, $modal,
            EmployeeService, commonService, constantValues, $routeParams, $window, $timeout, $route, Employee) {//END_VIEW_WITH_OR_WITHOUT_MODEL

        commonService.toggleProcessing(false);
       

        	// get list of Employee
        var EmployeeSuccess = function(respData) {
            console.log("Get Employee success for user " + $rootScope.userHeaderName);
            $scope.userNameHeader = respData.config.headers.Employeeloginname;
            $rootScope.userHeaderName = respData.config.headers.Employeeloginname;
            if (respData.data.errorcode && respData.data.errorcode === 1 && !respData.data.status) {
                $scope.noDataFound = true;
            } else {
                $scope.Employee = respData.data;
            }
            commonService.toggleProcessing(false);
        };

        var EmployeeFailure = function(errorData) {
            console.log("Error in getting Employee list");
            commonService.toggleProcessing(false);
            commonService.showAlert($translate('NETWORK_ERROR'));
        };

        //console.log("Getting Employee for user " + $rootScope.userHeaderName);
        if (Employee && 200 <= Employee.status && Employee.status < 300) {
            EmployeeSuccess(Employee);
        } else {
            EmployeeFailure(Employee);
        }


        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.back = function() {
            $location.path('Employees');
        };

//delete  Employee
                $scope.deleteEmployee = function(Employee) {
                    var modalInstance = $modal.open({
                        templateUrl:  constantValues.HTML_LOC + 'angularviews/deleteMessage.html',
                        controller: 'deleteEmployeeCtrl',
                        keyboard: false,
                        resolve: {Employee: function() {
                                return Employee;
                            }}
                    });
                };

    }]);

