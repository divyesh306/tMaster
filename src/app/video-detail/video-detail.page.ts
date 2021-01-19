import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { chats } from '../Service/chat.service';
import { NavController } from '@ionic/angular';
import { configService } from '../Service/config.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-video-detail',
  templateUrl: './video-detail.page.html',
  styleUrls: ['./video-detail.page.scss'],
})
export class VideoDetailPage implements OnInit {

  userDetail;
  s3Url;
  video;
  userData
  constructor(private activatedRoute: ActivatedRoute, private router: Router, private userService: userService,
    private localStorage: LocalstorageService, private configService: configService, private chatService: chats, private navCtrl: NavController) {

    this.activatedRoute.params.subscribe(params => {
      // this.userId.type = params['userId'];
      // console.log('Url Id: ', this.userId);
    })
    this.s3Url = this.configService.getS3();
    this.userDetail = this.localStorage.get('selectedUser');
    this.userData = this.localStorage.get('userDetail'); // User Detail
    this.video = this.s3Url + this.userData.video;
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

  createroom() {
    const mutation = {
      name: 'create_rooms',
      inputtype: 'CreateRoomInputType',
      data: {
        'receiver_id': this.userDetail.id
      }
    }
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].create_rooms;

      if (!res.hasError) {
        const data = {
          roomname: res.data.room_id
        };
        const room = this.chatService.createRoom(data);
        console.log("Add Room : ", room.ref.key);
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
        this.userService.CloseApi(mutation).subscribe(result => {
          const res = result['data'].update_rooms;
          console.log("Response : ", res);
          if (!res.hasError) {
            let newData = firebase.database().ref('chatroom/' + res.data.room_key + '/chats').push();
            newData.set({
              type: 'message',
              user: this.userData.nick_name,
              message: 'hello',
              sendDate: Date()
            });
          }
        }, err => {
          console.log("Somthing Went Wrong")
        });
        this.configService.sendToast('success', 'Room Created', 'bottom');
      } else {
        this.configService.sendToast('success', 'You Sent message this user before', 'bottom');
      }
    }, err => {
      console.log("Somthing Went Wrong")
    });
  }

}
