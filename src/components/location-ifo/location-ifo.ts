import {Component, ElementRef, EventEmitter, Output, Renderer} from '@angular/core';
import { Events, NavController } from 'ionic-angular';
import { SwipeDownProvider } from '../../providers/swipe-down';
import {Location} from '../../abstracts/interfaces/location';
import {StartWashPage} from '../../pages/start-wash/start-wash';
import {Storage} from '@ionic/Storage';
import {UserPosition} from '../../abstracts/interfaces/userPosition';
import {LocationProvider} from '../../providers/location.provider';

@Component({
  selector: 'location-ifo',
  templateUrl: 'location-ifo.html'
})
export class LocationIfoComponent {

  locationDetails: Location;
  showModal:boolean = false;
  userPosition: UserPosition;

  setTop: boolean = false;

  @Output() showDirections = new EventEmitter<Location>();

  constructor(public events: Events
    , public navCtrl: NavController
    , private swipe: SwipeDownProvider
    , public locationsProvider: LocationProvider
    , public renderer: Renderer
    , private storage: Storage
    , public element: ElementRef) {
  }

  ngAfterViewInit() {
    this.swipe.element = this.element;
    this.swipe.renderer = this.renderer;
    this.swipe.doAfterViewInit();
  }

  setToTop(){
    this.setTop = true;
    this.swipe.setToTop();
  }

  setToBottom(){
    if(this.setTop){
      this.setTop = false;
      this.swipe.setToBottom();
    }
  }

  showModalWindow(location: Location, userPosition){
    this.userPosition = userPosition;
    this.locationDetails = location;
    if(this.userPosition && this.userPosition.lat){
      this.locationDetails.distance = this.locationsProvider.getDistanceFromLatLonInKm(this.locationDetails.lat, this.locationDetails.lon, this.userPosition.lat, this.userPosition.lon);
    }
    this.setToTop();
  }

  addDirections(){
     this.showDirections.emit(this.locationDetails);
  }

}
