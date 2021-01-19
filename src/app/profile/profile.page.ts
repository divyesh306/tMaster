import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from '../Service/localstorage.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';

import { S3Controller } from '../Service/upload.service';

import { File } from '@ionic-native/file/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Router } from '@angular/router';
import { VideoPlayer } from '@ionic-native/video-player/ngx';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  providers: [S3Controller]
})
export class ProfilePage implements OnInit {

  registerForm: FormGroup;
  isSubmitted = false;
  profileImg = '../../assets/avatar.jpeg';
  userDetail;
  s3Url;
  video;
  constructor(private localstorage: LocalstorageService, private userService: userService, private file: File,
    public formBuilder: FormBuilder, private uploadservice: S3Controller, private mediaCapture: MediaCapture,
    private configService: configService, private videoEditor: VideoEditor, private router: Router,
    public videoPlayer: VideoPlayer) {
      // "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      // "http://clips.vorwaerts-gmbh.de/VfE_html5.mp4"
    this.s3Url = this.configService.getS3(); // amazone bucket Url
    this.userDetail = this.localstorage.get('userDetail'); // User Detail
    this.video = this.s3Url + this.userDetail.video;
    console.log(this.userDetail);
    this.registerForm = this.formBuilder.group({
      nick_name: [this.userDetail.nick_name, [Validators.required, Validators.minLength(5)]],
      date_of_birth: [this.userDetail.date_of_birth, [Validators.required]],
      gender: [this.userDetail.gender, [Validators.required]],
      rating: [this.userDetail.rating, [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3), Validators.max(400)]],
      jobs: [this.userDetail.jobs, [Validators.required]],
      tags: [this.userDetail.tags, [Validators.required]],
      type: [this.userDetail.type, [Validators.required]]
    });
  }

  get errorControl() {
    return this.registerForm.controls;
  }
  next() {
    this.isSubmitted = true;
    if (!this.registerForm.valid) {
      this.configService.sendToast('danger', 'Please provide all the required values!', 'top')
      return false;
    } else {
      var userdata = this.registerForm.value;
      userdata.picture = this.userDetail.picture;
      userdata.rating = userdata.rating.toString();
      userdata.video = this.userDetail.video;
      console.log("user Detail : ", userdata);
      this.signup(userdata);
    }
  }

  signup(signuserData) {
    const mutation = {
      name: 'update_profile',
      inputtype: 'UserRegisterInputType',
      data: signuserData
    }
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].update_profile;

      if (!res.hasError) {
        this.localstorage.set('userDetail', res.data);
        this.userDetail = this.localstorage.get('userDetail');
        this.configService.sendToast('success', 'Profile Updated', 'bottom');
      } else {

      }
    }, err => {
      console.log("Somthing Went Wrong")
    });
  }

  fillForm(option) {
    localStorage.setItem('formTitle', option);
    if (option == 'Birth') {
      // this.isshowing = true;
    }
    // else {
    //     this.router.navigate(['register-form']);
    // }
  }

  ngOnInit() {
  }

  changeType() {
    this.isSubmitted = true;
    if (!this.registerForm.valid) {
      this.configService.sendToast('danger', 'Please provide all the required values!', 'top')
      return false;
    } else {
      var userdata = this.registerForm.value;
      userdata.picture = this.userDetail.picture;
      userdata.rating = userdata.rating.toString();
      userdata.video = this.userDetail.video;
      if (this.userDetail.type == 'user') {
        userdata.type = 'counselor';
      }
      else {
        userdata.type = 'user';
      }
      console.log("user Detail : ", userdata);
      this.signup(userdata);
    }
  }

  async startVedio() {
    let options: CaptureVideoOptions = { duration: 3, quality: 1 }
    this.mediaCapture.captureVideo(options)
      .then(
        async (data: MediaFile[]) => {
          var path = data[0].fullPath.replace('/private', 'file:///');
          const newBaseFilesystemPath = this.file.externalDataDirectory + "files/videos/";
          const videofilename = path.substr(path.lastIndexOf('/') + 1);
          const videopath = path.substr(0, path.lastIndexOf('/') + 1);
          const filename = videofilename.substr(0, videofilename.lastIndexOf('.'));
          this.file.readAsArrayBuffer(videopath, videofilename).then((body) => {
            this.uploadservice.uploadFile(body, videofilename, (url) => {
              alert("video File : " + url);
              this.userDetail.video = url.Key;
            });
          }).catch(err => {
            alert('readAsDataURL failed: (' + err.code + ")" + err.message);
          })

          var option: CreateThumbnailOptions = { fileUri: path.toString(), width: 160, height: 206, atTime: 1, outputFileName: filename, quality: 50 };
          const tempImage = await this.videoEditor.createThumbnail(option);
          const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
          const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);

          this.file.readAsArrayBuffer(newBaseFilesystemPath, tempFilename).then((b64str) => {
            this.uploadservice.uploadFile(b64str, tempFilename, (url) => {
              this.userDetail.picture = url.Key;
              this.profileImg = this.configService.getS3() + url.Key;
            });
          }).catch(err => {
            console.log('readAsDataURL failed: (' + err.code + ")" + err.message);
          })
        },
        (err: CaptureError) => console.error(err)
      );
  }
  playVideo() {
    // alert(this.userDetail.video);
    this.localstorage.set('selectedUser', this.userDetail);
    this.router.navigate(['tabs/video-detail/' + this.userDetail.id]);
  }
}