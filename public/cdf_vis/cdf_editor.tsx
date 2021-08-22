
import React, { Fragment } from 'react';

import {
  EuiCheckbox,
  EuiFormRow,
  EuiSelect,
  EuiSwitch,
  EuiPanel,
  EuiTabbedContent,
  EuiSpacer,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiFieldNumber,
  EuiText,
  EuiFieldText,
  EuiCollapsibleNavGroup,
  EuiTextArea,
  EuiIconTip,
} from '@elastic/eui';

import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';

import { htmlIdGenerator } from '@elastic/eui/lib/services';
import axios from 'axios';
import { AddSubBucket } from '../components/addSubBucket';
// import * as data from 'src/plugins/data/public';

interface CounterParams {
  isUpdate: boolean;
  AxisExtents: boolean;
  aggregation: string;
  field: string;
  min_interval: number;
  isEmptyBucket: boolean;
  isExtendBounds: boolean;
  handleNoResults: boolean;
  customLabel: string;
  advancedValue: string;
  jsonInput: string;
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
  dateFilterFrom: string,
  dateFilterTo: string,
}

export class CDFEditor extends React.Component<VisEditorOptionsProps<CounterParams>> {
  constructor(props: any) {
    super(props);
    this.state = {
      comboBoxSelectionOptions: [],
      value: 100,
      aggregationArr: [],
      isAddPopoverOpen: false,
      splitedAggregationArr: [],
    };
  }

  componentDidMount() {
    this.getIndicesMapping()
      .then(response => {
        const obj = response.data['arc-samples-20210623'].mappings.properties
        let objNode: any, objNodeSub: any
        let fieldOptions: any[] = []
        let fieldOptionsSub: any[] = []
        Object.entries(obj).forEach(([key, value]) => {
          objNodeSub = { 'value': key, 'text': key };
          fieldOptionsSub.push(objNodeSub)
          this.setState({ splitedAggregationArr: fieldOptionsSub })
          if (value.type === 'integer' || value.type === 'double' || value.type === 'long') {
            objNode = { 'value': key, 'text': key };
            fieldOptions.push(objNode)
          }
        })
        this.setState({ aggregationArr: fieldOptions })
      })
      .catch(error => { console.log('err: ', error) })
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.timeRange.from !== this.props.timeRange.from) {
      this.props.setValue('dateFilterFrom', this.props.timeRange.from);
    }
    if (prevProps.timeRange.to !== this.props.timeRange.to) {
      this.props.setValue('dateFilterTo', this.props.timeRange.to);
    }
  }

  getIndicesMapping = () => {
    return axios({
      url: 'http://localhost:9200/arc-*/_mapping',
      method: 'GET',
    })
  }

  onUpdateChange = () => {
    this.props.setValue('isUpdate', true);
  };

  onAggregationChange = (e: any) => {
    this.props.setValue('aggregation', e.target.value);
  }

  onFieldChange = (e: any) => {
    this.props.setValue('field', e.target.value);
  }

  onMinIntervalChange = (e: any) => {
    this.props.setValue('min_interval', e.target.value);
  }

  onXAxisGridChange = () => {
    this.props.setValue('isVerticalGrid', !this.props.stateParams.isVerticalGrid);
  }

  onYAxisGridChange = () => {
    this.props.setValue('isHorizontalGrid', !this.props.stateParams.isHorizontalGrid);
  }


  onSetAxis = () => {
    this.props.setValue('AxisExtents', !this.props.stateParams.AxisExtents);
  }

  onShowBucketChange = () => {
    this.props.setValue('isEmptyBucket', !this.props.stateParams.isEmptyBucket);
  };

  onShowBoundsChange = () => {
    this.props.setValue('isExtendBounds', !this.props.stateParams.isExtendBounds);
  };

  onCustomLabelChange = (e: any) => {
    this.props.setValue('customLabel', e.target.value);
  };

  onAdvanceChange = (e: any) => {
    this.props.setValue('advancedValue', e.target.value);
  };

  onJsonChange = (e: any) => {
    this.props.setValue('jsonInput', e.target.value);
  };

  closeAddPopover = () => {
    this.setState({ isAddPopoverOpen: false })
  }

  /*Splited Lines*/

  onSplitedAggregationChange = (e: any) => {
    this.props.setValue('splitedAggregation', e.target.value);
  }

  onSplitedFieldChange = (e: any) => {
    this.props.setValue('splitedField', e.target.value);
  }

  onSplitedOrderByChange = (e: any) => {
    this.props.setValue('splitedOrderBy', e.target.value);
  }

  onSplitedOrderChange = (e: any) => {
    this.props.setValue('splitedOrder', e.target.value);
  }

  onSplitedSizeChange = (e: any) => {
    this.props.setValue('splitedSize', e.target.value);
  }

  onSplitedSeperateBucketChange = () => {
    this.props.setValue('isSplitedSeperateBucket', !this.props.stateParams.isSplitedSeperateBucket);
  };

  onSplitedShowMissingValuesChange = () => {
    this.props.setValue('isSplitedShowMissingValues', !this.props.stateParams.isSplitedShowMissingValues);
  };

  onSplitedCustomLabelChange = (e: any) => {
    this.props.setValue('splitedCustomLabel', e.target.value);
  };

  splitAccordionClicked = () => {
    this.props.setValue('isSplitAccordionClicked', !this.props.stateParams.isSplitAccordionClicked);
  }

  render() {

    let tabs = [
      {
        id: 'data',
        name: 'Data',
        content: (
          <Fragment>
            <EuiSpacer />
            <EuiFlexItem>
              <EuiCard
                layout="horizontal"
                titleSize="xs"
                title={'Buckets'}
                description=""
              >
                <EuiAccordion id="accordion1" buttonContent={`X-Axis ${this.props.stateParams.field}`}>
                  <EuiPanel style={{ maxWidth: '100%' }}>

                    <EuiFormRow label="Aggregation" fullWidth>
                      <EuiSelect
                        options={[
                          { value: 'histogram', text: 'Histogram' },
                        ]}
                        onChange={(e) => this.onAggregationChange(e)}
                        fullWidth
                      />
                    </EuiFormRow>

                    <EuiFormRow label="Field" fullWidth>
                      <EuiSelect
                        options={
                          this.state.aggregationArr
                        }
                        value={this.props.stateParams.field}
                        fullWidth
                        onChange={(e: any) => this.onFieldChange(e)
                        }
                      />
                    </EuiFormRow>

                    <EuiSpacer size="s" />

                    <EuiFlexItem grow={false} style={{ width: '100%' }}>
                      <EuiFormRow label="Minimum interval">
                        <EuiFieldNumber placeholder={1} min={1} onChange={(e) => this.onMinIntervalChange(e)} />
                      </EuiFormRow>
                    </EuiFlexItem>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
                      <EuiSwitch
                        label="Show empty buckets"
                        name="switch"
                        checked={this.props.stateParams.isEmptyBucket}
                        onChange={this.onShowBucketChange}
                      />
                    </EuiFormRow>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
                      <EuiSwitch
                        label="Extend bounds"
                        name="switch"
                        checked={this.props.stateParams.isExtendBounds}
                        onChange={this.onShowBoundsChange}
                      />
                    </EuiFormRow>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onCustomLabelChange(e)}>
                      <EuiFieldText name="first" fullWidth />
                    </EuiFormRow>

                    <EuiCollapsibleNavGroup
                      data-test-subj="ADVANCED"
                      background="light"
                      title="Advanced"
                      arrowDisplay="left"
                      isCollapsible={true}
                      initialIsOpen={false}>
                      <EuiText style={{ display: "inline" }} onChange={(e) => this.onJsonChange(e)} >
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
                          value={this.props.stateParams.advancedValue}
                          onChange={(e) => this.onAdvanceChange(e)}
                        />
                      </EuiText>
                    </EuiCollapsibleNavGroup>

                  </EuiPanel>
                </EuiAccordion>

                <EuiSpacer size="m" />

                {/* Splited */}

                <EuiAccordion id="accordion1" buttonContent={`Split lines`} onClick={this.splitAccordionClicked}>
                  <EuiPanel style={{ maxWidth: '100%' }}>

                    <EuiFormRow label="Sub aggregation" fullWidth>
                      <EuiSelect
                        options={[
                          { value: 'date_histogram', text: 'Date Histogram' },
                          { value: 'range', text: 'Date Range' },   // timestamp
                          { value: 'filter', text: 'Filter' },
                          { value: 'filter', text: 'Filters' },
                          { value: 'Geotile', text: 'Geotile' },
                          { value: 'histogram', text: 'Histogram' },
                          { value: 'ip_ranges', text: 'IPv4 Range' },
                          { value: 'range', text: 'Range' },
                          { value: 'significant_terms', text: 'Significant Terms' },
                          { value: 'terms', text: 'Terms' },
                        ]}
                        onChange={(e) => this.onSplitedAggregationChange(e)}
                        fullWidth
                      />
                    </EuiFormRow>

                    <EuiFormRow label="Field" fullWidth>
                      <EuiSelect
                        options={
                          this.state.splitedAggregationArr
                        }
                        value={this.props.stateParams.splitedField}
                        fullWidth
                        onChange={(e: any) => this.onSplitedFieldChange(e)
                        }
                      />
                    </EuiFormRow>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Order by" fullWidth>
                      <EuiSelect
                        options={[
                          { value: 'Metric: Count', text: 'Metric: Count' },
                          { value: 'Custom metric', text: 'Custom metric' },
                          { value: 'Alphabetical', text: 'Alphabetical' },
                        ]}
                        onChange={(e) => this.onSplitedOrderByChange(e)}
                        fullWidth
                      />
                    </EuiFormRow>

                    <EuiSpacer size="m" />


                    <EuiFlexGroup style={{ maxWidth: 800 }}>
                      <EuiFlexItem>
                        <EuiFormRow label="Order" >
                          <EuiSelect
                            options={[
                              { value: 'Descending', text: 'Descending' },
                              { value: 'Ascending', text: 'Ascending' },
                            ]}
                            onChange={(e) => this.onSplitedOrderChange(e)}
                          />
                        </EuiFormRow>
                      </EuiFlexItem>

                      <EuiFlexItem grow={false} >
                        <EuiFormRow label="Size">
                          <EuiFieldNumber placeholder={1} min={1} onChange={(e) => this.onSplitedSizeChange(e)} />
                        </EuiFormRow>
                      </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
                      <EuiSwitch
                        label="Group other values in seperate bucket"
                        name="switch"
                        checked={this.props.stateParams.isSplitedSeperateBucket}
                        onChange={this.onSplitedSeperateBucketChange}
                      />
                    </EuiFormRow>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
                      <EuiSwitch
                        label="Show missing values"
                        name="switch"
                        checked={this.props.stateParams.isSplitedShowMissingValues}
                        onChange={this.onSplitedShowMissingValuesChange}
                      />
                    </EuiFormRow>

                    <EuiSpacer size="s" />

                    <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onSplitedCustomLabelChange(e)}>
                      <EuiFieldText name="first" fullWidth />
                    </EuiFormRow>

                    <EuiCollapsibleNavGroup
                      data-test-subj="ADVANCED"
                      background="light"
                      title="Advanced"
                      arrowDisplay="left"
                      isCollapsible={true}
                      initialIsOpen={false}>
                      <EuiText style={{ display: "inline" }} onChange={(e) => this.onJsonChange(e)} >
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
                          value={this.props.stateParams.advancedValue}
                          onChange={(e) => this.onAdvanceChange(e)}
                        />
                      </EuiText>
                    </EuiCollapsibleNavGroup>

                  </EuiPanel>
                </EuiAccordion>

                <EuiSpacer size="m" />

                <AddSubBucket />

              </EuiCard>
            </EuiFlexItem>
          </Fragment >
        ),
      },
      {
        id: 'metrix_axis',
        name: 'Metrix & Axis',
        content: (
          <Fragment>
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <EuiCard
                  textAlign="left"
                  title="X-Axis"
                  description={
                    <span>
                      <EuiSwitch label="Set Axis Extents" onChange={() => { this.onSetAxis() }} checked={this.props.stateParams.AxisExtents} />
                    </span>
                  }></EuiCard>
              </EuiFlexItem>
            </EuiFlexGroup>
          </Fragment>
        ),
      },
      {
        id: 'panel_settings',
        name: 'Panel Settings',
        content: (
          <Fragment>
            <EuiFlexGroup gutterSize="l">
              <EuiFlexItem>
                <EuiCard
                  textAlign="left"
                  title="Settings"
                  description={
                    <span>
                      <EuiAccordion id="accordion1" buttonContent="Settings">

                        <EuiCheckbox
                          id={htmlIdGenerator()()}
                          label="X-Axis Lines"
                          checked={this.props.stateParams.isVerticalGrid}
                          onChange={(e) => this.onXAxisGridChange()}
                          compressed
                        />

                        <EuiSpacer size="m" />

                        <EuiCheckbox
                          id={htmlIdGenerator()()}
                          label="Y-Axis Lines"
                          checked={this.props.stateParams.isHorizontalGrid}
                          onChange={(e) => this.onYAxisGridChange()}
                          compressed
                        />
                      </EuiAccordion>
                    </span>
                  }></EuiCard>
              </EuiFlexItem>
            </EuiFlexGroup>
          </Fragment>
        ),
      },
    ];

    return (
      <Fragment>
        <EuiTabbedContent
          tabs={tabs}
          initialSelectedTab={tabs[0]}
          autoFocus="selected"
          onTabClick={(tab) => {
            console.log('clicked tab', tab);
          }}
        />
      </Fragment>
    );
  }
}