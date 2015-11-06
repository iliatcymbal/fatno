angular.module('fatno.app')
  .controller('mainCntr', ['$scope', '$http', 'shownIngridients', mainCntr]);

function mainCntr($scope, $http, shownIngridients) {
  'usse strict';

  var getTotalSum = function () {
      var isFirstInvoked = true;
      $scope.results.forEach(function (item) {
        item.values.forEach(function (val, i) {
          var curr = isFirstInvoked ? 0 : $scope.totals[i],
            sum = Math.round((curr + val) * 100) / 100;

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
      actualProduct.values.push(selected.values[indexes[i]]);
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
}
