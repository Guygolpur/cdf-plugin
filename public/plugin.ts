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
    // console.log('data: ', data.query.timefilter.timefilter)
    // console.log('data from: ', data.query.timefilter.timefilter.getAbsoluteTime().from)
    // console.log('data to: ', data.query.timefilter.timefilter.getAbsoluteTime().to)

    expressions.registerFunction(cdfVisFn);
    expressions.registerRenderer(cdfVisRenderer);

    visualizations.createBaseVisualization<CDFVisParams>({
      name: 'cdf_vis',
      title: PLUGIN_NAME,
      icon: cdfSvgIcon,
      description: 'The CDF (cumulative distribution function) uses a line chart to represent symbolic distribution.',
      visConfig: {
        defaults: {
          isUpdate: false,
          aggregation: 'histogram',
          field: '',
          min_interval: 1,
          isEmptyBucket: false,
          isExtendBounds: false,
          handleNoResults: true,
          customLabel: '',
          advancedValue: '',
          jsonInput: '',  // json syntax validation
          numberOfTickTexts: 10,
          splitedAggregation: 'terms',
          splitedField: 'Projects',
          splitedOrderBy: 'Metric: Count',
          splitedOrder: 'Descending',
          splitedSize: 1,
          isSplitedSeperateBucket: false,
          isSplitedShowMissingValues: false,
          splitedCustomLabel: '',
          isSplitAccordionClicked: false,
          isVerticalGrid: false,
          isHorizontalGrid: false,
          dateFilterFrom: '',
          dateFilterTo: '',
          Xmin: null,
          Xmax: null,
          isAxisExtents: false,
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
    let timeFilterSubscription: Subscription
    timeFilterSubscription = plugins.data.query.timefilter.timefilter
      .getTimeUpdate$()
      .subscribe(() => {
        const initialRefreshInterval = plugins.data.query.timefilter.timefilter.getAbsoluteTime()
      });
    return {};
  } public stop() { }
}
export type CDFPluginSetup = ReturnType<CDFPlugin['setup']>;
export type CDFPluginStart = ReturnType<CDFPlugin['start']>;