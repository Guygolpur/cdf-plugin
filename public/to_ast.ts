
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
    isUpdate,
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
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
    domain_min,
    domain_max } = vis.params;

  const cdfVis = buildExpressionFunction<CDFVisExpressionFunctionDefinition>(
    'cdf_vis',
    {
      isUpdate,
      aggregation,
      field,
      min_interval,
      isEmptyBucket,
      isExtendBounds,
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
      domain_min,
      domain_max
    }
  );

  const ast = buildExpression([cdfVis]);

  return ast.toAst();
};