import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-delete-account',
  templateUrl: './delete-account.page.html',
  styleUrls: ['./delete-account.page.scss'],
})
export class DeleteAccountPage implements OnInit {
  deleteComplete = false;
  userDetail;
  constructor(private userService: userService,
    private router: Router,
    private loading: LoadingService,
    public localStorage: LocalstorageService) {
    this.userDetail = this.localStorage.get('userDetail');
  }

  ngOnInit() {
  }
  delete() {
    this.deleteComplete = true;
    this.signup();
  }
  cancel() {

  }
  signup() {
    const signuserData = { status: "deleted" }
    this.loading.showLoader();
    const mutation = {
      name: 'update_profile',
      inputtype: 'UserRegisterInputType',
      data: signuserData
    }
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].update_profile;
      this.loading.hideLoader();
      if (!res.hasError) {
        this.localStorage.remove('userDetail');
        this.localStorage.removesingel('loginToken');
        this.localStorage.removesingel('phonenumber');
        this.router.navigate(['/verify-number']);
      } else {

      }
    }, err => {
      this.loading.hideLoader();
    });
  }
}
