import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import { chats } from '../Service/chat.service';
import { LoadingService } from '../Service/loading.service';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {
  // @Input() video:string = "";
  userDetail;
  loginUserDetail;
  s3Url;
  video: HTMLMediaElement;
  userData;
  usersList = [];
  isuserFavorite = false;
  currentUserIndex: number;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private userService: userService,
    private loading: LoadingService,
    private localStorage: LocalstorageService,
    private configService: configService,
    private chatService: chats,
    private navCtrl: NavController,
    public elRef: ElementRef,) {

    this.activatedRoute.params.subscribe(params => {
      // this.userId.type = params['userId'];
    })
    this.s3Url = this.configService.getS3();
    this.loginUserDetail = this.localStorage.get('userDetail');
    this.userDetail = this.localStorage.get('selectedUser');
    this.video = this.s3Url + this.userDetail.video;
    console.log("UserDetail : ",this.userDetail);
    this.checkuserFavourite(this.localStorage.get('selectedUser'));
    this.usersList = this.localStorage.get('categoryUser');
    this.userData = this.localStorage.get('userDetail'); // User Detail
  }

  addFavorite() {
    const mutation = {
      name: 'add_to_favorite_user',
      inputtype: 'AddFavoriteUserInputType',
      data: { favorite_user: this.userDetail.id, type: 'favorite' },
    }
    this.loading.showLoader();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].add_to_favorite_user;
      this.loading.hideLoader();
      if (!res.hasError) {
        this.configService.sendToast('success', 'This User Add As a Favorite', 'bottom');
      } else { }
    }, err => {
      this.loading.hideLoader();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

  onSwipeLeft($event) {
    this.currentUserIndex = this.usersList.findIndex(x => x.id == this.userDetail.id);
    if (this.currentUserIndex != 0 && this.currentUserIndex < this.usersList.length) {
      this.checkuserFavourite(this.usersList[this.currentUserIndex - 1]);
    }
  }

  onSwipeRight($event) {
    this.currentUserIndex = this.usersList.findIndex(x => x.id == this.userDetail.id);
    if (this.currentUserIndex + 1 < this.usersList.length) {
      this.checkuserFavourite(this.usersList[this.currentUserIndex + 1]);
    }
  }
  calculateAge(bdate) {
    var dobDate = new Date(bdate);
    const todayDate = new Date();
    return todayDate.getFullYear() - dobDate.getFullYear();
  }

  backHangout() {
    this.localStorage.remove('selectedUser');
    // this.router.navigate(['tabs/profile']);
    this.navCtrl.back();
  }

  checkuserFavourite(userdetaildata) {
    const body = {
      name: 'is_user_favorited(id:"' + userdetaildata.id + '"){hasError,message,userErrors,data}'
    }
    this.loading.showLoader();
    this.userService.closeQuery(body).subscribe(result => {
      const res = result['data'].is_user_favorited;
      if (!res.hasError) {
        this.isuserFavorite = res.data.isExists;
        this.userDetail = userdetaildata;
        this.video = this.elRef.nativeElement.querySelector('#myVideo');
        this.video.src = this.s3Url + this.userDetail.video;
      }
      else {
        this.isuserFavorite = false;
      }
      this.loading.hideLoader();
    }, err => {
      this.loading.hideLoader();
      this.configService.sendToast('danger', "Something Went Wrong : " + err, 'bottom');
    })
  }
  ngOnInit() {
  }

  createroom() {
    const mutation = {
      name: 'create_rooms',
      inputtype: 'CreateRoomInputType',
      data: {
        'receiver_id': this.userDetail.id
      }
    }
    this.loading.showLoader();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].create_rooms;
      this.loading.hideLoader();
      if (!res.hasError) {
        const data = {
          roomname: res.data.room_id
        };
        const room = this.chatService.createRoom(data);
        const mutation = {
          name: 'update_rooms',
          inputtype: 'UpdateRoomInputType',
          data: {
            'id': res.data.id,
            'receiver_id': res.data.receiver_id,
            'room_id': res.data.room_id,
            'room_key': room.ref.key,
          }
        }
        this.loading.showLoader();
        this.userService.CloseApi(mutation).subscribe(result => {
          const res = result['data'].update_rooms;
          this.loading.hideLoader();
          if (!res.hasError) {
            const messagedata = {
              type: 'message',
              user: this.userData.nick_name,
              message: 'hello',
              sendDate: Date()
            }
            this.chatService.sendMessage(messagedata, res.data.room_key)
          }
        }, err => {
          this.loading.hideLoader();
          this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
        });
        this.configService.sendToast('success', 'Room Created', 'bottom');
      } else {
        this.configService.sendToast('success', 'You Sent message this user before', 'bottom');
      }
    }, err => {
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }


  removeFavorite() {
    const mutation = {
      name: 'remove_favorite_user',
      inputtype: 'RemoveFavoriteUserInputType',
      data: { favorite_user: this.userDetail.id }
    }
    this.loading.showLoader();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].remove_favorite_user;
      if (!res.hasError) {
        this.loading.hideLoader();
        this.configService.sendToast('success', 'This User Remove From Favorite', 'bottom');
      } else {
        this.loading.hideLoader();
        this.configService.sendToast('danger', res.message, 'bottom');
      }
    }, err => {
      this.loading.hideLoader();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

}
