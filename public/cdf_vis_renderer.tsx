import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import { ExpressionRenderDefinition } from 'src/plugins/expressions';
import { CdfComponent } from './cdf_vis/cdf_component';
import { CDFVisRenderValue } from './cdf_vis_fn';

export const cdfVisRenderer: ExpressionRenderDefinition<CDFVisRenderValue> = {
  name: 'cdf_vis',
  reuseDomNode: true,
  render: (domNode, { visParams }, handlers) => {
    handlers.onDestroy(() => {
      unmountComponentAtNode(domNode);
    });

    render(<CdfComponent renderComplete={handlers.done} visParams={visParams} />, domNode);
  },
};