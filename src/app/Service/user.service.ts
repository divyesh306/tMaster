import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { throwError, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { configService } from './config.service';
import { LocalstorageService } from "./localstorage.service";

@Injectable({
    providedIn: 'root',
})

export class userService {
    server_url;
    headers;
    constructor(public _configservice: configService, public http: HttpClient, private localstorage: LocalstorageService) {
        this.server_url = this._configservice.getServerUrl();
        this.headers = { 'Authorization': this.localstorage.getsingel('loginToken') };
    }
    sendApi(mutationdata) {
        let body = {
            query: 'mutation ' + mutationdata.name + '($data:' + mutationdata.inputtype + '!){' + mutationdata.name + '(data:$data){hasError,message,data}}',
            variables: {
                data: mutationdata.data
            }
        }
        return this.http.post(this.server_url + "open", body)
    }
    CloseApi(mutationdata) {
        const headers = { 'Authorization': this.localstorage.getsingel('loginToken') };
        let body = {
            query: 'mutation ' + mutationdata.name + '($data:' + mutationdata.inputtype + '!){' + mutationdata.name + '(data:$data){hasError,message,data}}',
            variables: {
                data: mutationdata.data
            }
        }
        return this.http.post(this.server_url + "close", body, { headers })
    }
    closeQuery(queryData) {
        const headers = { 'Authorization': this.localstorage.getsingel('loginToken') };
        // query: `query{ user_list(search_term:"hello" gender:"male") }`
        let body = {
            query: `query{` + queryData.name + `}`
        }
        return this.http.post(this.server_url + "close", body, { headers })
    }
}