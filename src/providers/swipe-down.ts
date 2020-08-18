import { Injectable } from '@angular/core';
import { Platform, DomController } from 'ionic-angular';
import { Events } from 'ionic-angular';

@Injectable()
export class SwipeDownProvider {

  blockHeight: number = 0;
  topPosition: number = 0;

  options:any = {};
  element:any;
  renderer:any;

  onOpen:any;
  onHide:any;

  constructor(public domCtrl: DomController
    , public platform: Platform
    , public events: Events) {

  }

  doAfterViewInit() {

    if(this.options.blockHeight){
      this.blockHeight = this.options.blockHeight;
    }

    if(this.options.topPosition){
      this.topPosition = this.options.topPosition;
    }

    let hammer = new window['Hammer'](this.element.nativeElement);

    hammer.get('pan').set({ direction: window['Hammer'].DIRECTION_VERTICAL });

    this.renderer.setElementStyle(this.element.nativeElement, 'top', '-' + this.element.nativeElement.offsetHeight + 'px');
    this.renderer.setElementStyle(this.element.nativeElement, 'padding-top', this.blockHeight + 'px');

    hammer.on('pan', (ev) => {
      this.handlePan(ev);
    });

  }

  setToTop(){
    this.domCtrl.write(() => {
      this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
      this.renderer.setElementStyle(this.element.nativeElement, 'top', this.topPosition+'px');
    });
  }

  setToBottom(){
    this.domCtrl.write(() => {
      this.renderer.setElementStyle(this.element.nativeElement, 'transition', 'top 0.5s');
      this.renderer.setElementStyle(this.element.nativeElement, 'top', '-' + this.element.nativeElement.offsetHeight + 'px');
      this.events.publish('swipe:hidden');
    });
  }

  handlePan(ev) {

    let newTop = ev.deltaY;

    if (ev.additionalEvent === "panup" || ev.additionalEvent === "pandown") {
      if (newTop < 0) {
        this.setToBottom();
      }
    }
  }

}
