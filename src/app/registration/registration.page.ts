import {
    Component, OnInit
}
from '@angular/core';
import {
    Router
}
from '@angular/router';

@Component({ selector: 'app-registration', templateUrl: './registration.page.html', styleUrls: ['./registration.page.scss'], }) export class RegistrationPage implements OnInit {
    isshowing: boolean=false;
    datePicker=Date.now();
    constructor(private router:Router) {}

    ngOnInit() {}
    next() {
        this.router.navigate(['/register-complete']);
    }
    fillForm(option) {
        localStorage.setItem('formTitle', option);
        if(option == 'Birth') {
            this.isshowing =true;
        }
        // else {
        //     this.router.navigate(['register-form']);
        // }
    }
    changeDate(dt) {
        console.log(this.datePicker);
    }
}
