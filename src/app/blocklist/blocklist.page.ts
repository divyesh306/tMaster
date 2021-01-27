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
    this.loading.present();
    const body = {
      name: 'blocked_users{id updated_at status blocked_user{nick_name picture} user{nick_name picture}}'
    }
    this.userService.closeQuery(body).subscribe(result => {
      this.loading.dismiss();
      this.blockUserList = result['data'].blocked_users;
      console.log("Block User : ", this.blockUserList);
    }, err => {
      this.loading.dismiss();
      this.ConfigService.sendToast('danger', "Something Went Wrong : " + err, 'bottom');
    })
  }

  removeUserBlocked(userId) {
    const mutation = {
      name: 'remove_blocked_user',
      inputtype: 'RemoveBlockedUserInputType',
      data: { blocked_user_id: userId}
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].remove_blocked_user;
      this.loading.dismiss();
      if (!res.hasError) {
        this.ConfigService.sendToast('success', 'User Remove From Blocked', 'bottom');
      } else {

      }
    }, err => {
      this.loading.dismiss();
      this.ConfigService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }
}
