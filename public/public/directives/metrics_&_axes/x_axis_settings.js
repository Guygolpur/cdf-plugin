/* eslint-disable @kbn/eslint/require-license-header */
import { uiModules } from 'ui/modules';
import template from './x_axis_settings.html';
const module = uiModules.get('kibana/arc_cdf_line_vis');

module.directive('cdfXaxisSettings', function () {
  return {
    restrict: 'E',
    template: template,
    replace: true,
    link: function ($scope) {

      $scope.updateXExtents = function () {
        if(!$scope.vis.params.categoryAxis.scale.setExtents) {
          delete $scope.vis.params.categoryAxis.scale.max;
          delete $scope.vis.params.categoryAxis.scale.min;
        }
      };
    }
  };
});
