
import DisplaySize from '../../common/display'

import FastRechargeComponet from './fast_recharge_component'
import AlipayScanCodeComponent from './alipay_scan_code'
import RechargeSharingComponent from './recharge_sharing_component'
import AlipayPaymentComponent from './alipay_payment_component'
import WechatPaymentComponent from './wechat_payment.component'
import wechatAppComponent from './wechat_app_component'
import RechargeCenterComponent from './recharge_center.component'
import WithdrawalMenuComponent from './withdrawal_menu_component'
import RechargeRecordComponent from './recharge_record_component'



/**
 * Making UserInfo basic.html page events and operations.
 */
class FinancilDealingComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.htmlDynamicDom = config.htmlDynamicDom;
        this.payWayData = config.payWayData;
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
      
        this.htmlLoader.loaderElement.addEventListener('load', () => {
            this.htmlLoader.visible = true;
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 

                switch (event.target.id) {
                    case 'icon_close':
                        this.onClickClose();
                        break;
                    case 'title1':
                        this.onClickTitle01();
                        break;
                    case 'title2':
                        this.onClickTitle02();
                        break;
                        case 'title3':
                        this.onClickTitle03();
                        break;
                    case 'title4':
                        this.onClickTitle04();
                        break;
                    default:
                        break;
                }   //End switch
                
            });  //End click event

        });  //End load event
    }

   

    onClickClose() {
        this.htmlLoader.visible = false;
        let payMask = document.getElementById("payMask");
        if(payMask){
            payMask.remove();
            // this.htmlDynamicDom.removeButtonDom("amountDiv");
        }
    }
    
    onClickTitle01() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width,
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/recharge_center.html'
        }
        let component = new RechargeCenterComponent(config);
    }
    
   
    
    onClickTitle02() {
        // this.htmlLoader.visible = false;
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width, 
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/withdrawal_menu.html'
        }
        let component = new WithdrawalMenuComponent(config);
    }
    
    onClickTitle03() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width,
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/recharge_record.html'
        }
        let component = new RechargeRecordComponent(config);
    }
    
    onClickTitle04() {
      
    }
 




}

export default FinancilDealingComponent;