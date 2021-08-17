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
  const [isHorizontalGrid, setIsHorizontalGrid] = useState(false)
  const [isVerticalGrid, setIsVerticalGrid] = useState(false)

  useEffect(() => {
    props.renderComplete();
    // console.log('props.visParams.timeFilterFromInput: ', props.visParams.timeFilterFromInput)
    // console.log('props.visParams.timeFilterToInput: ', props.visParams.timeFilterToInput)
  })

  useEffect(() => {
    if (!props.visParams.isSplitAccordionClicked) {
      axios({
        url: 'http://localhost:9200/arc-*/_search',
        method: 'post',
        timeout: 0,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          size: 0,
          aggs: {
            cdfAgg: {
              histogram: {
                field: props.visParams.field,
                interval: props.visParams.min_interval
              }
            }
          }
        })
      }).then(function (response) {

        const totalScores = response.data.aggregations.cdfAgg.buckets.reduce(
          (previousScore: any, currentScore: any, index: number) => previousScore + currentScore.doc_count,
          0);

        let aggLineData = [];
        let linePoint = [];


        aggLineData = response.data.aggregations.cdfAgg.buckets.map((item: any, index: number) => {
          let tempCounter = 0
          response.data.aggregations.cdfAgg.buckets.forEach((element: any, i: number) => {
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
        let aggLineDataObj: any = {};
        aggLineDataObj[props.visParams.field] = {
          points: aggLineData
        }
        setAggLineData(aggLineDataObj);

      }).then(function (error) {
        // console.log('error', error);
      })
    }
    else {
      axios({
        url: 'http://localhost:9200/arc-*/_search',
        method: 'post',
        timeout: 0,
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({
          size: 0,
          aggs: {
            cdfAgg: {
              histogram: {
                field: props.visParams.field,
                interval: props.visParams.min_interval
              },
              aggs: {
                innerAgg: {
                  [props.visParams.splitedAggregation]: {
                    field: props.visParams.splitedField
                  }
                }
              }
            }
          }
        })
      }).then(function (response) {

        let innerAggLineData: any[] = [];

        // populate graph field names
        var graphObj: any = {};
        response.data.aggregations.cdfAgg.buckets.forEach((element: any, i: number) => {
          innerAggLineData = element.innerAgg.buckets.map((key: any, doc_count: number) => {
            graphObj[key.key] = {}
            graphObj[key.key]['points'] = []
          })
        });
        // add points array to each corresponding graph
        response.data.aggregations.cdfAgg.buckets.forEach((element: any, i: number) => {
          let xPoint = element.key
          innerAggLineData = element.innerAgg.buckets.map((key: any, doc_count: number) => {
            graphObj[key.key]['points'].push({ x: xPoint, doc_count: key.doc_count })
            element.innerAgg.buckets.forEach((element: any, inner_i: number) => {
            });
          })
        });
        // parse points data
        Object.keys(graphObj).forEach(element => {
          let totalHits: number = graphObj[element].points.reduce(
            (previousScore: any, currentScore: any, index: number) => previousScore + currentScore.doc_count,
            0);

          graphObj[element].points = graphObj[element].points.map((el: any, currPointIndex: number) => {
            let tempCounter: number = 0

            graphObj[element].points.forEach((point: any, pointIndex: number) => {
              if (pointIndex <= currPointIndex) {
                tempCounter += point.doc_count
              }
              else {
                return
              }
            });

            let newElement: any[] = [];
            newElement[0] = el.x;
            newElement[1] = (tempCounter / totalHits) * 100;

            return newElement
          });
        });
        setAggLineData(graphObj);

      }).then(function (error) {
        // console.log('error', error);
      })
    }
  }, [props.visParams.min_interval, props.visParams.field, props.visParams.aggregation, props.visParams.isEmptyBucket, props.visParams.isExtendBounds, props.visParams.customLabel, props.visParams.advancedValue, props.visParams.jsonInput, props.visParams.isSplitAccordionClicked]);

  return (
    <Fragment>
      <Chart className="story-chart">
        <Settings showLegend showLegendExtra legendPosition={Position.Right} />
        <Axis
          id="bottom"
          position={Position.Bottom}
          showOverlappingTicks
          tickFormat={(d) => Number(d).toFixed(0)}
          showGridLines ={props.visParams.isVerticalGrid}
        />
        <Axis
          id="left"
          title={KIBANA_METRICS.metrics.kibana_os_load[0].metric.title}
          position={Position.Left}
          tickFormat={(d) => `${Number(d).toFixed(2)}%`}
          domain={{ max: 100 }}
          showGridLines={props.visParams.isHorizontalGrid}
        />
        {Object.keys(aggLineData).map((item: any, index: any) => {
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