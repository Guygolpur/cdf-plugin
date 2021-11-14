
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
} from '@elastic/eui';
import { VisEditorOptionsProps } from 'src/plugins/visualizations/public';
import { htmlIdGenerator } from '@elastic/eui';
import { AxisBucket } from '../components/xAxisBucket';
import { SubBucketRow } from '../components/subBucketRow';
import { MetrixAndAxes } from '../components/metrixAndAxes';
import { DataPublicPluginStart } from 'src/plugins/data/public';
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
  // data: DataPublicPluginStart;

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

  const [indicesList, setIndicesList] = useState<any>([]);
  const [selectedIndexPattern, setSelectedIndexPattern] = useState([]);
  const [isIndexSelected, setIsIndexSelected] = useState(false);
  const [isXAxisFieldSelected, setIsXAxisFieldSelected] = useState(false);
  const [selectedHistogramField, setSelectedHistogramField] = useState([]);
  const [selectedSplitLinesTermsField, setSelectedSplitLinesTermsField] = useState([]);
  const [selectedSplitLinesDateHistogramField, setSelectedSplitLinesDateHistogramField] = useState([]);
  const [selectedSplitLinesDateRangeField, setSelectedSplitLinesDateRangeField] = useState([]);
  const [selectedSplitLinesHistogramField, setSelectedSplitLinesHistogramField] = useState([]);
  const [comboBoxSelectionOptions, setComboBoxSelectionOptions] = useState([]);
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
    setValue('dateFilterFrom', timeRange.from);
    setValue('dateFilterTo', timeRange.to);
    setValue('field', '');
    setValue('isSplitAccordionSearch', false)
    setValue('splitedAggregation', 'terms')
    setValue('splitedOrder', 'desc')
    setValue('subBucketArray', '{}')
    setValidity(false)

    getIndices().then(indices => {
      const indicesListLocal = indices.data.saved_objects.map((element: any) => { return { value: element.attributes.title, label: element.attributes.title } })
      setIndicesList((indicesList: any) => [...indicesList, indicesListLocal])
      setValue('indexPattern', indicesListLocal[0].value);
    }).then(res => {
      indicesMappingHandler()
    })
  }, [])

  useEffect(() => {
    setValue('dateFilterFrom', timeRange.from);
    setValue('dateFilterTo', timeRange.to);
  }, [timeRange.from, timeRange.to])

  useEffect(() => {
    filterListener()
  }, [vis.type.visConfig.data.query.filterManager.filters])

  useEffect(() => {
    queryListener()
  }, [vis.type.visConfig.data.query.queryString.getQuery()])

  const queryListener = () => {
    let queries = vis.type.visConfig.data.query.queryString.getQuery().query;
    console.log('queries: ', queries);

    let splitedQueries = splitQueries(queries)
    console.log('splitedQueries: ', splitedQueries)

    let esQuery = manipulateToESQuery(splitedQueries);
    console.log('esQuery: ', esQuery)
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

  function manipulateToESQuery(splitedQueries: any) {   //stopped here: should convert to es query
    let shouldArr: any = {
      bool: {
        should: []
      }
    }

    splitedQueries.forEach((orElement: any) => {
      let orSeperatorObj: any = {
        bool: {
          filter: []
        }
      }
      console.log('orElement: ', orElement)

      orElement.forEach((andElement: any) => {
        let isSingle: boolean = true
        if (orElement.length > 1) {
          isSingle = false
        }
        let singleAnd = {}

        if (andElement.includes(' : ') && !andElement.includes(' * ')) {
          singleAnd = {
            bool: {
              should: [
                {
                  match: {
                    key: andElement
                  }
                }
              ],
              minimum_should_match: 1
            }
          }
        }

        else if (andElement.includes(' * ')) {
          singleAnd = {
            exists: {
              field: andElement
            }
          }
        }

        else {
          let rangeOp: any
          if (andElement.includes(' <= ')) {
            rangeOp = 'lte'
          }
          else if (andElement.includes(' >= ')) {
            rangeOp = 'gte'
          }
          else if (andElement.includes(' < ')) {
            rangeOp = 'lt'
          }
          else if (andElement.includes(' > ')) {
            rangeOp = 'gt'
          }

          if (!isSingle) {
            singleAnd = {
              bool: {
                should: [{
                  range: {
                    [rangeOp]: andElement
                  }
                }],
                minimum_should_match: 1
              }
            }
          }
          else {
            singleAnd = {
              range: {
                [rangeOp]: andElement
              }
            }
          }
        }

        orSeperatorObj.bool.filter.push(singleAnd)
        if (!isSingle) {
          orSeperatorObj.bool.minimum_should_match = 1
        }
        
      });

      shouldArr.bool.should.push(orSeperatorObj)
    });

    return shouldArr;
  }

  const filterListener = () => {
    let filters = vis.type.visConfig.data.query.filterManager.getFilters()
    console.log('filters: ', filters)
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

  const getIndices = () => {
    return axios({
      url: '/_find',
      method: 'GET',
      headers: { "kbn-xsrf": "true" }
    })
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

  const selectedIndexHandler = (selectedOptions: any) => {
    if (selectedOptions.length > 0) {
      setValidity(true)
      setSelectedIndexPattern(selectedOptions)
      setIsIndexSelected(true)
    }
    else {
      setValidity(false)
      setSelectedIndexPattern(selectedOptions)
      setIsIndexSelected(false)
    }

    onMappingValChange(selectedOptions[0].value, 'indexPattern').then(indicesMappingHandler).catch(e => console.log('error: ', e))
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

  const onMappingValChange = async (e: any, valName: (keyof CounterParams)) => {
    setValue(valName, e)
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

  const selectedDateRangeHandler = ({ start, end }: any, counter: any) => {
    let subBucketArrayTojson = JSON.parse(stateParams['subBucketArray']);
    subBucketArrayTojson[counter - 1].date_range['start'] = start;
    subBucketArrayTojson[counter - 1].date_range['end'] = end;
    let subBucketArrayToString = JSON.stringify(subBucketArrayTojson)
    setValue('subBucketArray', subBucketArrayToString)
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
                    isIndexSelected={isIndexSelected}
                  ></AxisBucket>
                </EuiAccordion>
              </EuiPanel>

              <EuiSpacer size="m" />

              {/* Splited */}

              <SubBucketRow
                stateParams={stateParams}
                splitedAggregationArr={splitedAggregationArr}
                selectedSplitLinesTermsField={selectedSplitLinesTermsField}
                isIndexSelected={isIndexSelected}
                isXAxisFieldSelected={isXAxisFieldSelected}
                numberFieldArr={numberFieldArr}
                dateFieldArr={dateFieldArr}
                selectedSplitLinesHistogramField={selectedSplitLinesHistogramField}
                selectedSplitLinesDateHistogramField={selectedSplitLinesDateHistogramField}
                selectedSplitLinesDateRangeField={selectedSplitLinesDateRangeField}

                selectSplitLinesAggregation={selectSplitLinesAggregation}
                selectedSplitLinesTermsFieldHandler={selectedSplitLinesTermsFieldHandler}
                selectSplitLinesMinimumInterval={selectSplitLinesMinimumInterval}
                selectedDateRangeHandler={selectedDateRangeHandler}

                onSplitedSeperateBucketChange={onSplitedSeperateBucketChange}
                onSplitedShowMissingValuesChange={onSplitedShowMissingValuesChange}
                setDateRangeStart={setDateRangeStart}
                setDateRangeEnd={setDateRangeEnd}

                onGeneralValChange={(e: any, valName: (keyof CounterParams)) => onGeneralValChange(e, valName)}
                cleanSubBucketArrayBuffer={cleanSubBucketArrayBuffer}
                ignoreSubBucketArrayBuffer={ignoreSubBucketArrayBuffer}
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
      <EuiSpacer size="xl" />
      <EuiFormRow label="Index-pattern" fullWidth>
        <EuiComboBox
          singleSelection={{ asPlainText: true }}
          placeholder="Search"
          options={indicesList[0]}
          selectedOptions={selectedIndexPattern}
          onChange={selectedIndexHandler}
          isClearable={false}
          data-test-subj="indexPattern"
          fullWidth
          isInvalid={selectedIndexPattern.length === 0}
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
