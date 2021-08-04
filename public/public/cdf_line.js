/* eslint-disable @kbn/eslint/require-license-header */
import 'plugins/arc_cdf_line_vis/cdf_line_controller';
import { VisFactoryProvider } from 'ui/vis/vis_factory';
import { Schemas } from 'ui/vis/editors/default/schemas.js';
import packageJson from '../package.json';
import cdfLineTemplate from 'plugins/arc_cdf_line_vis/templates/cdf_line.html';
// import panelSettingsEditor from 'plugins/arc_cdf_line_vis/templates/panelSettings.html';
// import metricsAndAxesEditor from 'plugins/arc_cdf_line_vis/templates/metricsAndAxes.html';
import cdfSvgIcon from './images/cdf_line.svg';

const pluginVersion = packageJson.version;

export const CdfLineVisArgs = {

  name: 'arc_cdf_line',
  title: 'CDF Line chart',
  icon: cdfSvgIcon,
  description: 'The CDF (cumulative distribution function) uses a line chart to represent symbolic distribution.',
  visConfig: {
    defaults: {
      handleNoResults: true,
      numberOfTickTexts: 10,
      pluginVersion: pluginVersion,
      grid: {
        categoryLines: false,
        valueAxis: false
      },
      categoryAxis: {
        scale: {
          setExtents: false
        }
      }
    },
    template: cdfLineTemplate,
  },
  responseHandler: 'none',
  // requestHandler: 'multi_buckets_handler', - As for Kibana 7.x, the functionality moved into Kibana's vis/request_handlers/courier.js file
  editorConfig: {
    optionTabs: [
      { name: 'advanced', title: 'Metrics & Axes', editor: /*metricsAndAxesEditor*/ '<cdf-xaxis-settings></cdf-xaxis-settings>' },
      { name: 'options', title: 'Panel Settings', editor: /*panelSettingsEditor*/ '<arc-cdf-grid></arc-cdf-grid>' }
    ],
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'metric',
        title: 'Count',
        min: 1,
        max: 1,
        defaults: [{
          schema: 'metric',
          type: 'count'
        }],
        aggFilter: 'count'
      },
      {
        group: 'buckets',
        name: 'segment',
        title: 'X-Axis',
        min: 1,
        max: Infinity,
        mustBeFirst: true,
        aggFilter: 'histogram'
      },
      {
        group: 'buckets',
        name: 'group',
        title: 'Split lines',
        min: 0,
        max: Infinity,
        aggFilter: '!geohash_grid'
      }
    ])
  }
};

export default function CdfLineVisTypeFactory(Private) {

  const VisFactory = Private(VisFactoryProvider);
  return VisFactory.createAngularVisualization(CdfLineVisArgs);
}
