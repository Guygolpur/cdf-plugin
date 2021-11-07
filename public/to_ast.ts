import { VisToExpressionAst } from 'src/plugins/visualizations/public';
import {
  buildExpression,
  buildExpressionFunction,
} from '../../../src/plugins/expressions/public';
import {
  CDFVisExpressionFunctionDefinition,
  CDFVisParams,
} from './cdf_vis_fn';

export const toExpressionAst: VisToExpressionAst<CDFVisParams> = (vis) => {
  const {
    // High level
    indexPattern,

    // X-axis
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
    jsonInput,

    // Metrix & Axes
    isAxisExtents,
    xMin,
    xMax,

    handleNoResults,
    splitedAggregation,
    splitedField,
    splitedOrder,
    isSplitedSeperateBucket,
    isSplitedShowMissingValues,
    splitedCustomLabel,
    isSplitAccordionSearch,
    isVerticalGrid,
    isHorizontalGrid,
    dateFilterFrom,
    dateFilterTo,
    dateRangeStart,
    dateRangeEnd,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,
    subBucketArray,

    // Filters
    filters,
    negativeFilters,
  } = vis.params;

  const cdfVis = buildExpressionFunction<CDFVisExpressionFunctionDefinition>(
    'cdf_vis',
    {
      // High level
      indexPattern,

      // X-axis
      aggregation,
      field,
      min_interval,
      isEmptyBucket,
      isExtendBounds,
      customLabel,
      advancedValue,
      jsonInput,

      // Metrix & Axes
      isAxisExtents,
      xMin,
      xMax,

      handleNoResults,
      splitedAggregation,
      splitedField,
      splitedOrder,
      isSplitedSeperateBucket,
      isSplitedShowMissingValues,
      splitedCustomLabel,
      isSplitAccordionSearch,
      isVerticalGrid,
      isHorizontalGrid,
      dateFilterFrom,
      dateFilterTo,
      dateRangeStart,
      dateRangeEnd,
      splitedHistogramMinInterval,
      splitedDateHistogramMinInterval,
      subBucketArray,

      // Filters
      filters,
      negativeFilters,
    }
  );

  const ast = buildExpression([cdfVis]);
  return ast.toAst();
};
