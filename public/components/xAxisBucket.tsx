
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
    EuiTextArea
} from '@elastic/eui';

export const AxisBucket = ({
    onGeneralValChange, onGeneralBoolValChange,
    field, isExtendBounds, isEmptyBucket, advancedValue,
    aggregationArr} : any
    ) => {
    return (
        <EuiPanel id="panel" style={{ maxWidth: '100%' }}>

          <EuiFormRow label="Aggregation" fullWidth>
            <EuiSelect
              options={[
                { value: 'histogram', text: 'Histogram' },
              ]}
              onChange={(e) => onGeneralValChange(e, 'aggregation')}
              fullWidth
            />
          </EuiFormRow>

          <EuiFormRow label="Field" fullWidth>
            <EuiSelect
              options={
                aggregationArr
              }
              value={field}
              fullWidth
              onChange={(e: any) => onGeneralValChange(e, 'field')
              }
            />
          </EuiFormRow>

          <EuiSpacer size="s" />

          <EuiFlexItem grow={false} style={{ width: '100%' }}>
            <EuiFormRow label="Minimum interval">
              <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => onGeneralValChange(e, 'min_interval')} />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiSpacer size="s" />

          <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
            <EuiSwitch
              label="Show empty buckets"
              name="switch"
              checked={isEmptyBucket}
              onChange={()=> onGeneralBoolValChange('isEmptyBucket')}
            />
          </EuiFormRow>

          <EuiSpacer size="s" />

          <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
            <EuiSwitch
              label="Extend bounds"
              name="switch"
              checked={isExtendBounds}
              onChange={()=> onGeneralBoolValChange('isExtendBounds')}
            />
          </EuiFormRow>

          <EuiSpacer size="s" />

          <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => onGeneralValChange(e, 'customLabel')}>
            <EuiFieldText name="first" fullWidth />
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
              type="alert"
              color="black"
              content="Any JSON formatted properties you add here will be marged with the elasticsearch aggregation definition for this section. For example 'shard_size' on a terms aggregation."
            />
            <EuiText size="s" color="subdued">
              <EuiTextArea
                aria-label="Use aria labels when no actual label is in use"
                value={advancedValue}
                onChange={(e) => onGeneralValChange(e, 'advancedValue')}
              />
            </EuiText>
          </EuiCollapsibleNavGroup>

        </EuiPanel>
    );
};