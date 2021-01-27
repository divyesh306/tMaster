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
  blockList = [];
  constructor(public userService: userService, private loading: LoadingService, public ConfigService: configService) { }

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
      this.blockList = this.splitKeyValue(result['data'].blocked_users);
      console.log("Rooms : ", this.blockList);
    }, err => {
      this.loading.dismiss();
      this.ConfigService.sendToast('danger', "Something Went Wrong : " + err, 'bottom');
    })
  }

  splitKeyValue = (obj) => {
    const keys = Object.keys(obj);
    const res = [];
    for (let i = 0; i < keys.length; i++) {
      res.push({
        'asset': keys[i],
        'data': obj[keys[i]]
      });
    };
    return res;
  };

}
