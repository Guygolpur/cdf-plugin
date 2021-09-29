
import React, { Fragment, useState } from 'react';
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
  EuiText,
  EuiScreenReaderOnly,
  EuiButton
} from '@elastic/eui';
import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';
import { htmlIdGenerator } from '@elastic/eui';
import { AxisBucket } from '../components/xAxisBucket';
import { AddSubBucket } from '../components/addSubBucket';
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

    this.getIndices().then(indices => {
      const indicesList = indices.data.saved_objects.map((element: any) => { return { value: element.attributes.title, label: element.attributes.title } })
      this.state.indicesList.push(indicesList)
      this.props.setValue('indexPattern', indicesList[0].text);
    }).then(res => {
      this.indicesMappingHandler()
    })

    // let initialArr = { 'agg': 'terms', 'field': [], 'isValid': false }
    // this.props.stateParams['subBucketArray'].push(initialArr)
    let subBucketArrayTmp = JSON.parse(this.props.stateParams['subBucketArray']);

    let subBucketObjToArr = JSON.stringify(Object.entries(subBucketArrayTmp));

    this.props.setValue('subBucketArray', subBucketObjToArr)
    console.log('subBucketArray: ', this.props.stateParams['subBucketArray'])

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

  selectedHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('field', selectedField[0].value);
      this.setState({
        selectedHistogramField: selectedField,
        isXAxisFieldSelected: true
      })
    }
    else {
      this.props.setValue('field', selectedField);
      this.setState({
        selectedHistogramField: selectedField,
        isXAxisFieldSelected: false
      })
    }
  }

  selectedSplitLinesDateHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.props.setValue('isSplitAccordionSearch', true);
      this.setState({
        selectedSplitLinesDateHistogramField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.props.setValue('isSplitAccordionSearch', false);
      this.setState({
        selectedSplitLinesDateHistogramField: selectedField
      })
    }
  }

  selectedSplitLinesDateRangeFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.props.setValue('isSplitAccordionSearch', true);
      this.setState({
        selectedSplitLinesDateRangeField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.props.setValue('isSplitAccordionSearch', false);
      this.setState({
        selectedSplitLinesDateRangeField: selectedField
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

  selectSplitLinesAggregation = async (e: any, counter: number) => {
    let subBucketArrayTojson = JSON.parse(this.props.stateParams['subBucketArray']);
    console.log('subBucketArrayTojson: ', subBucketArrayTojson)
    if (subBucketArrayTojson[counter] == undefined) {
      console.log('1')
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
      subBucketArrayTojson.push(splitLinesAggArr);
    }
    else {
      console.log('2')
      //handle default- plus terms only properties
      subBucketArrayTojson[counter].agg = e.target.value;
      console.log('subBucketArrayTojson.agg: ', subBucketArrayTojson.agg)
      subBucketArrayTojson[counter].field = [];
      subBucketArrayTojson[counter].isValid = false

      //handle date_range
      if (e.target.value != 'date_range' && subBucketArrayTojson[counter].hasOwnProperty('date_range')) {
        delete subBucketArrayTojson[counter].date_range;
        console.log('3')
      }
      if (e.target.value == 'date_range') {
        console.log('4')
        let date_range = { 'start': 'now-30m', 'end': 'now' }
        subBucketArrayTojson[counter].date_range = date_range
      }

      //handle min_interval on date_histogram && histogram- plus remove min_interval
      if (e.target.value == 'date_histogram' || e.target.value == 'histogram') {
        console.log('5')
        let min_interval;
        e.target.value == 'date_histogram' ? min_interval = '1m' : min_interval = '1'
        subBucketArrayTojson[counter].min_interval = min_interval
      }
      else if ('min_interval' in subBucketArrayTojson[counter]) {
        console.log('6')
        delete subBucketArrayTojson[counter].min_interval;
      }
    }
    console.log('subBucketArrayTojson[counter]: ', subBucketArrayTojson[counter])

    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)

    console.log('subBucketArrayTojson stringify: ', subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)
    console.log("selectSplitLinesAggregation[subBucketArray]: ", this.props.stateParams['subBucketArray'])
  }

  selectedSplitLinesTermsFieldHandler = (selectedField: any, counter: number, selectedAggregationOptions: string) => {
    let subBucketArrayTojson = JSON.parse(this.props.stateParams['subBucketArray']);

    if (subBucketArrayTojson[counter] == undefined) {
      let splitLinesFieldArr;
      splitLinesFieldArr = { 'agg': selectedAggregationOptions, 'field': selectedField };
      subBucketArrayTojson.push(splitLinesFieldArr);

      //cant push to object, need to use Object assign to 'push' to OBJ: ( but when doing it, the component re render)
      // const finalResult = Object.assign(subBucketArrayTojson, splitLinesFieldArr);
      // let subBucketArrayToString = JSON.stringify(finalResult)
      // this.props.setValue('subBucketArray', subBucketArrayToString)
    }
    else {
      subBucketArrayTojson[counter].field = selectedField;
    }
    if (selectedAggregationOptions == 'terms') {
      subBucketArrayTojson[counter].isValid = true;
    }

    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      subBucketArrayTojson[counter].isValid = true;
    }
    else {
      subBucketArrayTojson[counter].isValid = false
    }
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    this.props.setValue('subBucketArray', subBucketArrayToString)

    console.log("selectedSplitLinesTermsFieldHandler['subBucketArray']: ", this.props.stateParams['subBucketArray'])

  }

  selectSplitLinesMinimumInterval = (selectedField: any, counter: number) => {
    this.props.stateParams['subBucketArray'][counter].min_interval = selectedField.target.value;
  }

  selectedDateRangeHandler = ({ start, end }: any, counter: any) => {
    this.props.stateParams['subBucketArray'][counter].date_range['start'] = start;
    this.props.stateParams['subBucketArray'][counter].date_range['end'] = end;
  }

  selectedSplitLinesHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      this.props.setValue('splitedField', selectedField[0].value);
      this.props.setValue('isSplitAccordionSearch', true);
      this.setState({
        selectedSplitLinesHistogramField: selectedField
      })
    }
    else {
      this.props.setValue('splitedField', selectedField);
      this.props.setValue('isSplitAccordionSearch', false);
      this.setState({
        selectedSplitLinesHistogramField: selectedField
      })
    }
  }

  render() {
    const Rows = () => {
      const [globalCounter, setGlobalCounter] = useState(1);
      const rows = [];
      for (let i = 1; i <= globalCounter; i++) {
        rows.push(
          <AddSubBucket
            counter={i}
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
            selectedSplitLinesHistogramFieldHandler={this.selectedSplitLinesHistogramFieldHandler}
            selectedSplitLinesDateHistogramFieldHandler={this.selectedSplitLinesDateHistogramFieldHandler}
            selectedSplitLinesDateRangeFieldHandler={this.selectedSplitLinesDateRangeFieldHandler}
            setDateRangeStart={this.setDateRangeStart}
            setDateRangeEnd={this.setDateRangeEnd}

            onGeneralValChange={(e: any, valName: (keyof CounterParams)) => this.onGeneralValChange(e, valName)}
          />
        );
      }
      const growingAccordianDescriptionId = htmlIdGenerator()();
      const listId = htmlIdGenerator()();
      return (
        <EuiText size="s">
          <EuiScreenReaderOnly>
            <p id={growingAccordianDescriptionId}>
              Currently height is set to {globalCounter} items
            </p>
          </EuiScreenReaderOnly>
          <EuiSpacer size="s" />
          <ul id={listId}>{rows}</ul>
          <p>
            <EuiButton
              size="s"
              iconType="plusInCircleFilled"
              onClick={() => setGlobalCounter(globalCounter + 1)}
              aria-controls={listId}
              aria-describedby={growingAccordianDescriptionId}
              fullWidth
            >
              Add Split lines
            </EuiButton>{' '}
            <EuiSpacer size="s" />
            <EuiButton
              size="s"
              iconType="minusInCircleFilled"
              aria-controls={listId}
              aria-describedby={growingAccordianDescriptionId}
              onClick={() => setGlobalCounter(Math.max(0, globalCounter - 1))}
              isDisabled={globalCounter === 1}
              fullWidth
            >
              Remove last Split lines Bucket
            </EuiButton>
          </p>
        </EuiText>
      );
    };

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

                <EuiAccordion id="accordion1" buttonContent={`X-Axis`}>
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
                <EuiAccordion id="accordionSplit" buttonContent={`Split lines`}>
                  <EuiPanel style={{ maxWidth: '100%' }}>
                    <Rows />
                  </EuiPanel>
                </EuiAccordion>

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
