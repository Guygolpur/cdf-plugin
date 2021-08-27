
import React, { Fragment } from 'react';
import axios from 'axios';
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
import { AddSubBucket } from '../components/addSubBucket';
import { DatePicker } from '../components/form/datePicker';

interface CounterParams {
  isAxisExtents: boolean;
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
  dateFilterFrom: string;
  dateFilterTo: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  splitedHistogramMinInterval: number;
  splitedDateHistogramMinInterval: string;
  xMin: number;
  xMax: number;
}

interface CDFEditorComponentState {
  comboBoxSelectionOptions: any[];
  numberFieldArr: any[];
  dateFieldArr: any[];
  booleanDateNumberStringFieldArr: any[];
  splitedAggregationArr: any[];
  value: number;
  isAddPopoverOpen: boolean;
}

export class CDFEditor extends React.Component<VisEditorOptionsProps<CounterParams>, CDFEditorComponentState> {
  constructor(props: any) {
    super(props);
    this.state = {
      comboBoxSelectionOptions: [],
      numberFieldArr: [],
      dateFieldArr: [],
      booleanDateNumberStringFieldArr: [],
      splitedAggregationArr: [],
      value: 100,
      isAddPopoverOpen: false,
    };
  }

  componentDidMount() {
    this.props.setValue('isSplitAccordionClicked', false)
    this.getIndicesMapping()
      .then(response => {
        const mappingRes = response.data['arc-samples-20210623'].mappings.properties
        let objNodeSub: any, numberFieldOptionTmp: any[] = [], dateFieldOptionTmp: any[] = [], booleanDateNumberStringFieldOptionTmp: any[] = [], allFieldsOptionTmp: any[] = []
        Object.entries(mappingRes).forEach(([key, value]: any) => {
          objNodeSub = { 'value': key, 'text': key };
          allFieldsOptionTmp.push(objNodeSub)
          if (value.type === 'integer' || value.type === 'double' || value.type === 'long' || value.type === 'float') {
            numberFieldOptionTmp.push(objNodeSub);
            booleanDateNumberStringFieldOptionTmp.push(objNodeSub);
          }
          else if (value.type === 'date') {
            dateFieldOptionTmp.push(objNodeSub);
          }
          else if (value.type === 'boolean' || value.type == 'string' || value.type == 'date') {
            booleanDateNumberStringFieldOptionTmp.push(objNodeSub);
          }
        })
        this.setState({
          numberFieldArr: numberFieldOptionTmp,
          dateFieldArr: dateFieldOptionTmp,
          booleanDateNumberStringFieldArr: booleanDateNumberStringFieldOptionTmp,
          splitedAggregationArr: allFieldsOptionTmp
        })
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

  onAggregationChange = (e: any) => {
    this.props.setValue('aggregation', e.target.value);
  }

  onFieldChange = (e: any) => {
    this.props.setValue('field', e.target.value);
  }

  onMinIntervalChange = (e: any) => {
    this.props.setValue('min_interval', e.target.value);
  }

  onAxisExtentsMinChange = (e: any) => {
    this.props.setValue('xMin', e.target.value);
  }

  onAxisExtentsMaxChange = (e: any) => {
    this.props.setValue('xMax', e.target.value);
  }

  onXAxisGridChange = () => {
    this.props.setValue('isVerticalGrid', !this.props.stateParams.isVerticalGrid);
  }

  onYAxisGridChange = () => {
    this.props.setValue('isHorizontalGrid', !this.props.stateParams.isHorizontalGrid);
  }

  onSetAxis = () => {
    this.props.setValue('isAxisExtents', !this.props.stateParams.isAxisExtents);
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
    console.log('clicked')
    this.props.setValue('isSplitAccordionClicked', !this.props.stateParams.isSplitAccordionClicked);
  }

  onSplitedHistogramMinIntervalChange = (e: any) => {
    this.props.setValue('splitedHistogramMinInterval', e.target.value);
  }

  onSplitedDateHistogramMinIntervalChange = (e: any) => {
    this.props.setValue('splitedDateHistogramMinInterval', e.target.value);
  }

  setDateRangeStart = (start: any) => {
    this.props.setValue('dateRangeStart', start);
  }

  setDateRangeEnd = (end: any) => {
    this.props.setValue('dateRangeEnd', end);
  }

  showAxisExtent(show: boolean) {
    if (show) {
      return (
        <span>
          <EuiFlexItem grow={false} style={{ width: '100%' }}>
            <EuiFormRow label="Min">
              <EuiFieldNumber value={this.props.stateParams.xMin} min={0} onChange={(e) => this.onAxisExtentsMinChange(e)} />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiSpacer size="s" />
          <EuiFlexItem grow={false} style={{ width: '100%' }}>
            <EuiFormRow label="Max">
              <EuiFieldNumber value={this.props.stateParams.xMax} min={0} onChange={(e) => this.onAxisExtentsMaxChange(e)} />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiSpacer size="s" />
        </span>
      )
    } else {
      return null
    }
  }

  render() {

    let splitedSubAggregationContent;
    if (this.props.stateParams.splitedAggregation == 'terms') {
      splitedSubAggregationContent = <>
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
              <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => this.onSplitedSizeChange(e)} />
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
      </>
    }
    else if (this.props.stateParams.splitedAggregation == 'histogram') {
      splitedSubAggregationContent = <>
        <EuiFormRow label="Field" fullWidth>
          <EuiSelect
            options={
              this.state.numberFieldArr
            }
            value={this.props.stateParams.splitedField}
            fullWidth
            onChange={(e: any) => this.onSplitedFieldChange(e)
            }
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFlexItem grow={false} style={{ width: '100%' }}>
          <EuiFormRow label="Minimum interval">
            <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => this.onSplitedHistogramMinIntervalChange(e)} />
          </EuiFormRow>
        </EuiFlexItem>

        <EuiSpacer size="m" />

        <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Show empty bucket"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Extend bounds"
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
      </>
    }
    else if (this.props.stateParams.splitedAggregation == 'date_histogram') {
      splitedSubAggregationContent = <>
        <EuiFormRow label="Field" fullWidth>
          <EuiSelect
            options={
              this.state.dateFieldArr
            }
            value={this.props.stateParams.splitedField}
            fullWidth
            onChange={(e: any) => this.onSplitedFieldChange(e)
            }
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFormRow label="Minimum interval" fullWidth>
          <EuiSelect
            options={[
              { value: 'minute', text: 'Minute' },
              { value: '1h', text: 'Hourly' },
              { value: '1d', text: 'Daily' },
              { value: '1w', text: 'Weekly' },
              { value: 'month', text: 'Monthly' },
              { value: '1y', text: 'Yearly' },
            ]}
            fullWidth
            onChange={(e: any) => this.onSplitedDateHistogramMinIntervalChange(e)
            }
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFormRow label="Switch" fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Drop partial buckets"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

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
      </>
    }
    else if (this.props.stateParams.splitedAggregation == 'date_range') {
      splitedSubAggregationContent = <>
        <EuiFormRow label="Field" fullWidth>
          <EuiSelect
            options={
              this.state.dateFieldArr
            }
            value={this.props.stateParams.splitedField}
            fullWidth
            onChange={(e: any) => this.onSplitedFieldChange(e)
            }
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        < DatePicker start={this.props.stateParams.dateRangeStart} end={this.props.stateParams.dateRangeEnd} setStart={this.setDateRangeStart} setEnd={this.setDateRangeEnd} />

        <EuiSpacer size="m" />

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
      </>
    }

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
                          this.state.numberFieldArr
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
                        <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => this.onMinIntervalChange(e)} />
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

                <EuiAccordion id="accordionSplit" buttonContent={`Split lines`} onToggle={this.splitAccordionClicked}>
                  <EuiPanel style={{ maxWidth: '100%' }}>

                    <EuiFormRow label="Sub aggregation" fullWidth>
                      <EuiSelect
                        options={[
                          { value: 'date_histogram', text: 'Date Histogram' },
                          { value: 'date_range', text: 'Date Range' },
                          { value: 'histogram', text: 'Histogram' },
                          { value: 'terms', text: 'Terms' },
                        ]}
                        onChange={(e) => this.onSplitedAggregationChange(e)}
                        fullWidth
                      />
                    </EuiFormRow>

                    {splitedSubAggregationContent}

                  </EuiPanel>
                </EuiAccordion>

                <EuiSpacer size="m" />

                {/* <AddSubBucket /> */}

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
                      <EuiSwitch label="Set Axis Extents" onChange={() => { this.onSetAxis() }} checked={this.props.stateParams.isAxisExtents} />
                    </span>
                  }>
                  {this.showAxisExtent(this.props.stateParams.isAxisExtents)}
                </EuiCard>
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
