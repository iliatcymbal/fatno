/*! FATNO - v1.0.1 - 2015-11-09 */angular.module('fatno.app', ['monospaced.mousewheel'])
  .value('shownIngridients', [
    'Белки',
    'Жиры',
    'Углеводы',
    'Калорийность',
    'Железо',
    'Йод',
    'ретинол',
    'бета-',
    'токоферол',
    'аскорбиновая',
    'В1',
    'В2',
    'Вс',
    'РР'
  ]);

angular.module('fatno.app')
  .controller('mainCntr', ['$scope', '$http', 'shownIngridients', mainCntr]);

function mainCntr($scope, $http, shownIngridients) {
  'use strict';

  var getTotalSum = function () {
      var isFirstInvoked = true;
      $scope.results.forEach(function (item) {
        item.values.forEach(function (val, i) {
          var curr = isFirstInvoked ? 0 : $scope.totals[i],
            sum = Math.round((curr + val.actual) * 100) / 100;

          $scope.totals[i] = sum;
        });
        isFirstInvoked = false;
      });
    },
    getInfo = function () {
      var indexes = [],
        titles = globArray[0].titles,
        filteredTitles = [],
        i, j, ingridientsLenth, titlesLength;

      for (j = 0, ingridientsLenth = shownIngridients.length; j < ingridientsLenth; j++) {
        for (i = 0, titlesLength = titles.length; i < titlesLength; i++) {
          if (titles[i].indexOf(shownIngridients[j]) !== -1) {
            indexes.push(i);
            filteredTitles[j] = titles[i];
            break;
          }
        }
      }

      return {
        indexes: indexes,
        titles: filteredTitles
      };
    },
    initData = function () {
      prodInfo = getInfo();

      $scope.products = globArray.slice(1);
      $scope.productsLength = globArray[0].length;
      $scope.titles = prodInfo.titles;
    },
    getTotalResult = function () {
      var result = [],
        max = prodInfo.titles.length,
        i = 0, obj;

      for (; i < max; i++) {
        obj = {};
        obj[prodInfo.titles[i]] = $scope.totals[i];
        result.push(obj);
      }

      return result;
    },
    prodInfo, globArray;

  $scope.results = [];
  $scope.totals = [];
  shownIngridients.unshift('weight');

  $http.get('/products')
    .success(function (data) {
      globArray = data;
      initData();
    })
    .error(function (data) {
      console.log(data);
    });

  $scope.processOption = function (selected) {
    if (!selected) {
      return;
    }
    var actualProduct = {
        name: selected.name,
        values: []
      },
      i = 0,
      indexes = prodInfo.indexes,
      max = indexes.length;

    for (; i < max; i++) {
      actualProduct.values.push({
        origin: selected.values[indexes[i]],
        actual: selected.values[indexes[i]]
      });
    }

    $scope.results.push(actualProduct);
  };

  $scope.$watch('results.length', getTotalSum);

  $scope.getResults = function () {
    $http.post('/results', getTotalResult())
      .success(function (data) {
        $scope.totalResult = data;
      })
      .error(function (data) {
        $scope.totalResult = data;
      });
  };

  $scope.weightChanged = function (product, value) {
    var index = product.values.length,
      newValue;

    while (index--) {
      newValue = product.values[index].origin * value.actual / 100;
      product.values[index].actual = Math.round(newValue * 100) / 100;
    }

    getTotalSum();
  };
}

angular.module('fatno.app')
  .directive('spinEdit', function () {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'scripts/dev/templates/spinEdit.html',
      scope: {
        td: '=spinValue',
        val: '=spinModel',
        weightChanged: '&weightChanged'
      },
      link: function (scope, element) {
        var input = element.find('input');

        scope.keyup = function(e) {
          var code = e.which,
            changeMap = {
              40: function () {
                if (scope.td.actual) {
                  return --scope.td.actual;
                }
              },
              38: function () {
                return ++scope.td.actual;
              }
            };

          if (code === 40 || code === 38) {
            input.val(changeMap[code]());
            scope.weightChanged(scope.td.actual, scope.td);
          }
        };

        scope.wheelHandler = function ($event, $delta, $deltaX, $deltaY) {
          var value = input.val();
          scope.td.actual += $deltaY;

          scope.weightChanged(scope.td.actual, scope.td);
        };
      }
    };
  });
