import { Component, OnInit } from '@angular/core';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-bugreport',
  templateUrl: './bugreport.page.html',
  styleUrls: ['./bugreport.page.scss'],
})
export class BugreportPage implements OnInit {

  reportData;
  constructor(public userService: userService,
    public configService: configService,
    private loading: LoadingService) {
    this.reportData = {};
  }

  ngOnInit() {
  }


  sendReport(messageData) {
    const mutation = {
      name: 'bug_report',
      inputtype: 'BugReportInputType',
      data: messageData
    }
    this.loading.present();
    this.userService.CloseApi(mutation).subscribe(result => {
      const res = result['data'].bug_report;
      if (!res.hasError) {
        this.configService.sendToast("success", "Report Has Been Submited", "bottom");
        this.reportData = {};
      } else {
        this.configService.sendToast("danger", res.message, "bottom");
      }
      this.loading.dismiss();
    }, err => {
      this.loading.dismiss();
      this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
    });
  }

}
