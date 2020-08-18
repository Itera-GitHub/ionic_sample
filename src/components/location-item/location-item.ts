import { Component, Input } from '@angular/core';
import { Location } from '../../abstracts/interfaces/location';
import { Events, NavController } from 'ionic-angular';

@Component({
  selector: 'location-item',
  templateUrl: 'location-item.html'
})
export class LocationItemComponent {

  @Input() locationDetails: Location;
  @Input() isList: boolean = false;

  constructor(public navCtrl: NavController) {

  }

}
