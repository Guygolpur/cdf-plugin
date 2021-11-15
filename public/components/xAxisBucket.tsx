import React from 'react';
import {
  EuiFlexItem,
  EuiSpacer,
  EuiText,
  EuiFormRow,
  EuiComboBox,
  EuiSelect,
  EuiFieldNumber,
  EuiSwitch,
  EuiFieldText,
  EuiIconTip,
  EuiFlexGroup,
  EuiButtonEmpty,
} from '@elastic/eui';

export const AxisBucket = ({
  onGeneralValChange, onGeneralBoolValChange, selectedHistogramFieldHandler,
  selectedHistogramField, isEmptyBucket, aggregationArr,
  storedMinimumInterval }: any
) => {
  return (
    <>
      <EuiText size="xs">
        <div>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem>
              <b>Aggregation</b>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty flush="right" href="https://www.elastic.co/guide/en/elasticsearch/reference/7.12/search-aggregations-bucket-histogram-aggregation.html" target="_blank" size="xs">
                Histogram help
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </EuiText>
      <EuiFormRow fullWidth>
        <EuiSelect
          options={[
            { value: 'histogram', text: 'Histogram' },
          ]}
          onChange={(e) => onGeneralValChange(e, 'aggregation')}
          fullWidth
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Field" fullWidth>
        <EuiComboBox
          singleSelection={{ asPlainText: true }}
          placeholder="Search"
          options={aggregationArr}
          selectedOptions={selectedHistogramField}
          onChange={selectedHistogramFieldHandler}
          isClearable={true}
          data-test-subj="histogramField"
          fullWidth
          isInvalid={!(selectedHistogramField.length > 0)}
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiText size="xs">
        <div>
          <b>Minimum interval</b>
          <EuiIconTip
            type="iInCircle"
            color="subdued"
            content={
              <span>
                Interval will be automatically scaled in the event that the provided value creates more buckets than specified by Advanced Setting's histogram:maxBars
              </span>
            }
            iconProps={{
              className: 'eui-alignTop',
            }}
          />
        </div>
      </EuiText>

      <EuiSpacer size="xs" />

      <EuiFormRow fullWidth>
        <EuiFieldNumber placeholder={storedMinimumInterval} min={1} onChange={(e) => onGeneralValChange(e, 'min_interval')} fullWidth />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
        <EuiSwitch
          label="Show empty buckets"
          name="switch"
          checked={isEmptyBucket}
          onChange={() => onGeneralBoolValChange('isEmptyBucket')}
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'customLabel')}>
        <EuiFieldText name="first" fullWidth />
      </EuiFormRow>
    </>
  );
};
