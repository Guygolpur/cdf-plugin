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
  })

  const {
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

    isSplitAccordionClicked,

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
  } = props.visParams

  useEffect(() => {
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
            interval: min_interval
          }
        }
      }
    }
    if (isSplitAccordionClicked) {
      if (splitedAggregation == 'terms') {
        data.aggs.cdfAgg['aggs'] = {
          innerAgg: {
            [splitedAggregation]: {
              field: splitedField
            }
          }
        }
      }
      else if (splitedAggregation == 'histogram') {
        data.aggs.cdfAgg['aggs'] = {
          innerAgg: {
            [splitedAggregation]: {
              field: splitedField,
              interval: splitedHistogramMinInterval,
              min_doc_count: 1
            }
          }
        }
      }
      else if (splitedAggregation == 'date_histogram') {
        data.aggs.cdfAgg['aggs'] = {
          innerAgg: {
            [splitedAggregation]: {
              field: splitedField,
              calendar_interval: splitedDateHistogramMinInterval
            }
          }
        }
      }
      else if (splitedAggregation == 'date_range') {
        data.aggs.cdfAgg['aggs'] = {
          innerAgg: {
            [splitedAggregation]: {
              field: splitedField,
              format: "MM-yyy",
              ranges: [
                { to: dateRangeEnd },
                { from: dateRangeStart }
              ]
            }
          }
        }
      }
    }


    // const reqObj: any = {
    //   url: 'http://localhost:9200/arc-*/_search',
    //   method: 'post',
    //   timeout: 0,
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   data: JSON.stringify(data)
    // }
    // axios(reqObj).then(function (response) {
    //   let aggLineDataObj: any = {};

    //   if (!isSplitAccordionClicked) {
    //     aggLineDataObj[field] = {
    //       points: parseSingleResponseData(response.data)
    //     }
    //   } else {
    //     aggLineDataObj = parseMultiResponseData(response.data)
    //   }
    //   if (isAxisExtents) {
    //     aggLineDataObj = filterbyXAxis(aggLineDataObj, xMin, xMax)
    //   }
    //   setAggLineData(aggLineDataObj);
    // }).catch(function (error) {
    //   console.log('error', error);
    // })


    axios({
      method: "POST",
      url: "/api/search",
      data: JSON.stringify(data),
      headers: { "Content-Type": "application/json", "kbn-xsrf": "true" },
    })
      .then(function (response) {
        console.log('response: ', response.data.reply)
        let aggLineDataObj: any = {};

        if (!isSplitAccordionClicked) {
          aggLineDataObj[field] = {
            points: parseSingleResponseData(response.data.reply)
          }
        } else {
          aggLineDataObj = parseMultiResponseData(response.data.reply)
        }
        if (isAxisExtents) {
          aggLineDataObj = filterbyXAxis(aggLineDataObj, xMin, xMax)
        }
        setAggLineData(aggLineDataObj);
        // tableDataSet(response.data.reply);
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

    isSplitAccordionClicked,
    splitedAggregation,
    splitedField,
    isVerticalGrid,
    isHorizontalGrid,
    dateFilterFrom,
    dateFilterTo,
    splitedHistogramMinInterval,
    splitedDateHistogramMinInterval,
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
          position={Position.Left}
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

function parseMultiResponseData(data: any): any {
  let graphResponse: any = {}
  data.aggregations.cdfAgg.buckets.forEach((bucket: any, i: number) => {
    let xPoint = bucket.key
    bucket.innerAgg.buckets.forEach((innerBucket: any) => {
      if (graphResponse[innerBucket.key] === undefined) {
        graphResponse[innerBucket.key] = {}
        graphResponse[innerBucket.key]['points'] = []
      }
      graphResponse[innerBucket.key]['points'].push({ x: xPoint, doc_count: innerBucket.doc_count })
    })
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
