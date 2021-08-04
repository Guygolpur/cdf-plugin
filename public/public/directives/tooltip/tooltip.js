import { uiModules } from 'ui/modules';
import tooltipTemplate from './tooltip.html';

uiModules
  .get('kibana/arc_cdf_line_vis')
  .directive('cdfLineTooltip', function () {
    return {
      restrict: 'E',
      scope: false,
      template: tooltipTemplate,
    };
  });
