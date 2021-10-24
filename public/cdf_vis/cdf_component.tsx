import React, { useEffect, Fragment, useState } from 'react';
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
} from '@elastic/charts';

interface CdfComponentProps {
  renderComplete(): void;
  visParams: CDFVisParams;
}

export function CdfComponent(props: CdfComponentProps) {
  const [aggLineData, setAggLineData] = useState([]);

  useEffect(() => {
    props.renderComplete();
    if (window.performance) {
      if (performance.navigation.type == 1) {
        props.visParams.subBucketArray = '{}'
      }
    }

  })

  const {
    // High level
    indexPattern,

    // X-axis
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
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
    dateRangeStart,
    dateRangeEnd,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,

    subBucketArray,
    splitedOrder,
  } = props.visParams

  useEffect(() => {
    let emptyBucket = 1
    if (isEmptyBucket) {
      emptyBucket = 0
    }
    let data: any = {
      query: {
        range: {
          time: {
            gte: dateFilterFrom,
            lt: dateFilterTo
          }
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

    let parsedSubBucketArray = JSON.parse(props.visParams.subBucketArray)
    // const sizeOfSubs = Object.entries(parsedSubBucketArray).length
    let sizeOfSubs = 0
    if (!(Object.keys(parsedSubBucketArray).length === 0 && parsedSubBucketArray.constructor === Object)) {
      let toInsertObj: any = {}
      for (const [key, value] of Object.entries(parsedSubBucketArray).reverse()) {
        if (!value.isValid) { continue; }
        sizeOfSubs = sizeOfSubs + 1;
        let field = Object.values(value['field'][0])
        let fieldValue = Object.values(field)
        let aggs: any = {}
        if (value['agg'] == 'terms') {
          aggs = {
            [key]: {
              [value['agg']]: {
                field: fieldValue[0],
                size: 5,  // should be dynamic
                order: { "_count": splitedOrder }   // should be dynamic
              }
            }
          }

        }
        else if (value['agg'] == 'histogram') {
          let extractInterval = Object.values(value['min_interval'])
          aggs = {
            [key]: {
              [value['agg']]: {
                field: fieldValue[0],
                interval: extractInterval[0],
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
                calendar_interval: value['min_interval']
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
      data.aggs.cdfAgg['aggs'] = toInsertObj;
    }

    console.log('JSON.stringify(data): ', JSON.stringify(data))

    axios({
      method: "POST",
      url: "/api/search",
      data: { data: JSON.stringify(data), indexPattern: indexPattern },
      headers: { "kbn-xsrf": "true" },
    })
      .then(function (response) {
        let aggLineDataObj: any = {};

        if (Object.keys(parsedSubBucketArray).length === 0 && parsedSubBucketArray.constructor === Object) {
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


  }, [
    // X-axis
    aggregation,
    field,
    min_interval,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
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
    splitedOrder
  ]);

  return (
    <Fragment>
      <Chart className="story-chart" size={["100%", "80%"]}>
        <Settings showLegend legendPosition={Position.Bottom} />
        <Axis
          id="bottom"
          title={customLabel}
          position={Position.Bottom}
          showOverlappingTicks
          tickFormat={(d) => Number(d).toFixed(0)}
          showGridLines={isVerticalGrid}
        />
        <Axis
          id="left"
          title={KIBANA_METRICS.metrics.kibana_os_load[0].metric.title}
          // position={Position.Left}
          tickFormat={(d) => `${Number(d).toFixed(2)}%`}
          showGridLines={isHorizontalGrid}
        />
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

let graphResponse: any = {}
let name = ''
let xPoint: any = null
function iter(o: any, sizeOfSubs: any, bucketSaw: number, xPoint: any, root: any) {
  Object.keys(o).forEach(function (k: any, i: number) {
    if (o[k] !== null && (o[k] instanceof Object || o[k] instanceof Array)) {
      if (o[k].hasOwnProperty('buckets') && !graphResponse.hasOwnProperty(o.key)) {
        if (bucketSaw > 0 && bucketSaw !== sizeOfSubs) {
          if (name.length === 0) { name = `${o.key}` }
          else { name = name + '//-//' + `${o.key}` }
        }
      }
      if (k === 'buckets') { bucketSaw = bucketSaw + 1 }
      iter(o[k], sizeOfSubs, bucketSaw, xPoint, root);

      if (o[k] !== null && (o[k] instanceof Object || o[k] instanceof Array) && k !== 'buckets') {
        var removeFromName = name.substr(0, name.lastIndexOf("//-//"));
        name = removeFromName
      }
      return;
    }
    else {
      if (bucketSaw === sizeOfSubs && name.length > 0) {
        name = name + '//-//' + `${o.key}`
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
        name = `${o.key}`
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
  console.log('graphResponse: ', graphResponse)

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
