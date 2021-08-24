
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
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    isAxisExtents,
    handleNoResults,
    customLabel,
    advancedValue,
    jsonInput,
    splitedAggregation,
    splitedField,
    splitedOrderBy,
    splitedOrder,
    splitedSize,
    isSplitedSeperateBucket,
    isSplitedShowMissingValues,
    splitedCustomLabel,
    isSplitAccordionClicked,
    isVerticalGrid,
    isHorizontalGrid,
    dateFilterFrom,
    dateFilterTo,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,
    xMin,
    xMax, } = vis.params;

  const cdfVis = buildExpressionFunction<CDFVisExpressionFunctionDefinition>(
    'cdf_vis',
    {
      aggregation,
      field,
      min_interval,
      isEmptyBucket,
      isExtendBounds,
      isAxisExtents,
      handleNoResults,
      customLabel,
      advancedValue,
      jsonInput,
      splitedAggregation,
      splitedField,
      splitedOrderBy,
      splitedOrder,
      splitedSize,
      isSplitedSeperateBucket,
      isSplitedShowMissingValues,
      splitedCustomLabel,
      isSplitAccordionClicked,
      isVerticalGrid,
      isHorizontalGrid,
      dateFilterFrom,
      dateFilterTo,
      splitedHistogramMinInterval,
      splitedDateHistogramMinInterval,
      xMin,
      xMax,
    }
  );

  const ast = buildExpression([cdfVis]);

  return ast.toAst();
};