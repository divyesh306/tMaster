import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';
import { configService } from '../Service/config.service';

import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';

import { S3Controller } from '../Service/upload.service';
import { File } from '@ionic-native/file/ngx';
import { VideoEditor, CreateThumbnailOptions } from '@ionic-native/video-editor/ngx';
import { Platform } from '@ionic/angular';
import { LoadingService } from '../Service/loading.service';
import { AuthenticationService } from '../Service/authentication-service';
@Component({
    selector: 'app-registration',
    templateUrl: './registration.page.html',
    styleUrls: ['./registration.page.scss'],
    providers: [S3Controller]
})

export class RegistrationPage implements OnInit {
    registerForm: FormGroup;
    isshowing: boolean = false;
    profileImg = '../../assets/avatar.jpeg';
    isSubmitted = false;
    datePicker = Date.now();
    userData;
    userEligible: boolean = false;
    filedrectory;
    tagList;
    constructor(private router: Router,
        public authService: AuthenticationService,
        private platform: Platform,
        private activatedRoute: ActivatedRoute,
        private localStorage: LocalstorageService,
        private userService: userService,
        private file: File,
        public formBuilder: FormBuilder,
        private mediaCapture: MediaCapture,
        private uploadservice: S3Controller,
        private configService: configService,
        private videoEditor: VideoEditor,
        private loading: LoadingService) {
        this.userData = {};
        this.platform.ready().then(() => {
            this.filedrectory = this.file.externalDataDirectory + "files/videos/"
        })

        this.loading.dismiss();
        this.tagList = [];
        this.userData.phone = this.localStorage.getsingel('phonenumber');

        this.activatedRoute.params.subscribe(params => {
            this.userData.type = params['position'];
        })
        // {
        //     "nick_name": "hardik",
        //     "date_of_birth": "2000-06-06T18:25:43.206+05:30",
        //     "phone": "+917016473593",
        //     "gender": "male",
        //     "rating": "350",
        //     "jobs": "developer",
        //     "tags": "testing,cricket",
        //     "type": "user",
        //     "picture": "Profilevideo/20210206_182547.jpg",
        //     "video": "Profilevideo/20210206_182547.mp4",
        //     "firebase_user_id": "b4kqGpudFNboYiAQLKEj7U9fHLs2"
        //   }
        this.getTags();
        this.registerForm = this.formBuilder.group({
            nick_name: ['hardik', [Validators.required, Validators.minLength(5)]],
            date_of_birth: ['2000-06-06T18:25:43.206+05:30', [Validators.required]],
            phone: [this.userData.phone],
            gender: ['male', [Validators.required]],
            rating: ['350', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3), Validators.max(400)]],
            jobs: ['developer', [Validators.required]],
            tags: ['testing,cricket', [Validators.required]],
        })
    }

    ngOnInit() { }
    getTags() {
        const body = {
            name: 'tags{id tag}'
        }
        this.loading.present();
        this.userService.openQuery(body).subscribe(result => {
            if (result['hasError']) {

            } else {
                this.tagList = result['data'].tags;
                console.log("Tag List : ", this.tagList);
            }
            this.loading.dismiss();
        }, err => {
            this.loading.dismiss();
        })
    }

    get errorControl() {
        return this.registerForm.controls;
    }

    async startVedio() {
        const newBaseFilesystemPath = this.filedrectory;
        let options: CaptureVideoOptions = { duration: 3, quality: 1 }
        this.mediaCapture.captureVideo(options)
            .then(
                async (data: MediaFile[]) => {
                    this.loading.present();
                    var path = data[0].fullPath.replace('/private', 'file:///');
                    // const newBaseFilesystemPath = this.file.externalDataDirectory + "files/videos/";
                    const videofilename = path.substr(path.lastIndexOf('/') + 1);
                    const videopath = path.substr(0, path.lastIndexOf('/') + 1);
                    const filename = videofilename.substr(0, videofilename.lastIndexOf('.'));
                    this.file.readAsArrayBuffer(videopath, videofilename).then((body) => {
                        this.uploadservice.uploadFile(body, videofilename, async (url) => {
                            this.userData.video = url.Key;
                            var option: CreateThumbnailOptions = { fileUri: path.toString(), width: 160, height: 206, atTime: 1, outputFileName: filename, quality: 50 };
                            const tempImage = await this.videoEditor.createThumbnail(option);
                            const tempFilename = tempImage.substr(tempImage.lastIndexOf('/') + 1);
                            const tempBaseFilesystemPath = tempImage.substr(0, tempImage.lastIndexOf('/') + 1);
                            if (this.userData.video)
                                this.loading.dismiss();
                            this.file.readAsArrayBuffer(newBaseFilesystemPath, tempFilename).then((b64str) => {
                                this.uploadservice.uploadFile(b64str, tempFilename, (url) => {
                                    this.userData.picture = url.Key;
                                    this.profileImg = this.configService.getS3() + url.Key;
                                });
                            }).catch(err => {
                                this.loading.dismiss();
                                this.configService.sendToast('danger', 'readAsDataURL failed: (' + err.code + ")" + err.message, 'bottom');
                            })
                        });
                    }).catch(err => {
                        this.loading.dismiss();
                        this.configService.sendToast('danger', 'readAsDataURL failed: (' + err.code + ")" + err.message, 'bottom');
                    });
                },
                (err: CaptureError) => this.configService.sendToast('danger', err.code, 'bottom')
            );
    }
    next() {
        this.isSubmitted = true;
        if (!this.registerForm.valid) {
            this.configService.sendToast('danger', 'Please provide all the required values!', 'top')
            return false;
        } else if (!this.userEligible) {
            this.configService.sendToast('danger', 'You are not eligible now.', 'top');
        } else {
            this.userData.picture = "Profilevideo/20210206_182547.jpg";
            this.userData.video = "Profilevideo/20210206_182547.mp4";
            if (this.userData.picture) {
                var userdata = this.registerForm.value;
                userdata.type = this.userData.type;
                userdata.picture = this.userData.picture;
                userdata.video = this.userData.video;
                userdata.tags = "testing,cricket";
                this.signup(userdata);
            }
            else {
                this.configService.sendToast('danger', 'Please Select Image', 'bottom')
            }
            // this.router.navigate(['/register-complete']);
        }
    }
    signup(signuserData) {
        let phonenumber = this.localStorage.getsingel('phonenumber')
        let email = phonenumber + '' + '@gmail.com';
        this.loading.present();
        this.authService.RegisterUser(email, phonenumber).then((res) => {
            signuserData.firebase_user_id = res.user.uid;
            const mutation = {
                name: 'signup',
                inputtype: 'UserRegisterInputType',
                data: signuserData
            }
            this.userService.sendApi(mutation).subscribe(result => {
                const res = result['data'].signup;
                if (!res.hasError) {
                    this.localStorage.setsingel('loginToken', res.data['token']);
                    this.localStorage.set('userDetail', res.data['user']);
                    this.loading.dismiss();
                    if (this.localStorage.getsingel('loginToken'))
                        this.router.navigate(['/register-complete']);
                } else {
                    this.loading.dismiss();
                }
            }, err => {
                this.loading.dismiss();
                this.configService.sendToast('danger', 'Something Went Wrong', 'bottom');
            });
        }).catch((error) => {
            this.loading.dismiss();
        })
    }
    fillForm(option) {
        localStorage.setItem('formTitle', option);
        if (option == 'Birth') {
            this.isshowing = true;
        }
        // else {
        //     this.router.navigate(['register-form']);
        // }
    }
    changeDate(dt) {
        console.log(this.datePicker);
    }
    calculateAge() {
        var bdate = this.registerForm.value.date_of_birth;
        var dobDate = new Date(bdate);
        const todayDate = new Date();
        var age = todayDate.getFullYear() - dobDate.getFullYear();
        if (age < 18) {
            this.configService.sendToast('danger', 'You are not eligible now.', 'top');
            this.userEligible = false;
        } else {
            this.userEligible = true;
        }
    }
}