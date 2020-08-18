import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { IonicStorageModule } from '@ionic/Storage';
import { HttpClientModule } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { Uid } from '@ionic-native/uid';
import { HTTP } from "@ionic-native/http";
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Network } from '@ionic-native/network';
import { ThemeableBrowser } from '@ionic-native/themeable-browser';

import { MyApp } from './app.component';
import { MapPage } from '../pages/map/map';
import { LocationsPage } from '../pages/locations/locations';
import { NoConnectionPage } from '../pages/no-connection/no-connection';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MapProvider } from '../providers/map.provider';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationProvider } from '../providers/location.provider';
import { AuthProvider } from '../providers/auth.provider';
import { SwipeDownProvider } from '../providers/swipe-down';
import { HelperProvider } from '../providers/helper.provider';
import { ProfileProvider } from '../providers/profile.provider';
import { UserLocationProvider } from '../providers/user-location';
import { ConnectivityProvider } from '../providers/connectivity';
import { ProfilePage } from '../pages/profile/profile';

@NgModule({
  declarations: [
    MyApp,
    MapPage,
    LocationsPage,
    NoConnectionPage,
    ProfilePage,
  ],
  imports: [
    BrowserModule,
    ComponentsModule,
    DirectivesModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MapPage,
    LocationsPage,
    NoConnectionPage,
    ProfilePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    Device,
    Uid,
    AuthProvider,
    InAppBrowser,
    ScreenOrientation,
    HTTP,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MapProvider,
    SwipeDownProvider,
    LocationProvider,
    HelperProvider,
    ProfileProvider,
    UserLocationProvider,
    Network,
    ThemeableBrowser,
    ConnectivityProvider
  ]
})
export class AppModule {}
