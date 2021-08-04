import _ from 'lodash';
import html from './color_picker.html';
import { uiModules } from 'ui/modules';

uiModules.get('kibana/arc_cdf_line_vis')
  .directive('cdfColorPicker', function ($document) {
    return {
      restrict: 'E',
      template: html,
      scope: false,
      link: function ($scope, element) {
        _.defer(function () {
          // clicking anywhere on screen will remove the shown color picker
          $document.on('click.colorpicker', function () {
            $document.off('click.colorpicker');
            element.remove();
          });
        });
      }
    };
  });
