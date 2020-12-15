import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {

  userDetail;
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private localStorage: LocalstorageService) {
    this.activatedRoute.params.subscribe(params => {
      // this.userId.type = params['userId'];
      // console.log('Url Id: ', this.userId);
    })
    this.userDetail = this.localStorage.get('selectedUser');
    console.log("Selected User ", this.userDetail);
  }

  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    var todayDate = new Date();
    var ageyear = todayDate.getFullYear() - dobDate.getFullYear();
    return ageyear;
  }
  backHangout() {
    this.localStorage.remove('selectedUser');
    this.router.navigate(['tabs/hangout']);
  }
  ngOnInit() {
  }

}
