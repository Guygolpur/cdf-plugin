

import { ExpressionFunctionDefinition, Render } from 'src/plugins/expressions/public';
import { Filter, KibanaContext } from 'src/plugins/data/public';

export interface CDFVisParams {
  isUpdate: boolean;
  aggregation: string;
  field: string;
  min_interval: number;
  isEmptyBucket: boolean;
  isExtendBounds: boolean;
  handleNoResults: boolean;
  customLabel: string;
  advancedValue: string;
  jsonInput: string;
  // timeFilterInput: Filter;
  timeFilterFromInput: string;
  timeFilterToInput: string;
  splitedAggregation: string;
  splitedField: string;
  splitedOrderBy: string;
  splitedOrder: string;
  splitedSize: number;
  isSplitedSeperateBucket: boolean;
  isSplitedShowMissingValues: boolean;
  splitedCustomLabel: string;
  isSplitAccordionClicked: boolean;
}

export interface CDFVisRenderValue {
  visParams: {
    isUpdate: boolean;
    aggregation: string;
    field: string;
    min_interval: number;
    isEmptyBucket: boolean;
    isExtendBounds: boolean;
    handleNoResults: boolean;
    customLabel: string;
    advancedValue: string;
    jsonInput: string;
    // timeFilterInput: Filter;
    timeFilterFromInput: string;
    timeFilterToInput: string;
    splitedAggregation: string;
    splitedField: string;
    splitedOrderBy: string;
    splitedOrder: string;
    splitedSize: number;
    isSplitedSeperateBucket: boolean;
    isSplitedShowMissingValues: boolean;
    splitedCustomLabel: string;
    isSplitAccordionClicked: boolean;
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
    isUpdate: {
      types: ['boolean'],
      default: false,
      help: 'Visualization only argument with type boolean',
    },
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
    handleNoResults: {
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
    timeFilterFromInput: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    timeFilterToInput: {
      types: ['string'],
      default: '',
      help: 'Visualization only argument with type string',
    },
    splitedAggregation: {
      types: ['string'],
      default: '',
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
    }
    // timeFilterInput: {
    //   types: ['filter'],
    //   default: '',
    //   help: 'Visualization only argument with type filter',
    // },
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
          isUpdate: args.isUpdate,
          aggregation: args.aggregation,
          field: args.field,
          min_interval: args.min_interval,
          isEmptyBucket: args.isEmptyBucket,
          isExtendBounds: args.isExtendBounds,
          handleNoResults: args.handleNoResults,
          customLabel: args.customLabel,
          advancedValue: args.advancedValue,
          jsonInput: args.jsonInput,
          // timeFilterInput: args.timeFilterInput,
          timeFilterFromInput: args.timeFilterFromInput,
          timeFilterToInput: args.timeFilterToInput,
          splitedAggregation: args.splitedAggregation,
          splitedField: args.splitedField,
          splitedOrderBy: args.splitedOrderBy,
          splitedOrder: args.splitedOrder,
          splitedSize: args.splitedSize,
          isSplitedSeperateBucket: args.isSplitedSeperateBucket,
          isSplitedShowMissingValues: args.isSplitedShowMissingValues,
          splitedCustomLabel: args.splitedCustomLabel,
          isSplitAccordionClicked: args.isSplitAccordionClicked,
        },
      },
    };
  },
};