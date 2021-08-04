import { PluginInitializerContext } from '......srccoreserver';
import { TestPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new TestPlugin(initializerContext);
}

export { TestPluginSetup, TestPluginStart } from './types';
