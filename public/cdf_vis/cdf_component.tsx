import React, { useEffect, Fragment, useState, useMemo, useLayoutEffect } from 'react';
import { CDFVisParams } from '../cdf_vis_fn';
import { KIBANA_METRICS } from './test_dataset_kibana';
import axios from 'axios';
import {
  Chart,
  Settings,
  Axis,
  LineSeries,
  Position,
  ScaleType,
  CurveType,
  SeriesKey,
  Color,
  LegendColorPicker,
  toEntries,
} from '@elastic/charts';

import {
  EuiSpacer,
  EuiFlexItem,
  EuiWrappingPopover,
  EuiColorPicker,
  EuiButtonEmpty,
  EuiButton,
} from '@elastic/eui';

import {
  esKuery,
  esQuery,
} from '../../../../src/plugins/data/public';

import { extractTime, getDashboardGlobalSearch, getDashboardGlobalFilters } from '../processor/global_handler'

interface CdfComponentProps {
  renderComplete(): void;
  visParams: CDFVisParams;
}

export function CdfComponent(props: CdfComponentProps) {
  const [aggLineData, setAggLineData] = useState([]);
  const [colors, setColors] = useState<Record<SeriesKey, Color | null>>({});
  const {
    // High level
    indexPattern,

    // X-axis
    aggregation, field, min_interval, isEmptyBucket, isExtendBounds, customLabel, jsonInput,

    // Metrix & Axes
    isAxisExtents, xMin, xMax, isSplitAccordionSearch, splitedAggregation, splitedField, isVerticalGrid,
    isHorizontalGrid, dateFilterFrom, dateFilterTo, dateRangeStart, dateRangeEnd, splitedHistogramMinInterval, splitedDateHistogramMinInterval,
    subBucketArray, splitedOrder, splitedGlobalCounter, splitedGlobalIds,

    // Filters
    filters, negativeFilters, rangeFilters, searchShould,
  } = props.visParams

  useLayoutEffect(() => {
    setTimeout(() => {
      let tooltipStyle = Array.from(document.getElementsByClassName('echLegendListContainer') as HTMLCollectionOf<HTMLElement>);
      if (tooltipStyle.length > 0) {
        tooltipStyle[0].style.height = '114px';
        tooltipStyle[0].style.maxHeight = '114px';
        tooltipStyle[0].style.marginBottom = '-86px';
      }
    }, 100);
  });

  useEffect(() => {
    props.renderComplete();
  })

  useEffect(() => {
    let isDashboard = document.getElementsByClassName('dashboardViewport')
    let emptyBucket = 1
    let rangeFiltersToJson = JSON.parse(rangeFilters)
    let negativeFilterToJson = JSON.parse(negativeFilters)
    let filterToJson = Object.values(JSON.parse(props.visParams.filters))
    let searchShouldToJson = JSON.parse(searchShould)
    let lengthFiltersObject = 0
    let uniteFilters: any = []
    let data: any
    let parsedSubBucketArray: any
    let sizeOfSubs = 0

    async function parseQuery() {
      let globalTime = { from: 'now-15m', to: 'now' }
      extractTime().then(extractedTime => {
        globalTime = extractedTime
      })

      if (isEmptyBucket) { emptyBucket = 0 }
      if (searchShouldToJson.length > 0 && rangeFiltersToJson.length > 0) {
        uniteFilters[lengthFiltersObject] = searchShouldToJson[0]
        lengthFiltersObject += uniteFilters.length
        if (rangeFiltersToJson[1]) {
          uniteFilters[lengthFiltersObject] = rangeFiltersToJson[1]
          lengthFiltersObject = uniteFilters.length
        }
      }
      else if (searchShouldToJson.length == 0 && rangeFiltersToJson.length == 0) {
        uniteFilters = []
      }
      else if (searchShouldToJson.length > 0 && rangeFiltersToJson.length == 0) {
        uniteFilters = searchShouldToJson
      }
      else {
        for (const [key, value] of Object.entries(rangeFiltersToJson)) {
          uniteFilters[Number(key) + lengthFiltersObject] = value
        }
      }
      if (filterToJson.length > 0) {
        let filtersGroup = filterToJson.map(a => a);
        lengthFiltersObject = uniteFilters.length
        for (const [key, value] of Object.entries(filtersGroup)) {
          uniteFilters[Number(key) + lengthFiltersObject] = value
        }
      }
      if (isDashboard.length > 0) {
        await getDashboardGlobalSearch(esKuery, esQuery).then(DashboardSearch => {
          if (DashboardSearch) {
            lengthFiltersObject = uniteFilters.length
            uniteFilters[lengthFiltersObject] = JSON.parse(DashboardSearch)[0]
          }
        }).catch((error) => {
          console.error('getDashboardGlobalSearch: ', error);
        })
        await getDashboardGlobalFilters().then(DashboardFilter => {
          if (DashboardFilter) {
            let rangeFiltersToJsonDash = JSON.parse(DashboardFilter[0])
            let negativeFilterToJsonDash = JSON.parse(DashboardFilter[1])
            let filterToJsonDash = Object.values(JSON.parse(DashboardFilter[2]))

            if (rangeFiltersToJsonDash.length > 1) {
              rangeFiltersToJsonDash.forEach((value: any, key: any) => {
                if (key !== 0) {
                  lengthFiltersObject = uniteFilters.length
                  uniteFilters[lengthFiltersObject] = rangeFiltersToJsonDash[key]
                }
              });

            }
            if (negativeFilterToJsonDash.length > 0) {
              negativeFilterToJsonDash.forEach((element: any) => {
                let lengthNegativeFiltersObject = negativeFilterToJson.length
                negativeFilterToJson[lengthNegativeFiltersObject] = element
              });
            }
            if (filterToJsonDash.length > 0) {
              filterToJsonDash.forEach((element: any) => {
                lengthFiltersObject = uniteFilters.length
                uniteFilters[lengthFiltersObject] = element
              })

            }


          }
        }).catch((error) => {
          console.error('getDashboardGlobalFilters: ', error);
        })
      }

      await uniteFilters.push(
        {
          range: {
            time: {
              gte: isDashboard.length > 0 ? globalTime.from : dateFilterFrom,
              lt: isDashboard.length > 0 ? globalTime.to : dateFilterTo
            }
          }
        }
      )
      data = {
        query: {
          bool: {
            must: [],
            filter: uniteFilters, should: [], must_not: negativeFilterToJson
          }
        },
        size: 0,
        aggs: {
          cdfAgg: {
            histogram: {
              field: field,
              interval: min_interval,
              min_doc_count: emptyBucket
            }
          }
        }
      }

      parsedSubBucketArray = JSON.parse(props.visParams.subBucketArray)
      if (!(Object.keys(parsedSubBucketArray).length === 0 && parsedSubBucketArray.constructor === Object)) {
        let toInsertObj: any = {}
        for (const [key, value] of Object.entries(parsedSubBucketArray).reverse()) {
          if (!value.isValid) { continue; }
          sizeOfSubs = sizeOfSubs + 1;
          let field = Object.values(value['field'][0])
          let fieldValue = Object.values(field)
          let aggs: any = {}
          if (value['agg'] == 'terms') {
            let count = value['order']
            if (count == undefined) {
              count = 'desc'
            }
            aggs = {
              [key]: {
                [value['agg']]: {
                  field: fieldValue[0],
                  size: 100000,
                  order: { "_count": count }
                }
              }
            }
          }
          else if (value['agg'] == 'histogram') {
            let extractInterval = Number(value['min_interval'])
            aggs = {
              [key]: {
                [value['agg']]: {
                  field: fieldValue[0],
                  interval: extractInterval ? extractInterval : 1,
                  min_doc_count: 1
                }
              }
            }
          }
          else if (value['agg'] == 'date_histogram') {
            aggs = {
              [key]: {
                [value['agg']]: {
                  field: fieldValue[0],
                  calendar_interval: value['min_interval'],
                  min_doc_count: 1,
                  time_zone: "Asia/Jerusalem"
                }
              }
            }
          }
          else if (value['agg'] == 'date_range') {
            let extractDates = Object.values(value['date_range'])
            aggs = {
              [key]: {
                [value['agg']]: {
                  field: fieldValue[0],
                  format: "MM-yyy",
                  ranges: [
                    { to: extractDates[1] },
                    { from: extractDates[0] }
                  ]
                }
              }
            }
          }
          if (!(Object.keys(toInsertObj).length === 0 && toInsertObj.constructor === Object)) {
            aggs[key].aggs = toInsertObj
          }
          toInsertObj = aggs
        }
        if (Object.values(parsedSubBucketArray).some(allIgnored)) { data.aggs.cdfAgg['aggs'] = toInsertObj; }
        else {
          data = data
        }
      }
      return data;
    }

    parseQuery().then(resData => {
      axios({
        method: "POST",
        url: "/api/search",
        data: { data: JSON.stringify(resData), indexPattern: indexPattern },
        headers: { "kbn-xsrf": "true" },
      })
        .then(function (response) {
          let aggLineDataObj: any = {};
          if ((Object.keys(parsedSubBucketArray).length === 0 && parsedSubBucketArray.constructor === Object) || !Object.values(parsedSubBucketArray).some(allIgnored)) {
            aggLineDataObj[field] = {
              points: parseSingleResponseData(response.data)
            }
          } else {
            aggLineDataObj = parseMultiResponseData(response.data, sizeOfSubs)
          }
          if (isAxisExtents) {
            aggLineDataObj = filterbyXAxis(aggLineDataObj, xMin, xMax)
          }
          setAggLineData(aggLineDataObj);
        }).catch(function (error) {
          console.log('error', error);
        });
    })
  }, [
    // X-axis
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    jsonInput,

    // Metrix & Axes
    isAxisExtents,
    xMin,
    xMax,

    isSplitAccordionSearch,
    splitedAggregation,
    splitedField,
    isVerticalGrid,
    isHorizontalGrid,
    dateFilterFrom,
    dateFilterTo,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,
    subBucketArray,
    splitedOrder,

    splitedGlobalCounter,
    splitedGlobalIds,

    // Filters
    filters,
    negativeFilters,
    rangeFilters,
    searchShould,

    dateRangeStart,
    dateRangeEnd,
    localStorage.getItem("kibana.timepicker.timeHistory"),
    localStorage.getItem("typeahead:dashboard-kuery"),
    localStorage.getItem("typeahead:dashboard-lucene"),
    window.location.hash
  ]);

  const allIgnored = (element: any) => element.isValid === true

  const CustomColorPicker: LegendColorPicker = useMemo(
    () => ({ anchor, color, onClose, seriesIdentifiers, onChange }) => {
      const handleClose = () => {
        onClose();
        setColors((prevColors) => ({
          ...prevColors,
          ...toEntries(seriesIdentifiers, 'key', color),
        }));
      };
      const handleChange = (c: Color | null) => {
        setColors((prevColors) => ({
          ...prevColors,
          ...toEntries(seriesIdentifiers, 'key', c),
        }));
        onChange(c);
      };

      return (
        <>
          <EuiWrappingPopover isOpen button={anchor} closePopover={handleClose} anchorPosition="leftCenter">
            <EuiColorPicker display="inline" color={color} onChange={handleChange} />
            <EuiSpacer size="m" />
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty size="s" onClick={() => handleChange(null)}>
                Clear color
              </EuiButtonEmpty>
            </EuiFlexItem>
            <EuiButton fullWidth size="s" onClick={handleClose}>
              Done
            </EuiButton>
          </EuiWrappingPopover>
        </>
      );
    },
    [setColors],
  );

  CustomColorPicker.displayName = 'CustomColorPicker';
  return (
    <Fragment>
      <Chart className="story-chart" size={["100%", "80%"]}>
        <Settings showLegend legendColorPicker={CustomColorPicker} legendPosition={Position.Bottom} />
        <Axis id="bottom" position={Position.Bottom} title={customLabel} showOverlappingTicks tickFormat={(d) => Number(d).toFixed(2)} showGridLines={isVerticalGrid} />
        <Axis id="left" title={KIBANA_METRICS.metrics.kibana_os_load[0].metric.title} position={Position.Left} tickFormat={(d) => `${Number(d).toFixed(2)}%`} showGridLines={isHorizontalGrid} />
        {Object.keys(aggLineData).map((item: any, i: any) => {
          return (
            <LineSeries
              id={item}
              xScaleType={ScaleType.Linear}
              yScaleType={ScaleType.Linear}
              xAccessor={0}
              yAccessors={[1]}
              data={aggLineData[item]['points']}
              curve={CurveType.LINEAR}
              key={i}
              color={({ key }) => colors[key] ?? null}
            />
          )
        })}
      </Chart>
    </Fragment>
  );
}

function filterbyXAxis(data: any, xMin: number, xMax: number) {
  let filteredObj: any = {}
  Object.keys(data).forEach((graphName, index) => {
    filteredObj[graphName] = {}
    filteredObj[graphName].points = []

    data[graphName].points.forEach((point: any) => {
      if (point[0] >= xMin && point[0] <= xMax) {
        const pointsLength: number = filteredObj[graphName].points.length
        filteredObj[graphName].points[pointsLength] = []
        filteredObj[graphName].points[pointsLength].push(point[0])
        filteredObj[graphName].points[pointsLength].push(point[1])
      }
    });
  });
  return filteredObj
}

function parseSingleResponseData(data: any): any {
  const totalScores = data.aggregations.cdfAgg.buckets.reduce(
    (previousScore: any, currentScore: any, index: number) => previousScore + currentScore.doc_count,
    0);
  let aggLineData: any[] = [];
  let linePoint: any[] = [];

  aggLineData = data.aggregations.cdfAgg.buckets.map((item: any, index: number) => {
    let tempCounter = 0
    data.aggregations.cdfAgg.buckets.forEach((element: any, i: number) => {
      if (i <= index) {
        tempCounter += element.doc_count
      }
      else {
        return
      }
    });
    linePoint = [item.key, (tempCounter / totalScores) * 100]
    return linePoint
  })
  return aggLineData;
}

// Manipulates the data recieved from elastic and building object of CDF lines (xPoint, doc_count)
let graphResponse: any = {}
let name = ''
let xPoint: any = null
function iter(o: any, sizeOfSubs: any, bucketSaw: number, xPoint: any, root: any) {
  Object.keys(o).forEach(function (k: any, i: number) {
    if (o[k] !== null && (o[k] instanceof Object || o[k] instanceof Array)) {
      if (o[k].hasOwnProperty('buckets') && !graphResponse.hasOwnProperty(o.key)) {
        if (bucketSaw > 0 && bucketSaw !== sizeOfSubs) {
          if (o.hasOwnProperty('key_as_string')) {
            if (name.length === 0) { name = `${o.key_as_string}` }
            else { name = name + '//-//' + `${o.key_as_string}` }
          }
          else {
            if (name.length === 0) { name = `${o.key}` }
            else { name = name + '//-//' + `${o.key}` }
          }
        }
      }
      if (k === 'buckets') { bucketSaw = bucketSaw + 1 }
      iter(o[k], sizeOfSubs, bucketSaw, xPoint, root);

      if (o[k] !== null && (o[k] instanceof Object || o[k] instanceof Array) && k !== 'buckets' && (name.match(/\/\/-\/\//g) || []).length == bucketSaw - 1) {
        var removeFromName = name.substr(0, name.lastIndexOf("//-//"));
        name = removeFromName
      }
      return;
    }
    else {
      if (bucketSaw === sizeOfSubs && name.length > 0) {
        if (o.hasOwnProperty('key_as_string')) {
          name = name + '//-//' + `${o.key_as_string}`
        }
        else {
          name = name + '//-//' + `${o.key}`
        }
        if (graphResponse[name] === undefined) {
          graphResponse[name] = {}
        }
        if (!('points' in graphResponse[name])) {
          graphResponse[name]['points'] = []
        }
        let isPointExist = graphResponse[name]['points'].some((el: any) => el.x === xPoint)
        if (!isPointExist) {
          graphResponse[name]['points'].push({ x: xPoint, doc_count: o.doc_count })
        }
        bucketSaw = bucketSaw + 1
      }
      else if (sizeOfSubs === 1 && bucketSaw === sizeOfSubs) {
        if (o.hasOwnProperty('key_as_string')) {
          name = `${o.key_as_string}`
        }
        else {
          name = `${o.key}`
        }
        if (graphResponse[name] === undefined) {
          graphResponse[name] = {}
        }
        if (!('points' in graphResponse[name])) {
          graphResponse[name]['points'] = []
        }
        let isPointExist = graphResponse[name]['points'].some((el: any) => el.x === xPoint)
        if (!isPointExist) {
          graphResponse[name]['points'].push({ x: xPoint, doc_count: o.doc_count })
        }
        name = ''
      }
    }

  });
}

function parseMultiResponseData(data: any, sizeOfSubs: number): any {
  graphResponse = {}
  data.aggregations.cdfAgg.buckets.forEach((bucket: any, i: number) => {
    let bucketSaw: number = 0;
    xPoint = bucket.key
    name = ''
    iter(bucket, sizeOfSubs, bucketSaw, xPoint, bucket.key)
  });

  // parse points data
  Object.keys(graphResponse).forEach(graphName => {
    let totalHits: number = graphResponse[graphName].points.reduce(
      (previousScore: any, currentScore: any, index: number) => previousScore + currentScore.doc_count,
      0);

    graphResponse[graphName].points = graphResponse[graphName].points.map((el: any, currPointIndex: number) => {
      let tempCounter: number = 0

      graphResponse[graphName].points.forEach((point: any, pointIndex: number) => {
        if (pointIndex <= currPointIndex) {
          tempCounter += point.doc_count
        } else {
          return
        }
      });

      let newElement: any[] = [];
      newElement[0] = el.x;
      newElement[1] = (tempCounter / totalHits) * 100;
      return newElement
    });
  });
  return graphResponse;
}
