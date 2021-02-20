import { Component, ElementRef, OnInit } from '@angular/core';
import { LocalstorageService } from '../Service/localstorage.service';
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';

import { S3Controller } from '../Service/upload.service';

import { File } from '@ionic-native/file/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { Router } from '@angular/router';
import { LoadingService } from '../Service/loading.service';

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
  tagList;
  userTagsList = [];
  constructor(private localstorage: LocalstorageService,
    private userService: userService,
    private file: File,
    public formBuilder: FormBuilder,
    private uploadservice: S3Controller,
    private mediaCapture: MediaCapture,
    private configService: configService,
    private videoEditor: VideoEditor,
    private router: Router,
    public elRef: ElementRef,
    private loading: LoadingService) {
    this.s3Url = this.configService.getS3(); // amazone bucket Url
    this.userDetail = this.localstorage.get('userDetail');
    this.video = this.s3Url + this.userDetail.video;
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

  ionViewDidEnter() {
    const body = {
      name: 'me{type date_of_birth phone gender rating tags jobs picture video coins firebase_user_id nick_name id favorite_user_count}'
    }
    this.loading.showLoader();
    this.userService.closeQuery(body).subscribe(result => {
      if (result['hasError']) {
        this.userDetail = this.localstorage.get('userDetail');
        this.video = this.elRef.nativeElement.querySelector('#myVideo');
        this.video.src = this.s3Url + this.userDetail.video;
        this.loading.hideLoader();
      } else {
        this.localstorage.set('userDetail', result['data'].me);
        this.userDetail = this.localstorage.get('userDetail');
        this.video = this.elRef.nativeElement.querySelector('#myVideo');
        this.video.src = this.s3Url + this.userDetail.video;
      }
    }, err => {
      this.loading.hideLoader();
    })
    // this.userDetail = this.localstorage.get('userDetail'); // User Detail  
    this.getTags();
  }

  getTags() {
    const body = {
      name: 'tags{id tag}'
    }
    this.userService.closeQuery(body).subscribe(result => {
      if (result['hasError']) {

      } else {
        this.tagList = result['data'].tags;
      }
      this.loading.hideLoader();
      let tags = this.userDetail.tags;
      this.userTagsList = tags.split(',');
    }, err => {
      this.loading.hideLoader();
    })
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
      this.signup(userdata);
    }
  }

  signup(signuserData) {
    if (signuserData.tags === this.userDetail.tags) {

    } else {
      const tags = signuserData.tags.map(tag => tag);
      signuserData.tags = tags.toString();
    }
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
        this.localstorage.set('userDetail', res.data);
        this.userDetail = this.localstorage.get('userDetail');
        this.video = this.elRef.nativeElement.querySelector('#myVideo');
        this.video.src = this.s3Url + this.userDetail.video;
        this.configService.sendToast('success', 'Profile Updated', 'bottom');
      } else {

      }
    }, err => {
      this.loading.hideLoader();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
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
      this.signup(userdata);
    }
  }

  async startVedio() {
    let options: CaptureVideoOptions = { duration: 3, quality: 1 }
    this.mediaCapture.captureVideo(options)
      .then(
        async (data: MediaFile[]) => {
          this.loading.showLoader();
          var path = data[0].fullPath.replace('/private', 'file:///');
          const newBaseFilesystemPath = this.file.externalDataDirectory + "files/videos/";
          const videofilename = path.substr(path.lastIndexOf('/') + 1);
          const videopath = path.substr(0, path.lastIndexOf('/') + 1);
          const filename = videofilename.substr(0, videofilename.lastIndexOf('.'));
          this.file.readAsArrayBuffer(videopath, videofilename).then((body) => {
            this.uploadservice.uploadFile(body, videofilename, (url) => {
              this.userDetail.video = url.Key;
              this.loading.hideLoader();
            });
          }).catch(err => {
            this.loading.hideLoader();
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
            this.loading.hideLoader();
            console.log('readAsDataURL failed: ( ' + err.code + ' ) ' + err.message);
          })
        },
        (err: CaptureError) => console.error(err)
      );
  }

  playVideo() {
    this.localstorage.set('selectedUser', this.userDetail);
    this.router.navigate(['tabs/video-detail/' + this.userDetail.id]);
  }

  logout() {
    this.loading.showLoader();
    const body = {
      name: 'logout'
    }
    this.userService.closeQuery(body).subscribe(result => {
      this.loading.hideLoader();
      this.localstorage.clear();
      this.router.navigate(['verify-number']);
    }, err => {
      this.loading.hideLoader();
      this.configService.sendToast('danger', "Something Went Wrong : " + err, 'bottom');
    })
  }
}