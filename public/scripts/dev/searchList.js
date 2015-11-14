angular.module('fatno.app')
  .directive('searchList', ['$timeout', function ($timeout) {
    'use strict';

    return {
      restrict: 'A',
      templateUrl: 'scripts/dev/templates/searchList.html',
      scope: {
        collection: '=',
        selected: '=',
        onChange: '&weightChanged',
        shownItems: '@'
      },
      link: function (scope, element) {
        var listHeight = 0,
          setheight = function () {
            var items = element.find('ul').find('li');

            listHeight = items.eq(0).outerHeight() * scope.shownItems ;

            return listHeight+ 'px';
          };

        scope.selectedIndex = 0;
        scope.shownItems = scope.shownItems || 13;



        scope.setListVisibility = function () {
          var height;

          scope.showList = true;

          $timeout(function () {
            height = listHeight || setheight();
            element.find('ul').css('height', height);
          }, 0);
        };

        scope.setActive = function (e) {
          var target = e.target;

          if (target.tagName === 'LI') {
            scope.selectedIndex = angular.element(target).index();
          }
        };

        scope.moveActive = function (e) {
          var code = e.keyCode;

          if (code === 38) {
            scope.selectedIndex--;
          }

          if (code === 40) {
            scope.selectedIndex++;
          }


        };

        window.addEventListener('keydown', function (e) {
          var target = e.target,
            code = e.keyCode,
            list = element.find('ul'),
            items = list.find('li'),
            isItem = items.length > 0 ? items.toArray().indexOf(target) !== -1 : list.find('li');

          if (isItem && (code === 48 || code === 38)) {
            e.preventDefault();
          }

        });

      }
    };
  }]);
