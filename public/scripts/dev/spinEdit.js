angular.module('fatno.app')
  .directive('spinEdit', ['$interval', function ($interval) {
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
        var input = element.find('input'),
          intervalID;

        scope.keyup = function(e) {
          var code = e.which || e,
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

          if (code === 40 || code === 38 && (scope.td.actual > 0 || scope.td.actual === 0 && code === 38)) {
            changeMap[code]();
            scope.weightChanged(scope.td.actual, scope.td);
          }
        };

        scope.wheelHandler = function ($event, $delta, $deltaX, $deltaY) {
          var code = $deltaY > -1 ? 38 : 40;

          scope.keyup(code);
        };

        scope.start = function (isIncrease) {
          var code = isIncrease ? 38 : 40;

          $interval.cancel(intervalID);
          scope.keyup(code);
          intervalID = $interval(function () {
            scope.keyup(code);
          }, 100);

        };

        scope.stop = function () {
          $interval.cancel(intervalID);
          intervalID = undefined;
        };
      }
    };
  }]);
