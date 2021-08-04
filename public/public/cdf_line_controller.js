/* eslint-disable @kbn/eslint/require-license-header */
import _ from 'lodash';
import $ from 'jquery';
import d3 from 'd3';
import c3 from 'c3';
import { uiModules } from 'ui/modules';
import { aggConfigsManipulator } from '../../../src/legacy/ui/vis/request_handlers/multi_buckets_utils/aggConfigsManipulator';
import { groupAggsBySegment } from '../../../src/legacy/ui/vis/request_handlers/multi_buckets_utils//groupAggsBySegment';

import './constants/colors';
import './directives/tooltip/tooltip';
import './directives/color_picker/color_picker';
import './directives/panel_settings/grid';
import './directives/metrics_&_axes/x_axis_settings';

const chartWidthPadding = 15;
const chartHeightPadding = 15;
const legendBottomPadding = 40;
const singleLegendItemHeight = 18;
const bucketNamesSeparator = ' /-/ ';

uiModules
  .get('kibana/arc_cdf_line_vis')
  .controller('CdfLineChartVisController', function (Private, $scope, $element, $compile, CONSTANTS) {

    // ****
    // init
    // ****

    let idchart = '';
    let formattersByTopLevelBucketName = {};
    const legendSingleBucketPrefix = 'Percentile of ';
    $scope.chartData = {};
    $scope.availableColors = CONSTANTS.colors;
    $scope.totalHits = null;
    $scope.yAxisLabel = 'Percentile';
    $scope.xAxisFormatter = null; // although there may be multiple formatters (each top bucket has a formatter), we always take the first.
    $scope.currentAggs = $scope.vis.aggs; // used to track aggs changes

    modifyAggsConfigsObj($scope.vis);

    $scope.setColor = function (id, color) {
      // get label from chart data, update color and persist
      const label = getLabelFromChartDataById(id);
      const colors = $scope.uiState.get('vis.colors') || {};
      colors[label] = color;
      $scope.uiState.set('vis.colors', colors);

      // update chart colors
      const chartColors = $scope.chart.data.colors();
      chartColors[id] = color;
      const data = {
        data: {
          colors: chartColors
        }
      };
      $scope.chart.load(data);
    };

    $scope.showNoResultsMessage = function () {
      return isXAxisSelected() && isZeroHits();
    };

    $scope.showMustSelectXAxis = function () {
      return !isXAxisSelected();
    };

    modifySidebar();
    // if digest is already in progress. defer to next run cycle
    _.defer(function () {
      modifySidebar();
    });

    // **************
    // event handlers
    // **************

    $scope.$watch('esResponse', function (kibanaDatatable) {
      if (kibanaDatatable) {
        const responseTables = kibanaDatatable.multipleTables ? kibanaDatatable.multipleTables : kibanaDatatable;
        clearChart();
        const retVal = processTable(combineTables(responseTables));
        if (retVal) {
          filterData();
          showChart();
        }
      }
    });

    $scope.$watch('vis.aggs', function (newAggs) {

      modifyAggsConfigsObj($scope.vis);

      if (!$scope.esResponse) {
        return;
      }

      clearChart();
      if (JSON.stringify($scope.currentAggs) !== JSON.stringify(newAggs)) {
        $scope.currentAggs = newAggs;
        $scope.totalHits = null;

      } else {
        showChart();
      }
    });

    $scope.$on('$destroy', function () {
      console.debug('Clearing things up');
    });

    // *********
    // functions
    // *********

    function combineTables(tabRes) {

      const aggGroups = groupAggsBySegment($scope.vis.aggs, true, true);
           
      const combinedTable = {
        columns: [],
        rows: []
      };

      if(!aggGroups || !aggGroups.length) {
        return combinedTable;
      }

      if(!Array.isArray(tabRes)) {
        tabRes = [tabRes];
      }

      tabRes.forEach(function (currentTable) {
        //const currentTable = currentTabRes.tables[0];
        if(!currentTable) {
          return;
        }
        combinedTable.columns.push(currentTable.columns);
        currentTable.rows.forEach(function (currentRow) {
          currentRow.columns = currentTable.columns;
          combinedTable.rows.push(currentRow);

          updateRowMetadata(currentRow, aggGroups);
        });
      });

      return combinedTable;
    }

    function filterData() {
      if(!$scope.vis.params.categoryAxis.scale.setExtents) {
        return;
      }

      const xMax = $scope.vis.params.categoryAxis.scale.max;
      const xMin = $scope.vis.params.categoryAxis.scale.min;

      const xMaxValid = typeof (xMax) === 'number';
      const xMinValid = typeof (xMin) === 'number';

      const labelsToRemoveCompletely = [];

      Object.keys($scope.chartData).forEach(function (label) {

        const xValues = $scope.chartData[label].x;
        const yValues = $scope.chartData[label].y;

        const indexesToRemove = xValues.reduce(function (indexesList, value, index) {
          let toBeRemoved = false;
          if(xMaxValid && value > xMax) {
            toBeRemoved = true;
          }
          if(xMinValid && value < xMin) {
            toBeRemoved = true;
          }
          if(toBeRemoved) {
            indexesList.push(index);
          }
          return indexesList;
        }, []).reverse();

        indexesToRemove.forEach(function (index) {
          xValues.splice(index, 1);
          yValues.splice(index, 1);
        });

        if(xValues.length === 0) {
          labelsToRemoveCompletely.push(label);
        }
      });

      labelsToRemoveCompletely.forEach(label => delete $scope.chartData[label]);
    }

    function modifySidebar() {
      // remove "Metrics" group in Data
      $('vis-editor-agg-group[group-name="metrics"]').remove();
    }

    function processTable(combinedTable) {

      console.debug('Processing combined table');

      if (combinedTable.rows.length === 0) {
        console.info('Empty table groups');
        return false;
      }

      $scope.xAxisLabel = getXaxisLabel(combinedTable);
      $scope.xAxisFormatter = getXaxisFormatter(combinedTable);
      $scope.chartData = {};
      $scope.totalHits = 0;

      formattersByTopLevelBucketName = {};
      initFormattersByBucketNames(combinedTable);
      // step 1: get the total hits per label [i.e. per top level bucket group (top xAxis bucket+ split aggs)]
      calcLabelsTotalHits(combinedTable);
      // step 2: populate chart data with x & y
      calcLabelAccumulatedHits(combinedTable);

      return true;
    }

    function initFormattersByBucketNames(combinedTable) {

      combinedTable.columns.forEach(function (columnGroup) {
        formattersByTopLevelBucketName[columnGroup[0].name] = $scope.vis.aggs.find(agg => agg.params.field &&
          agg.params.field.name === columnGroup[0].name).fieldFormatter();
      });
    }

    function calcLabelsTotalHits(combinedTable) {

      combinedTable.rows.forEach(function (row) {

        let labelData = $scope.chartData[row.label];
        const isNewData = !labelData;

        if (isNewData) {
          labelData = {
            x: [],
            y: [],
            // xAxisFormatter: row.columns[0].aggConfig.fieldFormatter(),
            id: null, // will be populated later
            totalHits: 0
          };
        }

        const rowAggsKeys = Object.keys(row).filter(key => key.includes('col-'));
        // take the Count column value and add to total hits:
        const currentRowTotalHits = row[rowAggsKeys[rowAggsKeys.length - 1]];
        labelData.totalHits += currentRowTotalHits;

        // TODO: used only in isZeroHits() check if required. It has no meaning, since it's not a sum (per buckets group) but ! per bucket group
        //$scope.totalHits += labelData.totalHits;
        $scope.totalHits += currentRowTotalHits;

        if (isNewData) {
          $scope.chartData[row.label] = labelData;
        }
      });
    }

    function calcLabelAccumulatedHits(combinedTable) {

      const cumulativeAcc = {};

      combinedTable.rows.forEach(function (row) {

        const label = row.label;

        // extact x-axis value
        const rowAggsKeys = Object.keys(row).filter(key => key.includes('col-'));
        const currentRowAxisXValue = row[rowAggsKeys[0]];
        $scope.chartData[label].x.push(currentRowAxisXValue);

        // calculate y-axis value
        let cumulativeCount = cumulativeAcc[label] || 0;
        const currentRowTotalHits = row[rowAggsKeys[rowAggsKeys.length - 1]];
        cumulativeCount += currentRowTotalHits;
        cumulativeAcc[label] = cumulativeCount;
        const totalHits = $scope.chartData[label].totalHits;

        $scope.chartData[label].y.push(cumulativeCount / totalHits);
      });
    }

    function getXaxisFormatter(combinedTable) {
      return $scope.vis.aggs.find(agg => agg.params.field &&
        agg.params.field.name === combinedTable.columns[0][0].name).fieldFormatter();
    }

    function getXaxisLabel(combinedTable) {

      return combinedTable.columns.reduce(function (acc, columnsArr) {
        acc += `${columnsArr[0].name}, `;
        return acc;
      }, '').slice(0, -2);
    }

    // labels used for the legend frame (bottom right of screen) and more.
    function updateRowMetadata(row, aggGroups) {

      let label;
      // no split lines is used
      if (aggGroups[0].length <= 2) { // each group has the same size
        label = `${legendSingleBucketPrefix}${row.columns[0].name}`;
      }
      else {
        // get all "split rows" aggs *values* [- i.e. the values of all aggs not including the first (current top bucket (X-Axis) value), the last (Count),
        // AND omit the last propery which is the columns collection]
        const rowProps = Object.values(row);
        const values = rowProps.slice(1, rowProps.length - 2);

        // concatenate all aggs into a single string seperated by '-'
        const reducedValues = values.reduce(function (acc, value, index) {
          // const fieldFormatter = row.columns[index + 1].aggConfig.fieldFormatter();
          const fieldFormatter = $scope.vis.aggs.find(agg => agg.params.field &&
                                    (agg.params.field.name === row.columns[index + 1].name)).fieldFormatter();
          const formattedValue = fieldFormatter(value);
          acc += `${formattedValue}${bucketNamesSeparator}`;
          return acc;
        }, '').slice(0, -(bucketNamesSeparator.length));

        // add the title of the current top bucket aggregation
        label = `${row.columns[0].name}${bucketNamesSeparator}${reducedValues}`;
      }

      row.label = label;
    }

    function clearChart() {
      console.debug('Clear chart');
      // find element of class chartc3 and clear
      idchart = $element.children().find('.chartc3');
      idchart.empty();
    }

    function now() {
      const time = Date.now();
      const last = now.last || time;
      return now.last = time > last ? time : last + 1;
    }

    function uniqId() {
      return now().toString(36);
    }

    function showChart() {

      console.debug('Generating chart');

      // create uniq id for chart
      const randomId = 'cdf_line_chart_' + uniqId();

      $(idchart).append(`<div id="${randomId}"></div>`);

      // get element for chart
      const e = $element.children().find(`#${randomId}`);

      $scope.chartId = randomId;

      // init for c3Config c3
      const c3Config = {};
      c3Config.bindto = e[0];
      c3Config.data = {};

      c3Config.data.xs = {};
      c3Config.data.columns = [];
      c3Config.data.names = {};
      c3Config.data.colors = {};

      const colors = $scope.uiState.get('vis.colors') || {};

      Object.keys($scope.chartData).forEach(function (label, index) {

        const chartDataValue = $scope.chartData[label];
        const xId = `x${index}`;
        const yId = `y${index}`;

        $scope.chartData[label].id = yId;

        c3Config.data.xs[yId] = xId;

        // PROBLEM:
        // We use multiple top level buckets, which means we have multiple X-Axis types. Even though all of them are numeric,
        // since CDF uses the "Count" metric, still, they may have multiple "formats" (e.g: "3000" or "3,000").
        // Formatter is required in the x-axis config (for the "ticks" section) and in tooltip config. There's no way to pass there any paramter that will help us
        // determine the bucket that is the source to the x value we get there, and so there's no way to know which formatter to use.
        // Moreover, some of the x-axis values are not coming from any bucket result, but are "invented" by d3 in order to keep the x-axis scala normalized,
        // and these values don't have any formatter.
        // I found a work around for the tooltip (see there), but not for the x axis values.
        if(!chartDataValue.x.includes(xId)) {
          chartDataValue.x.unshift(xId);
        }
        if(!chartDataValue.y.includes(yId)) {
          chartDataValue.y.unshift(yId);
        }
        c3Config.data.columns.push(chartDataValue.x);
        c3Config.data.columns.push(chartDataValue.y);

        c3Config.data.names[yId] = label;

        let color = colors[label];
        if (!color) {
          color = colors[label] = _.sample($scope.availableColors);
        }
        c3Config.data.colors[yId] = color;
      });

      // persist colors
      $scope.uiState.set('vis.colors', colors);

      c3Config.axis = {};
      c3Config.axis.x = {
        label: {
          text: $scope.xAxisLabel,
          position: 'outer-center'
        },
        padding: {
          left: 2,
          right: 2
        },
        tick: {
          fit: false,
          format: function (x) {
            return $scope.xAxisFormatter(x);
          }
        }
      };
      c3Config.axis.y = {
        label: {
          text: $scope.yAxisLabel,
          position: 'outer-middle'
        },
        min: 0,
        max: 1,
        tick: {
          format: d3.format('.0%')
        },
        padding: { top: 5, bottom: 5 }
      };

      const legendY = legendBottomPadding + (Object.keys($scope.chartData).length * singleLegendItemHeight);

      c3Config.legend = {
        show: true,
        position: 'inset',
        inset: {
          anchor: 'bottom-right',
          x: 10,
          y: legendY,
        },
        item: {
          onclick: function (id) {
            $scope.colorPickerDirective = $compile(angular.element('<cdf-color-picker/>'))($scope)[0];
            $scope.colorPickerData = {
              id: id,
              color: $scope.chart.color(id)
            };

            const c3ChartDiv = $(`.c3#${$scope.chartId}`)[0];

            c3ChartDiv.insertAdjacentElement('afterbegin', $scope.colorPickerDirective);
            $scope.$digest();
          }
        }
      };

      c3Config.tooltip = {
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
          let format = null;
          if ((d[0].value * 100) % 1 === 0) {
            format = d3.format('.0%');
          } else {
            format = d3.format('.3%');
          }

          const dashIndex = d[0].name.indexOf(bucketNamesSeparator);
          let xLabel;
          if(dashIndex > 0) {
            xLabel = d[0].name.substring(0, dashIndex);
          }
          else {
            xLabel = d[0].name.substring(legendSingleBucketPrefix.length);
          }
          const xFormatter = formattersByTopLevelBucketName[xLabel];

          $scope.tooltipData = {
            xLabel: xLabel,
            yLabel: $scope.yAxisLabel,
            x: xFormatter(d[0].x),
            y: format(d[0].value),
          };

          const compiled = $compile('<cdf-line-tooltip/>')($scope);
          $scope.$digest();
          return compiled[0].outerHTML;
        },
        grouped: false
      };
      c3Config.data.type = 'line';

      c3Config.grid = {};
      c3Config.grid.x = { show: $scope.vis.params.grid.categoryLines };
      c3Config.grid.y = { show: $scope.vis.params.grid.valueAxis };

      // generate c3 chart
      $scope.chart = c3.generate(c3Config);

      resizeChart();
    }

    function resizeChart() {
      if ($scope.chart) {
        const elem = $(idchart[0]).closest('div.visualize-chart');
        const h = elem.height();
        const w = elem.width();

        $scope.chart.resize({
          height: Math.max(0, h - chartHeightPadding),
          width: Math.max(0, w - chartWidthPadding)
        });
      }
    }

    function getLabelFromChartDataById(id) {
      let label = null;
      Object.keys($scope.chartData).every(function (key) {
        if ($scope.chartData[key].id === id) {
          label = key;
          return false;
        }
        return true;
      });
      return label;
    }

    function isZeroHits() {
      // esResponse.hits.total can be GT 0 but because of bucket aggregation, $scope.totalHits is 0
      return (_.get($scope, 'esResponse.hits.total') === 0) || (_.get($scope, 'totalHits') === 0);
    }

    function isXAxisSelected() {
      return $scope.vis.aggs.length >= 2 && !_.isEmpty($scope.vis.aggs.filter(agg => agg.schema.title === 'X-Axis'));
    }

    // The usage of aggConfigUtil in multi_bucket_handler is not enough since the aggConfigs may be replaced (by Kibana) after the multi_bucket_handler call.
    function modifyAggsConfigsObj(vis) {
      aggConfigsManipulator(vis, null);
    }
  });
