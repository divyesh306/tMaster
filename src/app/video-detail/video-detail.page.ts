import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {

  userDetail;
  s3Url;
  video;
  constructor(private navCtrl: NavController, private activatedRoute: ActivatedRoute, private router: Router, private localStorage: LocalstorageService, private configService: configService) {
    this.activatedRoute.params.subscribe(params => {
      // this.userId.type = params['userId'];
      // console.log('Url Id: ', this.userId);
    })
    this.s3Url = this.configService.getS3();
    this.userDetail = this.localStorage.get('selectedUser');
    let userData = this.localStorage.get('userDetail'); // User Detail
    this.video = this.s3Url + userData.video;
    // alert(this.s3Url + userData.video);
    console.log("Selected User ", this.userDetail);
  }

  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    const todayDate = new Date();
    return todayDate.getFullYear() - dobDate.getFullYear();
  }

  backHangout() {
    console.log('back');
    this.localStorage.remove('selectedUser');
    // this.router.navigate(['tabs/profile']);
    this.navCtrl.back();
  }

  ngOnInit() {
  }

}
