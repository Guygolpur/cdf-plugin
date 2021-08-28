
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
    // X-axis
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
    jsonInput,
    ///////////
    // Metrix & Axes
    isAxisExtents,
    xMin,
    xMax,
    ////////////////
    
    handleNoResults,
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
    dateRangeStart,
    dateRangeEnd,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,
    } = vis.params;

  const cdfVis = buildExpressionFunction<CDFVisExpressionFunctionDefinition>(
    'cdf_vis',
    {
    // X-axis
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
    jsonInput,
    ///////////

    // Metrix & Axes
    isAxisExtents,
    xMin,
    xMax,
    ////////////////
   
    handleNoResults,
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
    dateRangeStart,
    dateRangeEnd,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,
    }
  );

  const ast = buildExpression([cdfVis]);

  return ast.toAst();
};