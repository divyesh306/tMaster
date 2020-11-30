import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { configService } from './config.service';

@Injectable({
    providedIn: 'root',
})

export class userService {
    server_url;
    constructor(public _configservice: configService, public http: HttpClient) {
        this.server_url = this._configservice.getServerUrl();
    }
    sendApi(mobilenumber) {
        return this.http.post(this.server_url + "open", mobilenumber)
    }
}