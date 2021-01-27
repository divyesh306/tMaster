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
    constructor(private router: Router,
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
            this.file.checkDir(this.file.externalDataDirectory, 'files/videos/')
                .then(_ => console.log('Directory exists'))
                .catch(err => console.log('Directory doesn\'t exist'));

            this.filedrectory = this.file.externalDataDirectory + "files/videos/"
        })
        this.userData.phone = this.localStorage.getsingel('phonenumber');

        this.activatedRoute.params.subscribe(params => {
            this.userData.type = params['position'];
        })

        this.registerForm = this.formBuilder.group({
            nick_name: ['', [Validators.required, Validators.minLength(5)]],
            date_of_birth: ['', [Validators.required]],
            phone: [this.userData.phone],
            gender: ['', [Validators.required]],
            rating: ['', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.maxLength(3), Validators.max(400)]],
            jobs: ['', [Validators.required]],
            tags: ['', [Validators.required]],
        })
    }

    ngOnInit() { }
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
            if (this.userData.picture) {
                var userdata = this.registerForm.value;
                userdata.type = this.userData.type;
                userdata.picture = this.userData.picture;
                userdata.video = this.userData.video;
                this.signup(userdata);
            }
            else {
                this.configService.sendToast('danger', 'Please Select Image', 'bottom')
            }
            // this.router.navigate(['/register-complete']);
        }
    }
    signup(signuserData) {
        const mutation = {
            name: 'signup',
            inputtype: 'UserRegisterInputType',
            data: signuserData
        }
        this.loading.present();
        this.userService.sendApi(mutation).subscribe(result => {
            const res = result['data'].signup;
            this.loading.dismiss();
            if (!res.hasError) {
                this.localStorage.setsingel('loginToken', res.data['token']);
                this.localStorage.set('userDetail', res.data['user']);
                if (this.localStorage.getsingel('loginToken'))
                    this.router.navigate(['/register-complete']);
            } else {
            }
        }, err => {
            this.loading.dismiss();
            this.configService.sendToast('danger', 'Something Went Wrong', 'bottom');
        });
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