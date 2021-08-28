import { ExpressionFunctionDefinition, Render } from 'src/plugins/expressions/public';
import { KibanaContext } from 'src/plugins/data/public';

export interface CDFVisParams {
  // X-axix
  field: string;
  min_interval: number;
  isEmptyBucket: boolean;
  isExtendBounds: boolean;
  customLabel: string;
  advancedValue: string;
  jsonInput: string;

  handleNoResults: boolean;
  aggregation: string;
  // Metrix & Axes
  isAxisExtents: boolean;
  xMin: number;
  xMax: number;

  splitedAggregation: string;
  splitedField: string;
  splitedOrderBy: string;
  splitedOrder: string;
  splitedSize: number;
  isSplitedSeperateBucket: boolean;
  isSplitedShowMissingValues: boolean;
  splitedCustomLabel: string;
  isSplitAccordionClicked: boolean;
  isVerticalGrid: boolean;
  isHorizontalGrid: boolean;
  dateFilterFrom: string;
  dateFilterTo: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  splitedHistogramMinInterval: number;
  splitedDateHistogramMinInterval: string;
}

export interface CDFVisRenderValue {
  visParams: {
    // X-axis
    aggregation: string;
    field: string;
    min_interval: number;
    isEmptyBucket: boolean;
    isExtendBounds: boolean;
    customLabel: string;
    advancedValue: string;
    jsonInput: string;

    // Metrix & Axes
    isAxisExtents: boolean;
    xMin: number;
    xMax: number;

    handleNoResults: boolean;
    splitedAggregation: string;
    splitedField: string;
    splitedOrderBy: string;
    splitedOrder: string;
    splitedSize: number;
    isSplitedSeperateBucket: boolean;
    isSplitedShowMissingValues: boolean;
    splitedCustomLabel: string;
    isSplitAccordionClicked: boolean;
    isVerticalGrid: boolean;
    isHorizontalGrid: boolean;
    dateFilterFrom: string;
    dateFilterTo: string;
    dateRangeStart: string;
    dateRangeEnd: string;
    splitedHistogramMinInterval: number;
    splitedDateHistogramMinInterval: string;
  };
}

type Output = Promise<Render<CDFVisRenderValue>>;

export type CDFVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  'cdf_vis',
  KibanaContext,
  CDFVisParams,
  Output
>;

export const cdfVisFn: CDFVisExpressionFunctionDefinition = {
  name: 'cdf_vis',
  type: 'render',
  inputTypes: ['kibana_context'],
  help:
    'The expression function definition should be registered for a custom visualization to be rendered',
  args: {
    // X-axis
    aggregation: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    field: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    min_interval: {
      types: ['number'],
      default: 1,
      help: 'Visualization only argument with type number',
    },
    isEmptyBucket: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    isExtendBounds: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    customLabel: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    advancedValue: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    jsonInput: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },

    // Metrix & Axes
    isAxisExtents: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    xMin: {
      types: ['number'],
      default: 1,
      help: 'Visualization only argument with type number',
    },
    xMax: {
      types: ['number'],
      default: 100,
      help: 'Visualization only argument with type number',
    },

    handleNoResults: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    splitedAggregation: {
      types: ['string'],
      default: 'date_histogram',
      help: 'Visualization only argument with type string',
    },
    splitedField: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    splitedOrderBy: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    splitedOrder: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    splitedSize: {
      types: ['number'],
      default: 1,
      help: 'Visualization only argument with type number',
    },
    isSplitedSeperateBucket: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    isSplitedShowMissingValues: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    splitedCustomLabel: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    isSplitAccordionClicked: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    isVerticalGrid: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    isHorizontalGrid: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
    dateFilterFrom: {
      types: ['string'],
      default: 'now-15m',
      help: 'Visualization only argument with type string',
    },
    dateFilterTo: {
      types: ['string'],
      default: 'now',
      help: 'Visualization only argument with type string',
    },
    dateRangeStart: {
      types: ['string'],
      default: 'now-15m',
      help: 'Visualization only argument with type string',
    },
    dateRangeEnd: {
      types: ['string'],
      default: 'now',
      help: 'Visualization only argument with type string',
    },
    splitedHistogramMinInterval: {
      types: ['number'],
      default: 1,
      help: 'Visualization only argument with type number',
    },
    splitedDateHistogramMinInterval: {
      types: ['string'],
      default: 'auto',
      help: 'Visualization only argument with type string',
    },

  },
  async fn(input, args) {
    /**
     * You can do any calculation you need before rendering.
     * The function can also do asynchronous operations, e.x.:
     *
        const calculatedCounter = await new Promise((resolve) =>
          setTimeout(() => {
            resolve(args.counter * 2);
          }, 3000)
        );
    */

    return {
      type: 'render',
      as: 'cdf_vis',
      value: {
        visParams: {
          // X-axis
          aggregation: args.aggregation,
          field: args.field,
          min_interval: args.min_interval,
          isEmptyBucket: args.isEmptyBucket,
          isExtendBounds: args.isExtendBounds,
          customLabel: args.customLabel,
          advancedValue: args.advancedValue,
          jsonInput: args.jsonInput,

          // Metrix & Axes
          isAxisExtents: args.isAxisExtents,
          xMin: args.xMin,
          xMax: args.xMax,

          handleNoResults: args.handleNoResults,
          splitedAggregation: args.splitedAggregation,
          splitedField: args.splitedField,
          splitedOrderBy: args.splitedOrderBy,
          splitedOrder: args.splitedOrder,
          splitedSize: args.splitedSize,
          isSplitedSeperateBucket: args.isSplitedSeperateBucket,
          isSplitedShowMissingValues: args.isSplitedShowMissingValues,
          splitedCustomLabel: args.splitedCustomLabel,
          isSplitAccordionClicked: args.isSplitAccordionClicked,
          isVerticalGrid: args.isVerticalGrid,
          isHorizontalGrid: args.isHorizontalGrid,
          dateFilterFrom: args.dateFilterFrom,
          dateFilterTo: args.dateFilterTo,
          dateRangeStart: args.dateRangeStart,
          dateRangeEnd: args.dateRangeEnd,
          splitedHistogramMinInterval: args.splitedHistogramMinInterval,
          splitedDateHistogramMinInterval: args.splitedDateHistogramMinInterval,
        },
      },
    };
  },
};
