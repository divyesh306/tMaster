import {
    Component, OnInit
}
from '@angular/core';
import {
    Router
}
from '@angular/router';

@Component({ selector: 'app-registration', templateUrl: './registration.page.html', styleUrls: ['./registration.page.scss'], }) export class RegistrationPage implements OnInit {

    constructor(private router:Router) {}

    ngOnInit() {}
    next() {
      this.router.navigate(['/register-complete']);
    }
    fillForm(option) {
        localStorage.setItem('formTitle', option);
        if(option == 'Birth') {}
        else {
            this.router.navigate(['register-form']);
        }
    }
}
