import React from 'react';
import {
  EuiFlexItem,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiFormRow,
  EuiSelect,
  EuiFieldNumber,
  EuiSwitch,
  EuiFieldText,
  EuiCollapsibleNavGroup,
  EuiIconTip,
  EuiTextArea,
  EuiFlexGroup,
  EuiButtonEmpty,
} from '@elastic/eui';

export const AxisBucket = ({
  onGeneralValChange, onGeneralBoolValChange,
  field, isExtendBounds, isEmptyBucket, advancedValue,
  aggregationArr, isIndexSelected }: any
) => {
  return (
    <EuiPanel id="panel" style={{ maxWidth: '100%' }}>
      <EuiText size="xs">
        <p>
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
        </p>
      </EuiText>
      <EuiFormRow fullWidth>
        <EuiSelect
          options={[
            { value: 'histogram', text: 'Histogram' },
          ]}
          onChange={(e) => onGeneralValChange(e, 'aggregation')}
          fullWidth
          disabled={!isIndexSelected}
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Field" fullWidth>
        <EuiSelect
          options={
            aggregationArr
          }
          value={field}
          fullWidth
          onChange={(e: any) => onGeneralValChange(e, 'field')}
          disabled={!isIndexSelected}
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiText size="xs">
        <p>
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
        </p>
      </EuiText>

      <EuiSpacer size="xs" />

      <EuiFormRow fullWidth>
        <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => onGeneralValChange(e, 'min_interval')} fullWidth disabled={!isIndexSelected}/>
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
        <EuiSwitch
          label="Show empty buckets"
          name="switch"
          checked={isEmptyBucket}
          onChange={() => onGeneralBoolValChange('isEmptyBucket')}
          disabled={!isIndexSelected}
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
        <EuiSwitch
          label="Extend bounds"
          name="switch"
          checked={isExtendBounds}
          onChange={() => onGeneralBoolValChange('isExtendBounds')}
          disabled={!isIndexSelected}
        />
      </EuiFormRow>

      <EuiSpacer size="m" />

      <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'customLabel')}>
        <EuiFieldText name="first" fullWidth disabled={!isIndexSelected}/>
      </EuiFormRow>

      <EuiCollapsibleNavGroup
        data-test-subj="ADVANCED"
        background="light"
        title="Advanced"
        arrowDisplay="left"
        isCollapsible={true}
        initialIsOpen={false}>
        <EuiText style={{ display: "inline" }} onChange={(e) => onGeneralValChange(e, 'jsonInput')} >
          <dl className="eui-definitionListReverse" style={{ display: "inline" }}>
            <dt style={{ display: "inline" }}>JSON input</dt>
          </dl>
        </EuiText>

        <EuiIconTip
          aria-label="Warning"
          size="m"
          type="iInCircle"
          color="black"
          content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
        />
        <EuiText size="s" color="subdued">
          <EuiTextArea
            aria-label="Use aria labels when no actual label is in use"
            value={advancedValue}
            onChange={(e) => onGeneralValChange(e, 'advancedValue')}
            disabled={!isIndexSelected}
          />
        </EuiText>
      </EuiCollapsibleNavGroup>

    </EuiPanel>
  );
};
