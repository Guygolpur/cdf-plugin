import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '......srccoreserver';

import { TestPluginSetup, TestPluginStart } from './types';
import { defineRoutes } from './routes';

export class TestPlugin implements Plugin<TestPluginSetup, TestPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('Test: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('Test: Started');
    return {};
  }

  public stop() {}
}
