/* eslint-disable @kbn/eslint/require-license-header */
import { uiModules } from 'ui/modules';
import template from './grid.html';
const module = uiModules.get('kibana/arc_cdf_line_vis');

module.directive('arcCdfGrid', function () {
  return {
    restrict: 'E',
    template: template,
    replace: true,
    link: function ($scope) {

      $scope.isGridOpen = false;
    }
  };
});
