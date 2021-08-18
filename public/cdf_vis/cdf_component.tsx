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
    field,
    min_interval,
    isSplitAccordionClicked,
    aggregation,
    splitedAggregation,
    splitedField,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
    jsonInput,
    isVerticalGrid,
    isHorizontalGrid
  } = props.visParams

  useEffect(() => {
    let data: any = {
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
      data.aggs.cdfAgg['aggs'] = {
        innerAgg: {
          [splitedAggregation]: {
            field: splitedField
          }
        }
      }
    }
    const reqObj: any = {
      url: 'http://localhost:9200/arc-*/_search',
      method: 'post',
      timeout: 0,
      headers: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(data)
    }
    axios(reqObj).then(function (response) {
      let aggLineDataObj: any = {};

      if (!isSplitAccordionClicked) {
        aggLineDataObj[field] = {
          points: parseSingleResponseData(response.data)
        }
      } else {
        aggLineDataObj = parseMultiResponseData(response.data)
      }
      setAggLineData(aggLineDataObj);
    }).catch(function (error) {
      console.log('error', error);
    })
  }, [field,
    min_interval,
    isSplitAccordionClicked,
    aggregation,
    splitedAggregation,
    splitedField,
    isEmptyBucket,
    isExtendBounds,
    customLabel,
    advancedValue,
    jsonInput,
    isVerticalGrid,
    isHorizontalGrid]);

  return (
    <Fragment>
      <Chart className="story-chart">
        <Settings showLegend showLegendExtra legendPosition={Position.Right} />
        <Axis
          id="bottom"
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
          domain={{ max: 100 }}
          showGridLines={isHorizontalGrid}
        />
        {Object.keys(aggLineData).map((item: any) => {
          return (
            <LineSeries
              id={item}
              xScaleType={ScaleType.Linear}
              yScaleType={ScaleType.Linear}
              xAccessor={0}
              yAccessors={[1]}
              data={aggLineData[item]['points']}
              curve={CurveType.LINEAR}
            />
          )
        })}
      </Chart>
    </Fragment>
  );
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
