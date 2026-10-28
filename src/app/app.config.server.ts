import { mergeApplicationConfig, ApplicationConfig, inject, provideAppInitializer, TransferState } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { CMS_KEY } from './cms-content';
import { loadContent } from './cms.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    provideAppInitializer(async () => {
      inject(TransferState).set(CMS_KEY, await loadContent());
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
