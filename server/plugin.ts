import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from 'src/core/server';

import { TestPluginSetup, TestPluginStart } from './types';
import { defineRoutes, registerFindRoute } from './routes';
import { CoreUsageDataSetup } from 'src/core/server/core_usage_data';


export class TestPlugin implements Plugin<TestPluginSetup, TestPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup, coreUsageData: CoreUsageDataSetup) {
    this.logger.debug('Test: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);
    registerFindRoute(router, { coreUsageData });

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('Test: Started');
    return {};
  }

  public stop() { }
}
