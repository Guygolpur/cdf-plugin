
import React, { Fragment, useState } from 'react';
import axios from 'axios';
import {
  EuiCheckbox,
  EuiTabbedContent,
  EuiSpacer,
  EuiCard,
  EuiFlexGroup,
  EuiFlexItem,
  EuiAccordion,
  EuiPanel,
} from '@elastic/eui';
import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';
import { htmlIdGenerator } from '@elastic/eui';
import { AxisBucket } from '../components/xAxisBucket';
import { SubBucketRow } from '../components/subBucketRow';
import { MetrixAndAxes } from '../components/metrixAndAxes';
import { useEffect } from 'react';

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
  subBucketArray: string | null;

  splitedGlobalCounter: number;
  splitedGlobalIds: string;

  // Filters
  filters: string | null;
  negativeFilters: string | null;
  rangeFilters: string | null;
  searchShould: string | null;
}

export function CDFEditor({
  setValidity,
  setValue,
  stateParams,
  uiState,
  vis,
  timeRange
}: VisEditorOptionsProps<CounterParams>) {

  const [isXAxisFieldSelected, setIsXAxisFieldSelected] = useState(vis.params.field ? true : false);
  const [selectedHistogramField, setSelectedHistogramField] = useState(vis.params.field ? [{ value: vis.params.field, label: vis.params.field }] : []);
  const [selectedSplitLinesTermsField, setSelectedSplitLinesTermsField] = useState([]);
  const [selectedSplitLinesDateHistogramField, setSelectedSplitLinesDateHistogramField] = useState([]);
  const [selectedSplitLinesDateRangeField, setSelectedSplitLinesDateRangeField] = useState([]);
  const [selectedSplitLinesHistogramField, setSelectedSplitLinesHistogramField] = useState([]);
  const [numberFieldArr, setNumberFieldArr] = useState<any>([]);
  const [dateFieldArr, setDateFieldArr] = useState<any>([]);
  const [booleanDateNumberStringFieldArr, setBooleanDateNumberStringFieldArr] = useState<any>([]);
  const [splitedAggregationArr, setSplitedAggregationArr] = useState<any>([]);
  // const [value, setValues] = useState(100);

  const visit = (obj: any, fn: any) => {
    const values = Object.values(obj)

    values.forEach(val =>
      val && typeof val === "object" ? visit(val, fn) : fn(val))
  }

  useEffect(() => {
    initiateValues()
  }, [])

  useEffect(() => {
    setValidity(true)
    if (stateParams.indexPattern !== null) { indicesMappingHandler() }
  }, [stateParams.indexPattern])

  useEffect(() => {
    setValue('dateFilterFrom', timeRange.from);
    setValue('dateFilterTo', timeRange.to);
  }, [timeRange.from, timeRange.to])

  useEffect(() => {
    filterListener()
  }, [vis.type.visConfig.data.query.filterManager.filters])

  useEffect(() => {
    console.log('vis.type.visConfig.data.query.queryString.getQuery(): ', vis.type.visConfig.data.query.queryString.getQuery())
    queryListener()
  }, [vis.type.visConfig.data.query.queryString.getQuery()])

  const initiateValues = () => {
    //High-level
    setValue('dateFilterFrom', timeRange.from);
    setValue('dateFilterTo', timeRange.to);
    setValue('indexPattern', vis.data.indexPattern?.title)
    setValidity(false)

    //X-Axis
    if (vis.params.field) {
      setValue('field', vis.params.field);
    }
    else {
      setValue('field', '');
    }

    if (vis.params.min_interval) {
      setValue('min_interval', vis.params.min_interval);
    }
    else {
      setValue('min_interval', 1);
    }

    setValue('isEmptyBucket', vis.params.isEmptyBucket)

    //Splited
    // setValue('isSplitAccordionSearch', false)
    // setValue('splitedAggregation', 'terms')
    // setValue('splitedOrder', 'desc')
    // setValue('subBucketArray', '{}')
  }

  const queryListener = () => {
    let queries = vis.type.visConfig.data.query.queryString.getQuery().query;
    if (queries.length > 0) {
      let splitedQueries = splitQueries(queries)
      let esQuery = manipulateToESQuery(splitedQueries);
      let esQueryToString = JSON.stringify([esQuery])
      setValue('searchShould', esQueryToString)
    }
    else {
      setValue('searchShould', '[]')
    }
  }

  function splitQueries(queries: any) {
    let splitedQueriesByOr: any = []
    let splitedQueriesByand: any = []

    splitedQueriesByOr = queries.split(' or ')

    splitedQueriesByOr.forEach((element: any) => {
      splitedQueriesByand.push(element.split(' and '))
    });

    return splitedQueriesByand;
  }

  function manipulateToESQuery(splitedQueries: any) {
    console.log('splitedQueries: ', splitedQueries)
    let shouldArr: any = {
      bool: {
        should: []
      }
    }

    splitedQueries.forEach((orElement: any) => {
      let isSingle: boolean = true
      let filterOrShould = 'should'

      if (orElement.length > 1) {
        isSingle = false
        filterOrShould = 'filter'
      }

      let orSeperatorObj: any = {
        bool: {
          [filterOrShould]: []
        }
      }

      orElement.forEach((andElement: any) => {
        let singleAnd = {}
        andElement = andElement.replace(/\s/g, '');
        console.log('andElement: ', andElement)
        let splitString = getSplitedKeyVal(andElement)
        console.log('splitString: ', splitString)
        if (splitString !== undefined) {
          if (andElement.includes(':') && !andElement.includes('*')) {
            let match = 'match'
            if (andElement.includes(':"')) {
              match = 'match_phrase'
            }

            if (!isSingle) {
              singleAnd = {
                bool: {
                  should: [
                    {
                      [match]: {
                        [splitString[0]]: splitString[1]
                      }
                    }
                  ],
                  minimum_should_match: 1
                }
              }
            }
            else {
              singleAnd = {
                [match]: {
                  [splitString[0]]: splitString[1]
                }
              }
            }
          }

          else if (andElement.includes(':') && andElement.includes('*')) {
            if (!isSingle) {
              singleAnd = {
                bool: {
                  should: [
                    {
                      exists: {
                        field: splitString[0]
                      }
                    }
                  ],
                  minimum_should_match: 1
                }
              }
            }
            else {
              singleAnd = {
                exists: {
                  field: splitString[0]
                }
              }
            }
          }

          else {
            let rangeOp: any
            if (andElement.includes('<=')) {
              rangeOp = 'lte'
            }
            else if (andElement.includes('>=')) {
              rangeOp = 'gte'
            }
            else if (andElement.includes('<')) {
              rangeOp = 'lt'
            }
            else if (andElement.includes('>')) {
              rangeOp = 'gt'
            }

            if (!isSingle) {
              singleAnd = {
                bool: {
                  should: [{
                    range: {
                      [splitString[0]]: {
                        [rangeOp]: splitString[1]
                      }
                    }
                  }],
                  minimum_should_match: 1
                }
              }
            }
            else {
              singleAnd = {
                range: {
                  [splitString[0]]: {
                    [rangeOp]: splitString[1]
                  }
                }
              }
            }
          }

          orSeperatorObj.bool[filterOrShould].push(singleAnd)
          if (isSingle) {
            orSeperatorObj.bool.minimum_should_match = 1
          }
        }

      });

      shouldArr.bool.should.push(orSeperatorObj)
    });
    shouldArr.bool.minimum_should_match = 1
    if (splitedQueries.length > 1 || splitedQueries[0].length > 1) {
      return shouldArr;
    }
    else {
      return shouldArr.bool.should[0];
    }
  }

  const getSplitedKeyVal = (andElement: any) => {
    let splitString;

    if (andElement.length == 0) { return }
    if (andElement.includes(':')) {
      splitString = andElement.split(':')
    }
    else if (andElement.includes('<=')) {
      splitString = andElement.split('<=')
    }
    else if (andElement.includes('>=')) {
      splitString = andElement.split('>=')
    }
    else if (andElement.includes('<')) {
      splitString = andElement.split('<')
    }
    else if (andElement.includes('>')) {
      splitString = andElement.split('>')
    }
    splitString[0] = splitString[0].trim()
    splitString[1] = splitString[1].trim()
    splitString[1] = splitString[1].replaceAll('"', '')
    return splitString
  }

  const filterListener = () => {
    let filters = vis.type.visConfig.data.query.filterManager.getFilters()
    if (filters.length > 0) {
      let filterTojson: any = [];
      let negativeFilters: any = [];
      let rangeFilters: any = [{ 'match_all': {} }];
      Object.values(filters).forEach((key: any, val: any) => {
        if (!key.meta.disabled) {
          if (key.hasOwnProperty('exists')) {
            let existsObj = {
              exists: key.exists
            }
            if (key.meta.negate === false) {
              {
                filterTojson.push(existsObj);
              }
            }
            else {
              negativeFilters.push(existsObj)
            }
          }
          else if (key.hasOwnProperty('query')) {
            if (key.query.hasOwnProperty('match_phrase') || key.query.hasOwnProperty('bool')) {
              let queryObj
              if (key.query.hasOwnProperty('bool')) {
                queryObj = {
                  bool: key.query.bool
                }
              }
              else { queryObj = key.query }
              if (key.meta.negate === false) { filterTojson.push(queryObj); }
              else {
                if (key.query.hasOwnProperty('bool')) {
                  queryObj = {
                    bool: key.query.bool
                  }
                }
                else {
                  queryObj = {
                    match_phrase: key.query.match_phrase
                  }
                }
                negativeFilters.push(queryObj)
              }
            }
          }
          else if (key.hasOwnProperty('range')) {
            let rangeObj = {
              range: key.range
            }
            if (key.meta.negate === false) { rangeFilters.push(rangeObj); }
            else {
              negativeFilters.push(rangeObj)
            }
          }
        }
      })

      let rangeFilterToString = JSON.stringify(rangeFilters)
      setValue('rangeFilters', rangeFilterToString)

      let negativeFilterToString = JSON.stringify(negativeFilters)
      setValue('negativeFilters', negativeFilterToString)

      let filterToString = JSON.stringify(filterTojson)
      setValue('filters', filterToString)
    }
    else {
      setValue('rangeFilters', '[]')
      setValue('negativeFilters', '[]')
      setValue('filters', '[{"match_all": {}}]')
    }
  }

  const getIndicesMapping = () => {
    return axios({
      url: `/api/mappings/${stateParams.indexPattern}`,
      method: 'GET',
      headers: { "kbn-xsrf": "true" }
    })
  }

  const indicesMappingHandler = () => {
    getIndicesMapping()
      .then((response: any) => {
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

        setNumberFieldArr(numberFieldOptionTmp)
        setDateFieldArr(dateFieldOptionTmp)
        setBooleanDateNumberStringFieldArr(booleanDateNumberStringFieldOptionTmp)
        setSplitedAggregationArr(allFieldsOptionTmp)
      })
      .catch((error: any) => { console.log('err: ', error) })
  }

  const selectedHistogramFieldHandler = (selectedField: any) => {
    if (selectedField.length > 0 && selectedField[0].hasOwnProperty('value')) {
      setValue('field', selectedField[0].value);
      setSelectedHistogramField(selectedField)
      setIsXAxisFieldSelected(true)
      setValidity(true)
    }
    else {
      setValidity(false)
      setValue('field', selectedField);
      setSelectedHistogramField(selectedField)
      setIsXAxisFieldSelected(false)
    }
  }

  // field, min_interval, aggregation, xMin, xMax, customLabel, jsonInput,
  // splitedAggregation, splitedField, splitedOrder, splitedCustomLabel
  // splitedHistogramMinInterval, splitedDateHistogramMinInterval
  const onGeneralValChange = (e: any, valName: (keyof CounterParams)) => {
    setValue(valName, e.target.value);
  }

  // isVerticalGrid, isHorizontalGrid, isAxisExtents, isEmptyBucket, 
  // isSplitedSeperateBucket, isSplitedShowMissingValues, isSplitAccordionSearch
  const onGeneralBoolValChange = (valName: (keyof CounterParams)) => {
    setValue(valName, !stateParams[valName]);
  }

  const onSplitedSeperateBucketChange = () => {
    setValue('isSplitedSeperateBucket', !stateParams.isSplitedSeperateBucket);
  };

  const onSplitedShowMissingValuesChange = () => {
    setValue('isSplitedShowMissingValues', !stateParams.isSplitedShowMissingValues);
  };

  /*Splited Lines*/

  const setDateRangeStart = (start: any) => {
    setValue('dateRangeStart', start);
  }

  const setDateRangeEnd = (end: any) => {
    setValue('dateRangeEnd', end);
  }

  const cleanSubBucketArrayBuffer = async (index: any) => {
    let subBucketArrayTojson = await JSON.parse(stateParams['subBucketArray'])
    delete subBucketArrayTojson[(index - 1)]
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
    setValidity(true)
  }

  const ignoreSubBucketArrayBuffer = async (index: any, isIgnore: any) => {
    let subBucketArrayTojson = await JSON.parse(stateParams['subBucketArray'])
    subBucketArrayTojson[index - 1]['isValid'] = isIgnore;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
  }

  const selectSplitLinesAggregation = async (e: any, counter: number) => {
    let subBucketArrayTojson = JSON.parse(stateParams['subBucketArray']);

    let splitLinesAggArr;
    switch (e.target.value) {
      case 'terms':
        splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, 'order': 'desc' };
        break;
      case 'date_histogram':
        splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, 'min_interval': '1m' };
        break;
      case 'histogram':
        splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, 'min_interval': 1 };
        break;
      case 'date_range':
        splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false, 'date_range': { 'start': 'now-30m', 'end': 'now' } };
        break;
      default:
        splitLinesAggArr = { 'agg': e.target.value, field: [], 'isValid': false };
    }

    //handle default- plus terms only properties
    subBucketArrayTojson[counter - 1] = splitLinesAggArr

    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
  }

  const selectedSplitLinesTermsFieldHandler = (selectedField: any, counter: number, selectedAggregationOptions: string) => {
    let subBucketArrayTojson = JSON.parse(stateParams['subBucketArray']);

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
    setValue('subBucketArray', subBucketArrayToString)
  }

  const selectSplitLinesMinimumInterval = (selectedField: any, counter: number) => {
    let subBucketArrayTojson = JSON.parse(stateParams['subBucketArray']);
    subBucketArrayTojson[counter - 1].min_interval = selectedField.target.value;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
  }

  const selectSplitLinesTermsOrder = (selectedOrder: any, counter: number) => {
    let subBucketArrayTojson = JSON.parse(stateParams['subBucketArray']);
    subBucketArrayTojson[counter - 1].order = selectedOrder.target.value;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
  }

  const selectedDateRangeHandler = ({ start, end }: any, counter: any) => {
    let subBucketArrayTojson = JSON.parse(stateParams['subBucketArray']);
    subBucketArrayTojson[counter - 1].date_range['start'] = start;
    subBucketArrayTojson[counter - 1].date_range['end'] = end;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
  }

  const sendValidity = (isValid: any) => {
    setValidity(isValid)
  }

  const splitedGlobalCounterHandler = (counter: any) => {
    setValue('splitedGlobalCounter', counter)
  }

  const splitedGlobalIdsHandler = (id: any) => {
    setValue('splitedGlobalIds', id)
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
              {/* X-Axis */}

              <EuiPanel id="panel" color="subdued">
                <EuiAccordion id="accordion1" buttonContent={`X-Axis`}>
                  <AxisBucket
                    onGeneralValChange={(e: any, valName: (keyof CounterParams)) => onGeneralValChange(e, valName)}
                    onGeneralBoolValChange={(valName: (keyof CounterParams)) => onGeneralBoolValChange(valName)}
                    selectedHistogramFieldHandler={selectedHistogramFieldHandler}
                    selectedHistogramField={selectedHistogramField}
                    field={stateParams.field}
                    isEmptyBucket={stateParams.isEmptyBucket}
                    aggregationArr={numberFieldArr}
                    storedMinimumInterval={vis.params.min_interval}
                  ></AxisBucket>
                </EuiAccordion>
              </EuiPanel>

              <EuiSpacer size="m" />

              {/* Splited */}

              <SubBucketRow
                stateParams={stateParams}
                splitedAggregationArr={splitedAggregationArr}
                selectedSplitLinesTermsField={selectedSplitLinesTermsField}
                isXAxisFieldSelected={isXAxisFieldSelected}
                numberFieldArr={numberFieldArr}
                dateFieldArr={dateFieldArr}
                selectedSplitLinesHistogramField={selectedSplitLinesHistogramField}
                selectedSplitLinesDateHistogramField={selectedSplitLinesDateHistogramField}
                selectedSplitLinesDateRangeField={selectedSplitLinesDateRangeField}

                selectSplitLinesAggregation={selectSplitLinesAggregation}
                selectedSplitLinesTermsFieldHandler={selectedSplitLinesTermsFieldHandler}
                selectSplitLinesMinimumInterval={selectSplitLinesMinimumInterval}
                selectSplitLinesTermsOrder={selectSplitLinesTermsOrder}
                selectedDateRangeHandler={selectedDateRangeHandler}
                sendValidity={sendValidity}

                onSplitedSeperateBucketChange={onSplitedSeperateBucketChange}
                onSplitedShowMissingValuesChange={onSplitedShowMissingValuesChange}
                setDateRangeStart={setDateRangeStart}
                setDateRangeEnd={setDateRangeEnd}

                onGeneralValChange={(e: any, valName: (keyof CounterParams)) => onGeneralValChange(e, valName)}
                cleanSubBucketArrayBuffer={cleanSubBucketArrayBuffer}
                ignoreSubBucketArrayBuffer={ignoreSubBucketArrayBuffer}

                splitedGlobalCounter={vis.params.splitedGlobalCounter}
                splitedGlobalCounterHandler={splitedGlobalCounterHandler}

                splitedGlobalIds={vis.params.splitedGlobalIds}
                splitedGlobalIdsHandler={splitedGlobalIdsHandler}

                subBucketArray={vis.params.subBucketArray}
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
            onGeneralValChange={(e: any, valName: (keyof CounterParams)) => onGeneralValChange(e, valName)}
            onGeneralBoolValChange={(valName: (keyof CounterParams)) => onGeneralBoolValChange(valName)}
            isAxisExtents={stateParams.isAxisExtents}
            xMin={stateParams.xMin}
            xMax={stateParams.xMax}
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
                        checked={stateParams.isVerticalGrid}
                        onChange={(e) => onGeneralBoolValChange('isVerticalGrid')}
                        compressed
                      />

                      <EuiSpacer size="m" />

                      <EuiCheckbox
                        id={htmlIdGenerator()()}
                        label="Y-Axis Lines"
                        checked={stateParams.isHorizontalGrid}
                        onChange={(e) => onGeneralBoolValChange('isHorizontalGrid')}
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
      <EuiSpacer size="s" />
      <EuiTabbedContent
        tabs={tabs}
        initialSelectedTab={tabs[0]}
        autoFocus="selected"
      />
    </Fragment>
  );
}
