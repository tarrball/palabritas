import { isDevMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { injectSpeedInsights } from '@vercel/speed-insights';

import { AppComponent } from './app/app.component';
import { AppRoutingModule } from './app/app-routing.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { metaReducers, reducers } from './app/2. store';
import { GameEffects } from './app/2. store/game/game.effects';
import { HydrationEffects } from './app/2. store/hydration/hydration.effects';
import { PersistenceEffects } from './app/2. store/persistence/persistence.effects';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      BrowserAnimationsModule,
      AppRoutingModule,
      StoreModule.forRoot(reducers, {
        metaReducers,
        runtimeChecks: {
          strictStateImmutability: true,
          strictActionImmutability: true,
          strictStateSerializability: true,
          strictActionSerializability: false,
          strictActionWithinNgZone: true,
          strictActionTypeUniqueness: true,
        },
      }),
      EffectsModule.forRoot([
        GameEffects,
        HydrationEffects,
        PersistenceEffects,
      ]),
      StoreDevtoolsModule.instrument({
        maxAge: 25,
        logOnly: !isDevMode(),
        autoPause: true,
        trace: false,
        traceLimit: 75,
      })
    ),
  ],
}).catch((err) => console.error(err));

if (!isDevMode()) {
  injectSpeedInsights();
}
