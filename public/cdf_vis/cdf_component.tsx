

import React, { useEffect } from 'react';
import { EuiBadge } from '@elastic/eui';

import { CDFVisParams } from '../cdf_vis_fn';

import { EUI_CHARTS_THEME_DARK, EUI_CHARTS_THEME_LIGHT } from '@elastic/eui/dist/eui_charts_theme';

import {
  Chart,
  Settings,
  Axis,
  LineSeries,
  BarSeries,
  DataGenerator,
} from '@elastic/charts';
var isDarkTheme:any;
const euiTheme = isDarkTheme ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme;

<Settings theme={euiTheme} />


interface CdfComponentProps {
  renderComplete(): void;
  visParams: CDFVisParams;
}

export function CdfComponent(props: CdfComponentProps) {
  useEffect(() => {
    props.renderComplete();
  });

  return (
    <div>
      {/* <EuiBadge
        onClick={() => {}}
        data-test-subj="counter"
        onClickAriaLabel="Increase counter"
        color="primary"
      >
        {props.visParams.counter}
      </EuiBadge> */}
      <Chart size={{ height: 400 }}>
        <Settings
          theme={isDarkTheme ? EUI_CHARTS_THEME_DARK.theme : EUI_CHARTS_THEME_LIGHT.theme}
          showLegend={true}
          legendPosition="right"
          showLegendDisplayValue={false}
        />
        <LineSeries
          id="bars"
          name="0"
          data={[{ x: 1, y: 100, g: 'Categorical 1' }]}
          xAccessor={'x'}
          yAccessors={['y']}
          splitSeriesAccessors={['g']}

        />
        <Axis
          id="bottom-axis"
          position="bottom"
          showGridLines
        />
        <Axis
          id="left-axis"
          position="left"
          showGridLines
        />
      </Chart>
    </div>
  );
}

//works