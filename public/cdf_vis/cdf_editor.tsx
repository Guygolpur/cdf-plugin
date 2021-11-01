
import React, { Fragment } from 'react';
import axios from 'axios';
import {
  EuiCheckbox,
  EuiFormRow,
  EuiTabbedContent,
  EuiSpacer,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiComboBox,
  EuiPanel,
} from '@elastic/eui';
import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';
import { htmlIdGenerator } from '@elastic/eui';
import { AxisBucket } from '../components/xAxisBucket';
import { SubBucketRow } from '../components/subBucketRow';
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
  isSplitAccordionSearch: boolean;
  isVerticalGrid: boolean;
  isHorizontalGrid: boolean;
  dateFilterFrom: string;
  dateFilterTo: string;
  dateRangeStart: string;
  dateRangeEnd: string;
  splitedHistogramMinInterval: number;
  splitedDateHistogramMinInterval: string;
  subBucketArray: string;
}

interface CDFEditorComponentState {
  indicesList: any[];
  selectedIndexPattern: any[];
  isIndexSelected: boolean;
  isXAxisFieldSelected: boolean;
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
      isXAxisFieldSelected: false,
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
    this.props.setValue('field', '');
    this.props.setValue('isSplitAccordionSearch', false)
    this.props.setValue('splitedAggregation', 'terms')
    this.props.setValue('splitedOrder', 'desc')
    this.props.setValue('subBucketArray', '{}')
    this.props.setValidity(false)

    this.getIndices().then(indices => {
      const indicesList = indices.data.saved_objects.map((element: any) => { return { value: element.attributes.title, label: element.attributes.title } })
      this.state.indicesList.push(indicesList)
      this.props.setValue('indexPattern', indicesList[0].text);
    }).then(res => {
      this.indicesMappingHandler()
    })

    if (window.performance) {
      if (performance.navigation.type == 1) {
        this.props.setValue('subBucketArray', '{}')
      }
    }
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
      this.props.setValidity(true)
      this.setState({
        selectedIndexPattern: selectedOptions,
        isIndexSelected: true
      })
    }
    else {
      this.props.setValidity(false)
      this.setState({
        selectedIndexPattern: selectedOptions,
        isIndexSelected: false
      })
    }

    this.onMappingValChange(selectedOptions[0].value, 'indexPattern').then(this.indicesMappingHandler).catch(e => console.log('error: ', e))
  }

  selectedHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('field', selectedField[0].value);
      this.setState({
        selectedHistogramField: selectedField,
        isXAxisFieldSelected: true
      })
      this.props.setValidity(true)
    }
    else {
      this.props.setValidity(false)
      this.props.setValue('field', selectedField);
      this.setState({
        selectedHistogramField: selectedField,
        isXAxisFieldSelected: false
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

  // isVerticalGrid, isHorizontalGrid, isAxisExtents, isEmptyBucket, 
  // isSplitedSeperateBucket, isSplitedShowMissingValues, isSplitAccordionSearch
  onGeneralBoolValChange = (valName: (keyof CounterParams)) => {
    this.props.setValue(valName, !this.props.stateParams[valName]);
  }

  onSplitedSeperateBucketChange = () => {
    this.props.setValue('isSplitedSeperateBucket', !this.props.stateParams.isSplitedSeperateBucket);
  };

  onSplitedShowMissingValuesChange = () => {
    this.props.setValue('isSplitedShowMissingValues', !this.props.stateParams.isSplitedShowMissingValues);
  };

  /*Splited Lines*/

  setDateRangeStart = (start: any) => {
    this.props.setValue('dateRangeStart', start);
  }

  setDateRangeEnd = (end: any) => {
    this.props.setValue('dateRangeEnd', end);
  }

  cleanSubBucketArrayBuffer = async (index: any) => {
    let subBucketArrayTojson = await JSON.parse(this.props.stateParams['subBucketArray'])
    delete subBucketArrayTojson[(index - 1)]
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
    this.props.setValidity(true)
  }

  ignoreSubBucketArrayBuffer = async (index: any, isIgnore: any) => {
    let subBucketArrayTojson = await JSON.parse(this.props.stateParams['subBucketArray'])
    subBucketArrayTojson[index - 1]['isValid'] = isIgnore;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
  }

  selectSplitLinesAggregation = async (e: any, counter: number) => {
    // debugger
    let subBucketArrayTojson = JSON.parse(this.props.stateParams['subBucketArray']);
    if (subBucketArrayTojson[counter - 1] == undefined) {
      let splitLinesAggArr;
      switch (e.target.value) {
        case 'terms':
          splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false };
          break;
        case 'date_histogram':
          splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, 'min_interval': '1m' };
          break;
        case 'histogram':
          splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, 'min_interval': 1 };
          break;
        case 'date_range':
          splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, date_range: { 'start': 'now-30m', 'end': 'now' } };
          break;
        default:
          splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false };
      }
      subBucketArrayTojson[counter - 1] = splitLinesAggArr;
    }
    else {
      //handle default- plus terms only properties
      subBucketArrayTojson[counter - 1].agg = e.target.value;
      subBucketArrayTojson[counter - 1].field = [];
      subBucketArrayTojson[counter - 1].isValid = false

      //handle date_range
      if (e.target.value != 'date_range' && subBucketArrayTojson[counter - 1].hasOwnProperty('date_range')) {
        delete subBucketArrayTojson[counter - 1].date_range;
      }
      if (e.target.value == 'date_range') {
        let date_range = { 'start': 'now-30m', 'end': 'now' }
        subBucketArrayTojson[counter - 1].date_range = date_range
      }

      //handle min_interval on date_histogram && histogram- plus remove min_interval
      if (e.target.value == 'date_histogram' || e.target.value == 'histogram') {
        let min_interval;
        e.target.value == 'date_histogram' ? min_interval = '1m' : min_interval = '1'
        subBucketArrayTojson[counter - 1].min_interval = min_interval
      }
      else if ('min_interval' in subBucketArrayTojson[counter - 1]) {
        delete subBucketArrayTojson[counter - 1].min_interval;
      }
    }

    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
  }

  selectedSplitLinesTermsFieldHandler = (selectedField: any, counter: number, selectedAggregationOptions: string) => {
    let subBucketArrayTojson = JSON.parse(this.props.stateParams['subBucketArray']);

    if (subBucketArrayTojson[counter - 1] == undefined) {
      let splitLinesFieldArr;
      splitLinesFieldArr = { 'agg': selectedAggregationOptions, 'field': selectedField, isValid: false };
      subBucketArrayTojson[counter - 1] = splitLinesFieldArr;
    }
    else {
      subBucketArrayTojson[counter - 1].field = selectedField;
    }
    if (selectedAggregationOptions == 'terms') {
      subBucketArrayTojson[counter - 1].isValid = true;
    }

    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      subBucketArrayTojson[counter - 1].isValid = true;
    }
    else {
      subBucketArrayTojson[counter - 1].isValid = false
    }
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
  }

  selectSplitLinesMinimumInterval = (selectedField: any, counter: number) => {
    let subBucketArrayTojson = JSON.parse(this.props.stateParams['subBucketArray']);
    subBucketArrayTojson[counter - 1].min_interval = selectedField.target.value;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
  }

  selectedDateRangeHandler = ({ start, end }: any, counter: any) => {
    let subBucketArrayTojson = JSON.parse(this.props.stateParams['subBucketArray']);
    subBucketArrayTojson[counter - 1].date_range['start'] = start;
    subBucketArrayTojson[counter - 1].date_range['end'] = end;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
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
                {/* X-Axis */}

                <EuiPanel id="panel" color="subdued">
                  <EuiAccordion id="accordion1" buttonContent={`X-Axis`}>
                    <AxisBucket
                      onGeneralValChange={(e: any, valName: (keyof CounterParams)) => this.onGeneralValChange(e, valName)}
                      onGeneralBoolValChange={(valName: (keyof CounterParams)) => this.onGeneralBoolValChange(valName)}
                      selectedHistogramFieldHandler={this.selectedHistogramFieldHandler}
                      selectedHistogramField={this.state.selectedHistogramField}
                      field={this.props.stateParams.field}
                      isEmptyBucket={this.props.stateParams.isEmptyBucket}
                      advancedValue={this.props.stateParams.advancedValue}
                      aggregationArr={this.state.numberFieldArr}
                      isIndexSelected={this.state.isIndexSelected}
                    ></AxisBucket>
                  </EuiAccordion>
                </EuiPanel>

                <EuiSpacer size="m" />

                {/* Splited */}

                <SubBucketRow
                  stateParams={this.props.stateParams}
                  splitedAggregationArr={this.state.splitedAggregationArr}
                  selectedSplitLinesTermsField={this.state.selectedSplitLinesTermsField}
                  isIndexSelected={this.state.isIndexSelected}
                  isXAxisFieldSelected={this.state.isXAxisFieldSelected}
                  numberFieldArr={this.state.numberFieldArr}
                  dateFieldArr={this.state.dateFieldArr}
                  selectedSplitLinesHistogramField={this.state.selectedSplitLinesHistogramField}
                  selectedSplitLinesDateHistogramField={this.state.selectedSplitLinesDateHistogramField}
                  selectedSplitLinesDateRangeField={this.state.selectedSplitLinesDateRangeField}

                  selectSplitLinesAggregation={this.selectSplitLinesAggregation}
                  selectedSplitLinesTermsFieldHandler={this.selectedSplitLinesTermsFieldHandler}
                  selectSplitLinesMinimumInterval={this.selectSplitLinesMinimumInterval}
                  selectedDateRangeHandler={this.selectedDateRangeHandler}

                  onSplitedSeperateBucketChange={this.onSplitedSeperateBucketChange}
                  onSplitedShowMissingValuesChange={this.onSplitedShowMissingValuesChange}
                  setDateRangeStart={this.setDateRangeStart}
                  setDateRangeEnd={this.setDateRangeEnd}

                  onGeneralValChange={(e: any, valName: (keyof CounterParams)) => this.onGeneralValChange(e, valName)}
                  cleanSubBucketArrayBuffer={this.cleanSubBucketArrayBuffer}
                  ignoreSubBucketArrayBuffer={this.ignoreSubBucketArrayBuffer}
                />

                <EuiSpacer size="m" />

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
            isInvalid={this.state.selectedIndexPattern.length === 0}
          />
        </EuiFormRow>
        <EuiTabbedContent
          tabs={tabs}
          initialSelectedTab={tabs[0]}
          autoFocus="selected"
        />
      </Fragment>
    );
  }
}
