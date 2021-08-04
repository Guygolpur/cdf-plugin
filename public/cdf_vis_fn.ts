

import { ExpressionFunctionDefinition, Render } from 'src/plugins/expressions/public';
import { KibanaContext } from 'src/plugins/data/public';

export interface CDFVisParams {
  counter: number;
}

export interface CDFVisRenderValue {
  visParams: {
    counter: number;
  };
}

type Output = Promise<Render<CDFVisRenderValue>>;

export type CDFVisExpressionFunctionDefinition = ExpressionFunctionDefinition<
  'cdf_vis',
  KibanaContext,
  CDFVisParams,
  Output
>;

export const cdfVisFn: CDFVisExpressionFunctionDefinition = {
  name: 'cdf_vis',
  type: 'render',
  inputTypes: ['kibana_context'],
  help:
    'The expression function definition should be registered for a custom visualization to be rendered',
  args: {
    counter: {
      types: ['number'],
      default: 0,
      help: 'Visualization only argument with type number',
    },
  },
  async fn(input, args) {
    /**
     * You can do any calculation you need before rendering.
     * The function can also do asynchronous operations, e.x.:
     *
        const calculatedCounter = await new Promise((resolve) =>
          setTimeout(() => {
            resolve(args.counter * 2);
          }, 3000)
        );
    */

    return {
      type: 'render',
      as: 'cdf_vis',
      value: {
        visParams: {
          counter: args.counter,
        },
      },
    };
  },
};