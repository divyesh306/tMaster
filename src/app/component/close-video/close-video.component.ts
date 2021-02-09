import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-close-video',
  templateUrl: './close-video.component.html',
  styleUrls: ['./close-video.component.scss'],
})
export class CloseVideoComponent implements OnInit {
  @Input() onClick = () => { };
  constructor(public popoverCtrl: PopoverController) { }

  ngOnInit() { }
  close() {
    this.popoverCtrl.dismiss();
    this.onClick();
  }
  cancel() {
    this.popoverCtrl.dismiss();
  }
}
