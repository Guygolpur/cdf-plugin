import './index.scss';

import { CDFPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  debugger
  return new CDFPlugin();
}
export { CdfPluginSetup, CdfPluginStart } from './types';
