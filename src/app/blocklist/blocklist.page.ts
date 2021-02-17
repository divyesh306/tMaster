import { Component, OnInit } from '@angular/core';
import { userService } from '../Service/user.service';
import { LoadingService } from '../Service/loading.service';
import { configService } from '../Service/config.service';

@Component({
  selector: 'app-blocklist',
  templateUrl: './blocklist.page.html',
  styleUrls: ['./blocklist.page.scss'],
})
export class BlocklistPage implements OnInit {
  blockUserList = [];
  s3Url;
  constructor(public userService: userService, private loading: LoadingService, public ConfigService: configService) {
    this.s3Url = this.ConfigService.getS3();
  }

  ngOnInit() {
    this.getBloackList();
  }

  getBloackList() {
    this.loading.showLoader();
    const body = {
      name: 'blocked_users{id updated_at status blocked_user_id blocked_user{nick_name picture} user{nick_name picture}}'
    }
    this.userService.closeQuery(body).subscribe(result => {
      this.loading.hideLoader();
      this.blockUserList = result['data'].blocked_users;
    }, err => {
      this.loading.hideLoader();
      this.ConfigService.sendToast('danger', "Something Went Wrong : " + err, 'bottom');
    })
  }

  removeUserBlocked(userId) {
    const mutation = {
      name: 'remove_blocked_user',
      inputtype: 'RemoveBlockedUserInputType',
      data: { blocked_user_id: userId }
    }
    this.loading.showLoader();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].remove_blocked_user;
      this.loading.hideLoader();
      if (!res.hasError) {
        this.ConfigService.sendToast('success', 'User Remove From Blocked', 'bottom');
        this.getBloackList();
      } else {

      }
    }, err => {
      this.loading.hideLoader();
      this.ConfigService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }
}
