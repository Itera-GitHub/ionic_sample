import { NgModule } from '@angular/core';
import {IonicApp, IonicModule} from 'ionic-angular';
import {MyApp} from '../app/app.component';
import { LocationItemComponent } from './location-item/location-item';
import { LocationIfoComponent } from './location-ifo/location-ifo';
import { NumericKeyboardComponent } from './numeric-keyboard/numeric-keyboard';
import { CurrentBalanceComponent } from './current-balance/current-balance';

@NgModule({
	declarations: [
    LocationItemComponent,
    LocationIfoComponent,
    NumericKeyboardComponent,
    CurrentBalanceComponent,
  ],
	imports: [
    IonicModule.forRoot(MyApp)
	],
  bootstrap: [IonicApp],
	exports: [
    LocationItemComponent,
    LocationIfoComponent,
    NumericKeyboardComponent,
    CurrentBalanceComponent,
  ]
})
export class ComponentsModule {}
