import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({selector: 'app-registration', templateUrl: './registration.page.html', styleUrls: ['./registration.page.scss']})export class RegistrationPage implements OnInit {
    isshowing : boolean = false;
    datePicker = Date.now();
    file : File;
    profileImg = '../../assets/avatar.jpeg';
    constructor(private router : Router) {}

    ngOnInit() {}
    next() {
        this.router.navigate(['/register-complete']);
    }
    changeListener(event): void {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (event : any) => {
                this.profileImg = event.target.result;
            } 
            reader.readAsDataURL(event.target.files[0]); // to trigger onload
        }

        let fileList: FileList = event.target.files;
        let file: File = fileList[0];
        console.log(file);
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
}
