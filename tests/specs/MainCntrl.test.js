describe('mainCntr', function () {
  'use strict';

  var $scope,
    titles = [1, 2, 3, 4, 5],
    data = [{
      'titles': titles.map(function (element) {
        return element.toString();
      }),
      'length': 1
    }, {
      'name': 'test title',
      'values': [8, 7, 6, 5, 4, 3, 21, 0]
    }];

  beforeEach(module('fatno.app', function ($provide) {
    $provide.value('shownIngridients', titles);
  }));

  beforeEach(inject(function ($rootScope, $controller, $httpBackend) {
    $scope = $rootScope.$new();
    $controller('mainCntr', {
      $scope: $scope
    });
    $httpBackend.expectGET('/products').respond(200, data);
    $httpBackend.flush();
  }));

  it('should create "products" model with correct length', function () {
    expect($scope.products.length).toBe($scope.productsLength);
  });

  it('should push to the result array selected item', function () {
    var selected = $scope.products[0];

    $scope.processOption(selected);
    expect($scope.results.length).toBe(1);

    $scope.processOption(selected);
    expect($scope.results.length).toBe(2);
  });

  it('should recalculate totals array after results were changed', function () {
    var arr = (function () {
        var index = titles.length,
          list = [];

        while (index--) {
          list.push(index);
        }

        return list;
      }()),
      arr2 = arr.slice(),
      res = [];

    arr.forEach(function (el, i) {
      res[i] = el + arr2[i];
    });

    expect($scope.totals.length).toEqual(0);

    $scope.processOption({
      values: arr
    });
    $scope.$digest();
    expect($scope.totals.length).toEqual($scope.titles.length);

    $scope.processOption({
      values: arr2
    });
    $scope.$digest();
    expect($scope.totals).toEqual(res);

  });
});
