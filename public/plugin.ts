import { i18n } from '@kbn/i18n';
import { AppMountParameters, CoreSetup, CoreStart, Plugin } from 'src/core/public';
import { PLUGIN_NAME } from '../common';
import { VisualizationsSetup } from 'src/plugins/visualizations/public';
import { Plugin as ExpressionsPlugin } from '../../../src/plugins/expressions/public';
import { cdfVisFn, CDFVisParams } from './cdf_vis_fn';
import { cdfVisRenderer } from './cdf_vis_renderer';
import { toExpressionAst } from './to_ast';
import { CDFEditor } from './cdf_vis/cdf_editor';
import cdfSvgIcon from './images/cdf_line.svg';
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
        data,
        defaults: {
          // High level
          indexPattern: null,

          // X-axis
          aggregation: 'histogram',
          field: null,
          min_interval: 1,
          isEmptyBucket: false,
          isExtendBounds: false,
          customLabel: '',
          jsonInput: '',  // json syntax validation

          // Metrix & Axes
          isAxisExtents: false,
          xMin: null,
          xMax: null,

          handleNoResults: true,
          isVerticalGrid: false,
          isHorizontalGrid: false,
          isSplitedSeperateBucket: false,
          isSplitedShowMissingValues: false,
          isSplitAccordionSearch: false,

          splitedAggregation: 'terms',
          splitedField: '',
          splitedOrder: 'desc',
          splitedCustomLabel: '',
          dateFilterFrom: 'now-15m',
          dateFilterTo: 'now',

          dateRangeStart: 'now-15m',
          dateRangeEnd: 'now',
          splitedDateHistogramMinInterval: 'auto',
          numberOfTickTexts: 10,
          subBucketArray: '{}',

          splitedHistogramMinInterval: 1,

          splitedGlobalCounter: 1,
          splitedGlobalIds: '[]',

          // Filters
          filters: '[{"match_all": {}}]',
          negativeFilters: '[]',
          rangeFilters: '[]',
          searchShould: '[]',

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
      requiresSearch: true,   //src\plugins\vis_type_table\public\legacy\table_vis_legacy_type.ts
    });
  }

  public start(core: CoreStart, plugins: SetupDependencies) {
    return {};
  }
  public stop() { }
}
export type CDFPluginSetup = ReturnType<CDFPlugin['setup']>;
export type CDFPluginStart = ReturnType<CDFPlugin['start']>;
