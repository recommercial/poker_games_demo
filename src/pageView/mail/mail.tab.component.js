
import DisplaySize from '../../common/display'
import MailData from '../../data/mail.data'

/**
 * Making UserInfo basic.html page events and operations.
 */
class MailTabComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.mailData = new MailData(config);
        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.width = DisplaySize.MailFrame.width;
        this.htmlLoader.height = DisplaySize.MailFrame.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
        //    this.htmlLoader.visible = true;
           let mailList = this.htmlLoader.getInnerElementById("mail_list");
            mailList.style.display = "block";
           // Detect when scrolled to bottom.

             let mailObj = {
                "currentPage": 0,
                "perPage": 4
           };
           this.mailData.getMailList(mailObj);
         
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'main_close':
                        this.onClickClose();
                        break;
                    case 'message_close':
                        let deleteClose = this.htmlLoader.getInnerElementById("mail_detail");
                        let mailList = this.htmlLoader.getInnerElementById("mail_list");
                        this.onViewClose(deleteClose);
                        this.onViewBack(mailList);
                        // this.mailData.reflashMailList();
                    //     let mailObj = {
                    //         "currentPage": 0,
                    //         "perPage": 4
                    //    };
                    //    this.mailData.getMailList(mailObj);
                        break;
                    case 'close_btn':
                        let msgClose = this.htmlLoader.getInnerElementById("mail_hint");
                        this.onViewClose(msgClose);
                        let  cView = this.htmlLoader.getInnerElementById("mail_list");
                        this.onViewClose(msgClose);
                        this.onViewBack(cView);
                    //     this.mailData.reflashMailList();
                    //     let ckObj = {
                    //         "currentPage": 0,
                    //         "perPage": 4
                    //    };
                    //    this.mailData.getMailList(ckObj);
                        break;
                    case 'show_close':
                    case 'show_btn' :
                        let  mList = this.htmlLoader.getInnerElementById("mail_list");
                        let  showMsg = this.htmlLoader.getInnerElementById("show_message");
                             showMsg.style.display = "none";
                             mList.style.display = "block";
                         break;
                    case 'mail_icon_delete':
                        let closeView = this.htmlLoader.getInnerElementById("mail_detail");
                            closeView.style.display = "none";
                        this.onClickDelete();
                        break;
                    case 'mail_icon_confirm' :
                        let delMailId = this.htmlLoader.getInnerElementById("del_mail_id").value;
                        let mailDel = this.htmlLoader.getInnerElementById("mail_hint");
                        this.mailData.mailDelete(delMailId);
                            mailDel.style.display = "none";

                        break;
                    case 'mail_icon_cancel' : 
                        let mailCancel = this.htmlLoader.getInnerElementById("mail_hint");
                        let  reView = this.htmlLoader.getInnerElementById("mail_list");
                        this.onViewClose(mailCancel);
                        this.onViewBack(reView);
                    //     this.mailData.reflashMailList();
                    //     let backObj = {
                    //         "currentPage": 0,
                    //         "perPage": 4
                    //    };
                    //    this.mailData.getMailList(backObj);
                        break;
                    default:
                        break;
                }   //End switch
                
            });  //End click event
        });  //End load event
    }

    onClickClose() {
        this.htmlLoader.visible = false;
        window.HtmlMask1.visible = false;
    }

    onViewClose(closeView){
      
        closeView.style.display = "none";
        window.HtmlMask1.visible = false;
    }

    onViewBack(backView){
        backView.style.display = "block";
        window.HtmlMask1.visible = true;
    }
    
    onClickDetail() {
        let mailDetail = this.htmlLoader.innerDocument.getElementById("mail_detail");
            mailDetail.style.display = "block";
    }
    onClickDelete() {
        let mailHint = this.htmlLoader.innerDocument.getElementById("mail_hint");
            mailHint.style.display = "block";
    }

    displayView(viewCode){
        let mailList = this.htmlLoader.innerDocument.getElementById("mail_list");
        let mailDetail = this.htmlLoader.innerDocument.getElementById("mail_detail");
        let mailHint = this.htmlLoader.innerDocument.getElementById("mail_hint");

        
        mailList.style.display = viewCode;
        mailDetail.style.display = viewCode;
        mailHint.style.display = viewCode;
    }
    




}

export default MailTabComponent;