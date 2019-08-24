
import DisplaySize from '../../common/display'

import WithdrwalMenuComponent from './withdrawal_menu_component'
import OrderSubmissionComponent from './order_submission_component';



/**
 * Making UserInfo basic.html page events and operations.
 */
class WithDrawalAuditComponent {
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
                    case 'btn2':
                        this.onClickClose();
                        break;
                    case 'payment01':
                        this.onClickPayment01()
                        break;
                    default:
                        break;
                }   //End switch
                
            });  //End click event

        });  //End load event
    }

   

    onClickClose() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width,
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/withdrawal_menu.html'
        }
        let component = new WithdrwalMenuComponent(config);
    }

    onClickPayment01(){
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width,
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/order_submission.html'
        }
        let component = new OrderSubmissionComponent(config);
    }
    
   
    
 




}

export default WithDrawalAuditComponent;