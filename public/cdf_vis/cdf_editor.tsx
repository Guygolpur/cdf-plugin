
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
  EuiComboBox,
} from '@elastic/eui';
import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';
import { htmlIdGenerator } from '@elastic/eui/lib/services';
import { DatePicker } from '../components/form/datePicker';
import { AxisBucket } from '../components/xAxisBucket';
import { MetrixAndAxes } from '../components/metrixAndAxes';

interface CounterParams {
  // High level
  indexPattern: string;

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
  splitedOrder: string;
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
  indicesList: any[];
  selectedIndexPattern: any[];
  isIndexSelected: boolean;
  isXAxisOpened: boolean;
  selectedHistogramField: any[];
  selectedSplitLinesTermsField: any[];
  selectedSplitLinesDateHistogramField: any[];
  selectedSplitLinesDateRangeField: any[];
  selectedSplitLinesHistogramField: any[];
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
      indicesList: [],
      selectedIndexPattern: [],
      isIndexSelected: false,
      isXAxisOpened: false,
      selectedHistogramField: [],
      selectedSplitLinesTermsField: [],
      selectedSplitLinesDateHistogramField: [],
      selectedSplitLinesDateRangeField: [],
      selectedSplitLinesHistogramField: [],
      comboBoxSelectionOptions: [],
      numberFieldArr: [],
      dateFieldArr: [],
      booleanDateNumberStringFieldArr: [],
      splitedAggregationArr: [],
      value: 100,
      isAddPopoverOpen: false,
    };
  }

  visit = (obj: any, fn: any) => {
    const values = Object.values(obj)

    values.forEach(val =>
      val && typeof val === "object" ? this.visit(val, fn) : fn(val))
  }

  componentDidMount() {
    this.props.setValue('dateFilterFrom', this.props.timeRange.from);
    this.props.setValue('dateFilterTo', this.props.timeRange.to);

    this.props.setValue('isSplitAccordionClicked', false)
    this.getIndices().then(indices => {
      const indicesList = indices.data.saved_objects.map((element: any) => { return { value: element.attributes.title, label: element.attributes.title } })
      this.state.indicesList.push(indicesList)
      this.props.setValue('indexPattern', indicesList[0].text);
    }).then(res => {
      this.indicesMappingHandler()
    })
  }

  componentDidUpdate(prevProps: any) {
    if (prevProps.timeRange.from !== this.props.timeRange.from) {
      this.props.setValue('dateFilterFrom', this.props.timeRange.from);
    }
    if (prevProps.timeRange.to !== this.props.timeRange.to) {
      this.props.setValue('dateFilterTo', this.props.timeRange.to);
    }
  }

  getIndices = () => {
    return axios({
      url: '/_find',
      method: 'GET',
      headers: { "kbn-xsrf": "true" }
    })
  }

  getIndicesMapping = () => {
    return axios({
      url: `/api/mappings/${this.props.stateParams.indexPattern}`,
      method: 'GET',
      headers: { "kbn-xsrf": "true" }
    })
  }

  indicesMappingHandler = () => {
    this.getIndicesMapping()
      .then(response => {
        const indexRes = Object.keys(response.data)[0]
        const mappingRes = response.data[indexRes].mappings
        let objNodeSub: any, numberFieldOptionTmp: any[] = [], dateFieldOptionTmp: any[] = [], booleanDateNumberStringFieldOptionTmp: any[] = [], allFieldsOptionTmp: any[] = []

        for (const key in mappingRes) {
          let value = mappingRes[key];
          if (value != undefined && value.mapping[key]) {
            objNodeSub = { 'value': key, 'label': key };
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

        // sort array of objects
        numberFieldOptionTmp.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
        dateFieldOptionTmp.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
        booleanDateNumberStringFieldOptionTmp.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))
        allFieldsOptionTmp.sort((a, b) => (a.value > b.value) ? 1 : ((b.value > a.value) ? -1 : 0))

        this.setState({
          numberFieldArr: numberFieldOptionTmp,
          dateFieldArr: dateFieldOptionTmp,
          booleanDateNumberStringFieldArr: booleanDateNumberStringFieldOptionTmp,
          splitedAggregationArr: allFieldsOptionTmp
        })
      })
      .catch(error => { console.log('err: ', error) })
  }

  selectedIndexHandler = (selectedOptions: any) => {
    if (selectedOptions.length > 0) {
      this.setState({
        selectedIndexPattern: selectedOptions,
        isIndexSelected: true
      })
    }
    else {
      this.setState({
        selectedIndexPattern: selectedOptions,
        isIndexSelected: false
      })
    }

    this.onMappingValChange(selectedOptions[0].value, 'indexPattern').then(this.indicesMappingHandler).catch(e => console.log('error: ', e))
  }

  selectedSplitLinesTermsFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.setState({
        selectedSplitLinesTermsField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.setState({
        selectedSplitLinesTermsField: selectedField
      })
    }
  }

  selectedHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('field', selectedField[0].value);
      this.setState({
        selectedHistogramField: selectedField
      })
    }
    else {
      this.props.setValue('field', selectedField);
      this.setState({
        selectedHistogramField: selectedField
      })
    }
  }

  selectedSplitLinesDateHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.setState({
        selectedSplitLinesDateHistogramField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.setState({
        selectedSplitLinesDateHistogramField: selectedField
      })
    }
  }

  selectedSplitLinesDateRangeFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.setState({
        selectedSplitLinesDateRangeField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.setState({
        selectedSplitLinesDateRangeField: selectedField
      })
    }
  }

  selectedSplitLinesHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.setState({
        selectedSplitLinesHistogramField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.setState({
        selectedSplitLinesHistogramField: selectedField
      })
    }
  }

  // field, min_interval, aggregation, xMin, xMax, customLabel, advancedValue, jsonInput,
  // splitedAggregation, splitedField, splitedOrder, splitedCustomLabel
  // splitedHistogramMinInterval, splitedDateHistogramMinInterval
  onGeneralValChange = (e: any, valName: (keyof CounterParams)) => {
    this.props.setValue(valName, e.target.value);
  }

  onMappingValChange = async (e: any, valName: (keyof CounterParams)) => {
    this.props.setValue(valName, e)
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
          <EuiComboBox
            singleSelection={{ asPlainText: true }}
            placeholder="Search"
            options={this.state.splitedAggregationArr}
            selectedOptions={this.state.selectedSplitLinesTermsField}
            onChange={this.selectedSplitLinesTermsFieldHandler}
            isClearable={true}
            data-test-subj="splitLinesTermsField"
            fullWidth
            isDisabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
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
                disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
              />
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
            disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Show missing values"
            name="switch"
            checked={this.props.stateParams.isSplitedShowMissingValues}
            onChange={this.onSplitedShowMissingValuesChange}
            disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)} />
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
              disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
            />
          </EuiText>
        </EuiCollapsibleNavGroup>
      </>
    }
    else if (this.props.stateParams.splitedAggregation == 'histogram') {
      splitedSubAggregationContent = <>
        <EuiFormRow label="Field" fullWidth>
          <EuiComboBox
            singleSelection={{ asPlainText: true }}
            placeholder="Search"
            options={this.state.numberFieldArr}
            selectedOptions={this.state.selectedSplitLinesHistogramField}
            onChange={this.selectedSplitLinesHistogramFieldHandler}
            isClearable={true}
            data-test-subj="selectedSplitLinesHistogramField"
            fullWidth
            isDisabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
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
          <EuiFieldNumber placeholder={'1'} min={1} onChange={(e) => this.onGeneralValChange(e, 'splitedHistogramMinInterval')} disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)} />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Show empty bucket"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
            disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Extend bounds"
            name="switch"
            checked={this.props.stateParams.isSplitedShowMissingValues}
            onChange={this.onSplitedShowMissingValuesChange}
            disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)} />
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
              disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
            />
          </EuiText>
        </EuiCollapsibleNavGroup>
      </>
    }
    else if (this.props.stateParams.splitedAggregation == 'date_histogram') {
      splitedSubAggregationContent = <>
        <EuiFormRow label="Field" fullWidth>
          <EuiComboBox
            singleSelection={{ asPlainText: true }}
            placeholder="Search"
            options={this.state.dateFieldArr}
            selectedOptions={this.state.selectedSplitLinesDateHistogramField}
            onChange={this.selectedSplitLinesDateHistogramFieldHandler}
            isClearable={true}
            data-test-subj="splitLinesDateHistogramField"
            fullWidth
            isDisabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
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
            onChange={(e: any) => this.onGeneralValChange(e, 'splitedDateHistogramMinInterval')}
            disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        <EuiFormRow fullWidth hasChildLabel={false}>
          <EuiSwitch
            label="Drop partial buckets"
            name="switch"
            checked={this.props.stateParams.isSplitedSeperateBucket}
            onChange={this.onSplitedSeperateBucketChange}
            disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="s" />

        <EuiSpacer size="s" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)} />
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
              disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
            />
          </EuiText>
        </EuiCollapsibleNavGroup>
      </>
    }
    else if (this.props.stateParams.splitedAggregation == 'date_range') {
      splitedSubAggregationContent = <>
        <EuiFormRow label="Field" fullWidth>
          <EuiComboBox
            singleSelection={{ asPlainText: true }}
            placeholder="Search"
            options={this.state.dateFieldArr}
            selectedOptions={this.state.selectedSplitLinesDateRangeField}
            onChange={this.selectedSplitLinesDateRangeFieldHandler}
            isClearable={true}
            data-test-subj="splitLinesDateRangeField"
            fullWidth
            isDisabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
          />
        </EuiFormRow>

        <EuiSpacer size="m" />

        < DatePicker disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)} start={this.props.stateParams.dateRangeStart} end={this.props.stateParams.dateRangeEnd} setStart={this.setDateRangeStart} setEnd={this.setDateRangeEnd} />

        <EuiSpacer size="m" />

        <EuiFormRow label="Custom label" fullWidth onChange={(e: any) => this.onGeneralValChange(e, 'splitedCustomLabel')}>
          <EuiFieldText name="first" fullWidth disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)} />
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
              disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
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
                <EuiAccordion id="accordion1" buttonContent={`X-Axis`} onToggle={(isOpen => this.setState({ isXAxisOpened: isOpen }))}>
                  <AxisBucket
                    onGeneralValChange={(e: any, valName: (keyof CounterParams)) => this.onGeneralValChange(e, valName)}
                    onGeneralBoolValChange={(valName: (keyof CounterParams)) => this.onGeneralBoolValChange(valName)}
                    selectedHistogramFieldHandler={this.selectedHistogramFieldHandler}
                    selectedHistogramField={this.state.selectedHistogramField}
                    field={this.props.stateParams.field}
                    isEmptyBucket={this.props.stateParams.isEmptyBucket}
                    isExtendBounds={this.props.stateParams.isExtendBounds}
                    advancedValue={this.props.stateParams.advancedValue}
                    aggregationArr={this.state.numberFieldArr}
                    isIndexSelected={this.state.isIndexSelected}
                  ></AxisBucket>
                </EuiAccordion>

                <EuiSpacer size="m" />

                {/* Splited */}

                <EuiAccordion id="accordionSplit" buttonContent={`Split lines`} onToggle={this.splitAccordionClicked}>
                  <EuiPanel style={{ maxWidth: '100%' }}>

                    <EuiFormRow label="Sub aggregation" fullWidth>
                      <EuiSelect
                        options={[
                          { value: 'terms', text: 'Terms' },
                          { value: 'date_histogram', text: 'Date Histogram' },
                          { value: 'date_range', text: 'Date Range' },
                          { value: 'histogram', text: 'Histogram' },
                        ]}
                        onChange={(e) => this.onGeneralValChange(e, 'splitedAggregation')}
                        fullWidth
                        disabled={!(this.state.isIndexSelected && this.state.isXAxisOpened)}
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
        <EuiSpacer size="xl" />
        <EuiFormRow label="Index-pattern" fullWidth>
          <EuiComboBox
            singleSelection={{ asPlainText: true }}
            placeholder="Search"
            options={this.state.indicesList[0]}
            selectedOptions={this.state.selectedIndexPattern}
            onChange={this.selectedIndexHandler}
            isClearable={false}
            data-test-subj="indexPattern"
            fullWidth
          />
        </EuiFormRow>
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
