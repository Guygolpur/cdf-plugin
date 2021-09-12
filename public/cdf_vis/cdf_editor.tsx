
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
import { AxisBucket } from '../components/xAxisBucket';
import { MetrixAndAxes } from '../components/metrixAndAxes';
import { CoreStart } from 'kibana/public';


interface CounterParams {
  // X-axis
  aggregation: string;
  field: string;
  min_interval: number;
  isEmptyBucket: boolean;
  isExtendBounds: boolean;
  customLabel: string;
  advancedValue: string;
  jsonInput: string;

  // Metrix & Axes
  isAxisExtents: boolean;
  xMin: number;
  xMax: number;

  handleNoResults: boolean;
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
        const indexRes = Object.keys(response.data)[0]
        const mappingRes = response.data[indexRes].mappings
        let objNodeSub: any, numberFieldOptionTmp: any[] = [], dateFieldOptionTmp: any[] = [], booleanDateNumberStringFieldOptionTmp: any[] = [], allFieldsOptionTmp: any[] = []

        for (const key in mappingRes) {
          let value = mappingRes[key];
          if (value != undefined && value.mapping[key]) {
            objNodeSub = { 'value': key, 'text': key };
            allFieldsOptionTmp.push(objNodeSub)
            if (value.mapping[key].type === 'integer' || value.mapping[key].type === 'double' || value.mapping[key].type === 'long' || value.mapping[key].type === 'float') {
              numberFieldOptionTmp.push(objNodeSub);
              booleanDateNumberStringFieldOptionTmp.push(objNodeSub);
            }
            else if (value.mapping[key].type === 'date') {
              dateFieldOptionTmp.push(objNodeSub);
            }
            else if (value.mapping[key].type === 'boolean' || value.mapping[key].type == 'string' || value.mapping[key].type == 'date') {
              booleanDateNumberStringFieldOptionTmp.push(objNodeSub);
            }
          }
        }

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
      url: '/api/mappings',
      method: 'GET',
      headers: { "kbn-xsrf": "true" }
    })
  }

  // field, min_interval, aggregation, xMin, xMax, customLabel, advancedValue, jsonInput,
  // splitedAggregation, splitedField, splitedOrderBy, splitedOrder, splitedSize, splitedCustomLabel
  // splitedHistogramMinInterval, splitedDateHistogramMinInterval
  onGeneralValChange = (e: any, valName: (keyof CounterParams)) => {
    this.props.setValue(valName, e.target.value);
  }

  // isVerticalGrid, isHorizontalGrid, isAxisExtents, isEmptyBucket, isExtendBounds, 
  // isSplitedSeperateBucket, isSplitedShowMissingValues, isSplitAccordionClicked
  onGeneralBoolValChange = (valName: (keyof CounterParams)) => {
    this.props.setValue(valName, !this.props.stateParams[valName]);
  }

  onSplitedSeperateBucketChange = () => {
    this.props.setValue('isSplitedSeperateBucket', !this.props.stateParams.isSplitedSeperateBucket);
  };
  onSplitedShowMissingValuesChange = () => {
    this.props.setValue('isSplitedShowMissingValues', !this.props.stateParams.isSplitedShowMissingValues);
  };
  splitAccordionClicked = () => {
    this.props.setValue('isSplitAccordionClicked', !this.props.stateParams.isSplitAccordionClicked);
  }

  closeAddPopover = () => {
    this.setState({ isAddPopoverOpen: false })
  }

  /*Splited Lines*/

  setDateRangeStart = (start: any) => {
    this.props.setValue('dateRangeStart', start);
  }

  setDateRangeEnd = (end: any) => {
    this.props.setValue('dateRangeEnd', end);
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
            onChange={(e: any) => this.onGeneralValChange(e, 'splitedField')
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
            onChange={(e) => this.onGeneralValChange(e, 'splitedOrderBy')}
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
                onChange={(e) => this.onGeneralValChange(e, 'splitedOrder')}
              />
            </EuiFormRow>
          </EuiFlexItem>

          <EuiFlexItem grow={false} >
            <EuiFormRow label="Size">
              <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => this.onGeneralValChange(e, 'splitedSize')} />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="s" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Group other values in seperate bucket"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Show missing values"
            name="switch"
            checked={this.props.stateParams.isSplitedShowMissingValues}
            onChange={this.onSplitedShowMissingValuesChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth />
        </EuiFormRow>

        <EuiCollapsibleNavGroup
          data-test-subj="ADVANCED"
          background="light"
          title="Advanced"
          arrowDisplay="left"
          isCollapsible={true}
          initialIsOpen={false}>
          <EuiText style={{ display: "inline" }} onChange={(e) => this.onGeneralValChange(e, 'jsonInput')} >
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
              onChange={(e) => this.onGeneralValChange(e, 'advancedValue')}
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
            onChange={(e: any) => this.onGeneralValChange(e, 'splitedField')
            }
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
          <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => this.onGeneralValChange(e, 'splitedHistogramMinInterval')} />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Show empty bucket"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Extend bounds"
            name="switch"
            checked={this.props.stateParams.isSplitedShowMissingValues}
            onChange={this.onSplitedShowMissingValuesChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth />
        </EuiFormRow>

        <EuiCollapsibleNavGroup
          data-test-subj="ADVANCED"
          background="light"
          title="Advanced"
          arrowDisplay="left"
          isCollapsible={true}
          initialIsOpen={false}>
          <EuiText style={{ display: "inline" }} onChange={(e) => this.onGeneralValChange(e, 'jsonInput')}  >
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
              value={this.props.stateParams.advancedValue}
              onChange={(e) => this.onGeneralValChange(e, 'advancedValue')}
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
            onChange={(e: any) => this.onGeneralValChange(e, 'splitedField')
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
            onChange={(e: any) => this.onGeneralValChange(e, 'splitedDateHistogramMinInterval')
            }
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Drop partial buckets"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiSpacer size="s" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth />
        </EuiFormRow>

        <EuiCollapsibleNavGroup
          data-test-subj="ADVANCED"
          background="light"
          title="Advanced"
          arrowDisplay="left"
          isCollapsible={true}
          initialIsOpen={false}>
          <EuiText style={{ display: "inline" }} onChange={(e) => this.onGeneralValChange(e, 'jsonInput')}  >
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
              onChange={(e) => this.onGeneralValChange(e, 'advancedValue')}
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
            onChange={(e: any) => this.onGeneralValChange(e, 'splitedField')
            }
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        < DatePicker start={this.props.stateParams.dateRangeStart} end={this.props.stateParams.dateRangeEnd} setStart={this.setDateRangeStart} setEnd={this.setDateRangeEnd} />

        <EuiSpacer size="m" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth />
        </EuiFormRow>

        <EuiCollapsibleNavGroup
          data-test-subj="ADVANCED"
          background="light"
          title="Advanced"
          arrowDisplay="left"
          isCollapsible={true}
          initialIsOpen={false}>
          <EuiText style={{ display: "inline" }} onChange={(e) => this.onGeneralValChange(e, 'jsonInput')} >
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
              onChange={(e) => this.onGeneralValChange(e, 'advancedValue')}
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
                  <AxisBucket
                    onGeneralValChange={(e: any, valName: (keyof CounterParams)) => this.onGeneralValChange(e, valName)}
                    onGeneralBoolValChange={(valName: (keyof CounterParams)) => this.onGeneralBoolValChange(valName)}
                    field={this.props.stateParams.field}
                    isEmptyBucket={this.props.stateParams.isEmptyBucket}
                    isExtendBounds={this.props.stateParams.isExtendBounds}
                    advancedValue={this.props.stateParams.advancedValue}
                    aggregationArr={this.state.numberFieldArr}
                  ></AxisBucket>
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
                        onChange={(e) => this.onGeneralValChange(e, 'splitedAggregation')}
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

            <MetrixAndAxes
              onGeneralValChange={(e: any, valName: (keyof CounterParams)) => this.onGeneralValChange(e, valName)}
              onGeneralBoolValChange={(valName: (keyof CounterParams)) => this.onGeneralBoolValChange(valName)}
              isAxisExtents={this.props.stateParams.isAxisExtents}
              xMin={this.props.stateParams.xMin}
              xMax={this.props.stateParams.xMax}
            ></MetrixAndAxes>

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
                          onChange={(e) => this.onGeneralBoolValChange('isVerticalGrid')}
                          compressed
                        />

                        <EuiSpacer size="m" />

                        <EuiCheckbox
                          id={htmlIdGenerator()()}
                          label="Y-Axis Lines"
                          checked={this.props.stateParams.isHorizontalGrid}
                          onChange={(e) => this.onGeneralBoolValChange('isHorizontalGrid')}
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
