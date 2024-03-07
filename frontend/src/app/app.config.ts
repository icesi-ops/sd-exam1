import { ApplicationConfig } from '@angular/core';
import {provideHttpClient, withFetch} from "@angular/common/http";
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()), provideClientHydration()
  ]
};
