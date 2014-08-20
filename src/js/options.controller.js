(function (angular) {
  'use strict';

  var app = angular.module('options');

  app.controller('optionsController', [
    '$scope',
    'persistenceService',
    'generateGuid',
    'manifest',
    'addItemForm',
    '$location',
    function ($scope, persistenceService, generateGuid, manifest, addItemForm, $location) {

      $scope.showForm = addItemForm.show;
      $scope.hideForm = addItemForm.hide;
      $scope.edit = {};

      manifest(function (data) {
        $scope.manifest = data;
      });

      $scope.save = function (item) {

        if (item["$$hashKey"]) {
          item = angular.fromJson(angular.toJson(item));
        }

        if (item) {
          persistenceService.save(item, function () {
            console.log('controller success callback');

            if (item == $scope.inject) {
              $scope.inject = {};
            }
            addItemForm.hide();
            listItems();
          });
        }
      };

      $scope.remove = function (item) {
        persistenceService.remove(item.guid, function () {
          listItems();
        });
      };

      function listItems() {
        /**
         * var itemStructure = {
           code: '',
           url: '',
           guid: '',
           enabled: ''
         };
         */
        persistenceService.get({items: []}, function (results) {
          $scope.items = results.items;
          $scope.$apply();
        });
      }

      listItems();
      if ($location.path() == '/add') {
        $scope.showForm();
      }

    }
  ])
  ;

}(angular));
