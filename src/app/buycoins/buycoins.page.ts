import { Component, OnInit } from '@angular/core';
import { InAppPurchase2, IAPProduct } from '@ionic-native/in-app-purchase-2/ngx'
import { Platform } from '@ionic/angular';
import { configService } from '../Service/config.service';
import { LoadingService } from '../Service/loading.service';
import { LocalstorageService } from '../Service/localstorage.service';
import { userService } from '../Service/user.service';

@Component({
  selector: 'app-buycoins',
  templateUrl: './buycoins.page.html',
  styleUrls: ['./buycoins.page.scss'],
})
export class BuycoinsPage implements OnInit {
  product: any;
  userDetail;
  productIDs = ['120', '720', '1600', '3700', '6800', '11400'];
  constructor(public platform: Platform,
    private iap2: InAppPurchase2,
    private loading: LoadingService,
    private userService: userService,
    private localStorage: LocalstorageService,
    private configService: configService,
  ) {
    this.userDetail = this.localStorage.get('userDetail');
  }

  ngOnInit() {
  }

  private refreshAppProducts() {
    this.productIDs.forEach(productId => {
      this.iap2.register({
        id: productId,
        type: this.iap2.CONSUMABLE,
        alias: productId
      });

      this.registerHandlersForPurchase(productId);
    });
    this.iap2.refresh();
  }

  ionViewDidEnter() {
    this.platform.ready().then(() => {
      this.refreshAppProducts();
    })
  }

  setup(coin) {
    this.iap2.verbosity = this.iap2.DEBUG;
    this.iap2.register({
      id: coin,
      type: this.iap2.CONSUMABLE
    });
    this.product = this.iap2.get(coin);
    this.registerHandlersForPurchase(coin);
    // restore purchase
    this.iap2.refresh();
  }

  checkout(coin) {
    try {
      let product = this.iap2.get(coin);
      console.log('Product Info: ' + JSON.stringify(product));
      this.iap2.order(coin).then((p) => {
        const mutation = {
          name: 'add_coin',
          inputtype: 'AddCoinInputType',
          data: { coins: parseFloat(coin) }
        }
        this.loading.showLoader();
        this.userService.CloseApi(mutation).subscribe(result => {
          const res = result['data'].add_coin;
          this.loading.hideLoader();
          if (!res.hasError) {
            this.userDetail.coins = this.userDetail.coins + coin;
            this.configService.sendToast("success", "Coin Succefully Added", "bottom");
          } else {
            this.configService.sendToast("danger", res.message, "bottom");
          }
        }, err => {
          this.loading.hideLoader();
          this.configService.sendToast("danger", "Something Went Wrong" + err, "bottom");
        });

      }).catch((e) => {
        console.log('Error Ordering From Store' + e);
      });
    } catch (err) {
      console.log('Error Ordering ' + JSON.stringify(err));
    }
  }

  registerHandlersForPurchase(productId) {
    let self = this.iap2;
    this.iap2.when(productId).updated(function (product) {
      if (product.loaded && product.valid && product.state === self.APPROVED && product.transaction != null) {
        product.finish();
      }
    });
    this.iap2.when(productId).registered((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
    });
    this.iap2.when(productId).owned((product: IAPProduct) => {
      // alert(` owned ${product.owned}`);
      product.finish();
    });
    this.iap2.when(productId).approved((product: IAPProduct) => {
      // alert('approved');
      product.finish();
    });
    this.iap2.when(productId).refunded((product: IAPProduct) => {
      // alert('refunded');
    });
    this.iap2.when(productId).expired((product: IAPProduct) => {
      // alert('expired');
    });
  }

}
