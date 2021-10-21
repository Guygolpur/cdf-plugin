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

    //here works works with aggregation and visualization!!!

    let parsedSubBucketArray = JSON.parse(props.visParams.subBucketArray)
    const sizeOfSubs = Object.entries(parsedSubBucketArray).length
    if (!(Object.keys(parsedSubBucketArray).length === 0 && parsedSubBucketArray.constructor === Object)) {
      let toInsertObj: any = {}
      for (const [key, value] of Object.entries(parsedSubBucketArray).reverse()) {
        let field = Object.values(value['field'][0])
        let fieldValue = Object.values(field)
        let aggs: any = {}
        if (value['agg'] == 'terms') {
          aggs = {
            [key]: {
              [value['agg']]: {
                field: fieldValue[0],
                size: 5,  // should be dynamic
                order: { "_count": "desc" }   // should be dynamic
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
        console.log('response: ', response.data)
        let aggLineDataObj: any = {};

        if (Object.keys(parsedSubBucketArray).length === 0 && parsedSubBucketArray.constructor === Object) {
          console.log('single')
          aggLineDataObj[field] = {
            points: parseSingleResponseData(response.data)
          }
        } else {
          console.log('multiple')
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
    subBucketArray
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

/////// work here to fill projects 21/10 19:44: in size of 1 or 2 split lines- check
let graphResponse: any = {}
let name = ''
function iter(o: any, sizeOfSubs: any, bucketSaw: number, xPoint: any, root: any) {
  Object.keys(o).forEach(function (k: any, i: number) {
    if (o[k] !== null && (o[k] instanceof Object || o[k] instanceof Array)) {
      if (o[k].hasOwnProperty('buckets') && !graphResponse.hasOwnProperty(o.key)) {
        if (bucketSaw > 0 && bucketSaw !== sizeOfSubs) {
          if (name.length === 0) { name = o.key }
          else { name = name + '/-/' + o.key }
        }
      }
      if (k === 'buckets') { bucketSaw = bucketSaw + 1 }
      iter(o[k], sizeOfSubs, bucketSaw, xPoint, root);
      return;
    }
    else {
      if (bucketSaw === sizeOfSubs && name.length > 0) {
        name = name + '/-/' + o.key
        graphResponse[name] = {}
      }
      else if (sizeOfSubs === 1 && bucketSaw === sizeOfSubs) {
        name = o.key
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

  });
}


function parseMultiResponseData(data: any, sizeOfSubs: number): any {
  graphResponse = {}
  data.aggregations.cdfAgg.buckets.forEach((bucket: any, i: number) => {
    let bucketSaw: number = 0;
    let xPoint = bucket.key
    iter(bucket, sizeOfSubs, bucketSaw, xPoint, bucket.key)

    // bucket[innerIndex[innerIndex.length -1]].buckets.forEach((innerBucket: any) => {
    //   //needs to add deeper by number of sub buckets.
    //   if (graphResponse[innerBucket.key] === undefined) {
    //     graphResponse[innerBucket.key] = {}
    //     graphResponse[innerBucket.key]['points'] = []
    //   }
    //   graphResponse[innerBucket.key]['points'].push({ x: xPoint, doc_count: innerBucket.doc_count })
    //   console.log('innerBucket: ', innerBucket)
    // })
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




//
// let graphResponse: any = {} // work here 21/10 13:30
// let secondLayer: any = []
// function iter(o: any, sizeOfSubs: any, bucketSaw: number, xPoint: any, root: any) {
//   Object.keys(o).forEach(function (k: any, i: number) {
//     if (o[k] !== null && (o[k] instanceof Object || o[k] instanceof Array)) {
//       xPoint = o.key
//       if (!graphResponse[root].hasOwnProperty(o.key) && o[k].hasOwnProperty('buckets') && (bucketSaw > 0 && bucketSaw < sizeOfSubs)) {
//         graphResponse[root][o.key] = {}
//         secondLayer.push(o.key)
//       }
//       if (k === 'buckets') { bucketSaw = bucketSaw + 1 }
//       iter(o[k], sizeOfSubs, bucketSaw, xPoint, root);
//       return;
//     }
//     if (bucketSaw === sizeOfSubs) {
//       debugger
//       xPoint = o.key
//       let prop = secondLayer[secondLayer.length - 1]
//       if (graphResponse[root][prop] === undefined) {
//         graphResponse[root][prop] = {}
//       }
//       if (!('points' in graphResponse[root][prop])) {
//         graphResponse[root][prop]['points'] = []
//       }
//       let isPointExist = graphResponse[root][prop]['points'].some((el: any) => el.x === xPoint)
//       if (!isPointExist) {
//         graphResponse[root][prop]['points'].push({ x: xPoint, doc_count: o.doc_count })
//       }
//     }
//   });
// }
// //here before method design
// function parseMultiResponseData(data: any, sizeOfSubs: any): any {
//   graphResponse = {}
//   data.aggregations.cdfAgg.buckets.forEach((bucket: any, i: number) => {
//     let bucketSaw: number = 0;
//     let xPoint: any = null
//     graphResponse[bucket.key] = {}
//     iter(bucket, sizeOfSubs, bucketSaw, xPoint, bucket.key)
//   });

//   Object.keys(graphResponse).forEach(graphName => {
//     Object.keys(graphResponse[graphName]).forEach(inner => {
//       let totalHits: number = graphResponse[graphName][inner].points.reduce(
//         (previousScore: any, currentScore: any, index: number) => previousScore + currentScore.doc_count, 0
//       );

//       graphResponse[graphName][inner].points = graphResponse[graphName][inner].points.map((el: any, currPointIndex: number) => {
//         let tempCounter: number = 0

//         graphResponse[graphName][inner].points.forEach((point: any, pointIndex: number) => {
//           if (pointIndex <= currPointIndex) {
//             tempCounter += point.doc_count
//           } else {
//             return
//           }
//         });

//         let newElement: any[] = [];
//         newElement[0] = el.x;
//         newElement[1] = (tempCounter / totalHits) * 100;
//         return newElement
//       });
//     });
//   })
//   return graphResponse;
// }