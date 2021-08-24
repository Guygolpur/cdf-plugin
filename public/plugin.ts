import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from 'src/core/public';
import { PLUGIN_NAME } from '../common';
import { VisualizationsSetup } from 'src/plugins/visualizations/public';
import { Plugin as ExpressionsPlugin } from '../../../src/plugins/expressions/public';
import { cdfVisFn, CDFVisParams } from './cdf_vis_fn';
import { cdfVisRenderer } from './cdf_vis_renderer';
import { toExpressionAst } from './to_ast';
import { CDFEditor } from './cdf_vis/cdf_editor';
import cdfSvgIcon from './public/images/cdf_line.svg';
import { Subscription } from 'rxjs';
import { DataPublicPluginStart } from 'src/plugins/data/public';

export interface SetupDependencies {
  expressions: ReturnType<ExpressionsPlugin['setup']>;
  visualizations: VisualizationsSetup;
  data: DataPublicPluginStart;
}

export class CDFPlugin implements Plugin<CDFPluginSetup, CDFPluginStart> {
  public setup(core: CoreSetup, { expressions, visualizations, data }: SetupDependencies) {

    expressions.registerFunction(cdfVisFn);
    expressions.registerRenderer(cdfVisRenderer);

    visualizations.createBaseVisualization<CDFVisParams>({
      name: 'cdf_vis',
      title: PLUGIN_NAME,
      icon: cdfSvgIcon,
      description: 'The CDF (cumulative distribution function) uses a line chart to represent symbolic distribution.',
      visConfig: {
        defaults: {
          isEmptyBucket: false,
          isAxisExtents: false,
          isExtendBounds: false,
          handleNoResults: true,
          isVerticalGrid: false,
          isHorizontalGrid: false,
          isSplitedSeperateBucket: false,
          isSplitedShowMissingValues: false,
          isSplitAccordionClicked: false,
          aggregation: 'histogram',
          field: '',
          customLabel: '',
          advancedValue: '',
          jsonInput: '',  // json syntax validation
          splitedAggregation: 'date_histogram',
          splitedField: 'Projects',
          splitedOrderBy: 'Metric: Count',
          splitedOrder: 'Descending',
          splitedCustomLabel: '',
          dateFilterFrom: 'now-15m',
          dateFilterTo: 'now',
          splitedDateHistogramMinInterval: 'auto',
          numberOfTickTexts: 10,
          min_interval: 1,
          splitedSize: 1,
          splitedHistogramMinInterval: 1,
          Xmin: null,
          Xmax: null,
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
      },
      editorConfig: {
        optionTabs: [
          {
            name: 'options',
            title: 'Options',
            editor: CDFEditor,
          },
        ],
      },
      toExpressionAst,
    });
  }

  public start(core: CoreStart, plugins: SetupDependencies) {
    return {};
  }
  public stop() { }
}
export type CDFPluginSetup = ReturnType<CDFPlugin['setup']>;
export type CDFPluginStart = ReturnType<CDFPlugin['start']>;