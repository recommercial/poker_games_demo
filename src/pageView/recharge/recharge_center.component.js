
import DisplaySize from '../../common/display'

import FastRechargeComponet from './fast_recharge_component'
import AlipayScanCodeComponent from './alipay_scan_code'
import RechargeSharingComponent from './recharge_sharing_component'
import WithdrawalMenuComponent from './withdrawal_menu_component'
import RechargeRecordComponent from './recharge_record_component'
import AlipayPaymentComponent from './alipay_payment_component'
import WechatPaymentComponent from './wechat_payment.component'
import wechatAppComponent from './wechat_app_component'
import FinancilDealingComponent from './financial_dealings.component'
import RechargeConfig from '../../common/recharge.config'
import rechargeDataProcess from '../../data/recharge.data.process'
import LobbyService from '../../service/lobby-service';
import Constant from '../../common/constant'
import Util from '../../common/util'
import PlayerService from '../../service/player-service'

/**
 * Making UserInfo basic.html page events and operations.
 */
class RechargeCenterComponent {
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
        this.rechargeDataProcess = new rechargeDataProcess(config);
        this.companyData = null;
        this.documentId = null;
        this.type = config.type;
        this.getPaymentFlow  = null;
        this.getCashFlow  = null;
        this.currentPage  = 1;
        this.financialMemoryType  = null;
        this.financialMemorySelectTime  = null;
        
        this.prepareComponent();
        
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.visible = false;
        // this.htmlLoader.loaderElement.style.visibility = "hidden"
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.width = DisplaySize.RechargeFrame.width;
        this.htmlLoader.height = DisplaySize.RechargeFrame.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
            // jerry fixed start
            // let fisrtBtn = this.htmlLoader.getInnerElementById("recharge_icon");
            // fisrtBtn.innerHTML = "VIP充值";
            // jerry fixed end
            this.htmlLoader.innerDocument.addEventListener('click', (event) => {
                this.htmlLoader.visible = true;
                let bankTransfer = this.htmlLoader.getInnerElementById("bank_transfer");
                //this.doPayWay(event);
                switch (event.target.id) {
                    case 'icon_close':
                        this.onClickClose();
                        break;
                    case 'rechargeBtn':
                        this.openAbove(event,'recharge');
                        break;
                    case 'withdrawalBtn':
                        this.openAbove(event,'withdrawal');
                    break;
                    case 'recordBtn':
                        this.openAbove(event,'record');
                        break;
                    case 'financialBtn':
                        this.openAbove(event,'financial');
                        break;
                    case 'recharge_icon':
                        this.openLeftBanner(event,'recharge');
                        break;
                    case 'rechargeRecord':
                    case 'rechargeRecordInnder':
                        this.openInner(event,'recordinner');
                        break;
                    case 'withdrawalRecord':
                    case 'withdrawalRecordInner':
                        this.openInner(event,'withdrawalinner');
                        break;
                    case 'company_review':
                        let companyName = this.htmlLoader.getInnerElementById('company_name').value;
                        let companyAmount = this.htmlLoader.getInnerElementById('company_amount').value;
                        let wechat = this.htmlLoader.getInnerElementById('rechargeType_companyDeposit').querySelector('.wechat').value;
                        let alipay = this.htmlLoader.getInnerElementById('rechargeType_companyDeposit').querySelector('.alipay').value;
                        let bank = this.htmlLoader.getInnerElementById('company_type').value;
                        let payWayType = this.htmlLoader.getInnerElementById('recharge_amount2').getAttribute('type');
                        this.hideMsg('company_type_name_msg');
                        this.hideMsg('company_type_money_msg');
                        this.hideMsg('company_type_wechat_msg');
                        this.hideMsg('company_type_alipay_msg');
                        if(companyName === '' ||　companyName === 'undefined'){
                            this.validateMsg('company_type_name_msg','付款人姓名不可为空');
                            return;
                        }else if(!Util.specialCharReg(companyName)){
                            this.validateMsg('company_type_name_msg','不可输入特殊字元');
                            return;
                        }else if(Util.validateNumber(companyName)){
                            this.validateMsg('company_type_name_msg','付款人姓名必须为文字');
                            return;      
                        }else if(companyAmount === '' || companyAmount === 'undefined'){
                            this.validateMsg('company_type_money_msg','付款金额不可为空');
                            return;
                        }else if(!Util.validateNumber(companyAmount)){
                            this.validateMsg('company_type_money_msg','付款金额必须为数字');
                            return;
                        }else if(!Util.specialCharReg(companyAmount)){
                            this.validateMsg('company_type_money_msg','不可输入特殊字元');
                            return;
                        }else if(wechat === '' && bank === '2'){
                            this.validateMsg('company_type_wechat_msg','请输微信号');
                            return;
                        }else if(alipay === '' && bank === '3'){
                            this.validateMsg('company_type_alipay_msg','请输支付宝账号');
                            return;
                        }
                        this.companyData = this.rechargeDataProcess.transferDataByBank();
                        this.rechargeDataProcess.createBankCardData(this.companyData,payWayType);
                        break;
                    case 'subPaymentFromBankCard':
                        let withdrawalAmount = this.htmlLoader.getInnerElementById("withdrawalAmount").value;
                        if(withdrawalAmount === "" ||withdrawalAmount === "undefined"){
                                this.validateMsg("withdrawalErrMsg","提款金额不可为空");
                                return;
                        }else if(!Util.validateNumber(withdrawalAmount)){
                                this.validateMsg("withdrawalErrMsg","提款金额必须为数字");
                                return;
                        }else if( withdrawalAmount <= 0){
                            this.validateMsg("withdrawalErrMsg","提款金额必须大于零");
                            return;
                        }
                        this.onClickWithdrawalCenter();
                        break;
                    case 'withdrawal_btn1':
                        let fee = Number(this.htmlLoader.getInnerElementById("fee").textContent);
                        let bankAccount = document.getElementById("loader").contentWindow.document.getElementById("message_lab3").textContent;
                        this.onClickWithdrawalMessag(fee,bankAccount);
                        break;
                    case 'withdrawal_btn2':
                    case 'withdrawal_close':
                        this.onClickCancelWithdrawal();
                        break;
                    case 'iKnow1':
                        // this.rechargeBankTransfer(this.companyData);
                        this.onBackCompany(event);
                        break;
                    case 'withdrawal_submit':
                        this.withdrawalAmountSubmit();
                        break;
                    case 'copyWechat':
                        let wehcatPopup = this.htmlLoader.getInnerElementById("wehcat_popup");
                        this.onClickCopy("copyIsWechat",wehcatPopup,"proxy_lab2");
                        break;
                    case 'icon_copy02_1':
                            this.onClickCopy("bank_transfer_isCopyed_1",bankTransfer,"bankTransferInfo1");
                            break;
                    case 'icon_copy02_2':
                            this.onClickCopy("bank_transfer_isCopyed_2",bankTransfer,"bankTransferInfo2");
                            break;
                    case 'icon_copy02_3':
                            this.onClickCopy("bank_transfer_isCopyed_3",bankTransfer,"bankTransferInfo3");
                            break;
                    case 'icon_copy02_4':
                            this.onClickCopy("bank_transfer_isCopyed_4",bankTransfer,"bankTransferInfo4");
                            break;      
                    case 'close_wechat' :
                        this.oncloseWechat();
                        break;
                    case 'deposit_back' : 
                        this.onBackCompany(event);
                        break;
                    case 'bank_transfer_close' : 
                        this.onBackCompany(event);
                        break;
                    case 'wechat_transfer_close' : 
                        this.onBackCompany(event);
                        break;
                    case 'refresh':
                        this.rechargeDataProcess.createRechargeContent('recharge', true);
                        break;
                    case 'fastCopy':
                        let rechargeType2 = this.htmlLoader.getInnerElementById("rechargeType2");
                        this.onClickCopy("rechargeType_isCopy",rechargeType2,"fastId");
                        break;
                    default:
                        break;
                }   //End switch
                
            });  //End click event
            this.htmlLoader.innerDocument.addEventListener("change",(event)=>{
                switch (event.target.id) {
                    case 'typecontent':
                        this.onChangeType();
                        break;
                    case 'timecontent':
                        this.onChangeTime();
                        break;
                    default:
                        break;  
                }
            });
            if(this.type =="1"){
                let fisrtBtn = this.htmlLoader.getInnerElementById("rechargeBtn");
                fisrtBtn.click();
            }else if(this.type == "2"){
                let secondBtn = this.htmlLoader.getInnerElementById("withdrawalBtn");
                    secondBtn.click();
            }
            this.htmlLoader.visible = true;
        });  //End load event
    }

    doPayWay(event) {
        if(event.target.className === "payWay") {
            let payId = event.target.id;
            const config = {
                scene: this.scene,
                htmlLoader: this.htmlLoader,
                htmlDynamicDom: this.htmlDynamicDom,
                width: DisplaySize.RechargeFrame.width,
                height: DisplaySize.RechargeFrame.height,
                payWayData : this.payWayData,
                id: event.target.id,
                src: '/src/pageView/recharge/recharge_sharing.html'
            }
            let component = new RechargeSharingComponent(config);
        }
    }

      onBackCompany(event){
        let hidden_view = this.htmlLoader.getInnerElementById("bank_deposit");
        let hidden_view2 = this.htmlLoader.getInnerElementById("bank_transfer");
        let hidden_view3 = this.htmlLoader.getInnerElementById("wechat_transfer");
        let container2 = this.htmlLoader.getInnerElementById("container2");
        let icon_close = this.htmlLoader.getInnerElementById("icon_close");


        hidden_view.style.display = "none";
        hidden_view2.style.display = "none";
        hidden_view3.style.display = "none";

        container2.style.display = "block";
        icon_close.style.display = "block";



        this.openLeftBanner(event,'rechargeType_companyDeposit');
    }

    //close 微信複制畫面
    oncloseWechat(){
        let rechargeBtn = this.htmlLoader.getInnerElementById("rechargeBtn");
        this.displayView("none");
        let tablinks = this.htmlLoader.getInnerElementByClassName("tablinks");
        let bkImg = this.htmlLoader.getInnerElementById("bkImg");
        let iconClose = this.htmlLoader.getInnerElementById("icon_close");
            for(let j = 0; j < tablinks.length; j++){
                    tablinks[j].style.display = "block";
                }
            bkImg.style.display = "block";
            iconClose.style.display = "block";
        // rechargeBtn.click();
        this.htmlLoader.getInnerElementById("recharge").style.display = 'block';
        this.htmlLoader.getInnerElementById("container2").style.display = 'block';
    }

    onClickCopy(id,base,copyId) {
        let hasDom = this.htmlLoader.getInnerElementById('copyTargetDom');
        if(hasDom !== null){ 
            hasDom.parentNode.removeChild(hasDom);
        }
        let target = document.createElement("textarea");
        target.style.position = "absolute";
        target.style.left = "-9999px";
        target.style.top = "0";
        target.id = 'copyTargetDom';
        if(this.htmlLoader.getInnerElementById(copyId).tagName.toLowerCase() === 'input'){
            target.textContent  = this.htmlLoader.getInnerElementById(copyId).value.trim();
        }else{
            target.textContent  = this.htmlLoader.getInnerElementById(copyId).textContent.trim();
        }
        target.setAttribute('readonly','');
        base.appendChild(target);
        
        let copyText = this.htmlLoader.getInnerElementById('copyTargetDom');
        copyText.select();
        try {
            this.htmlLoader.innerDocument.execCommand("copy");
            this.htmlLoader.getInnerElementById(id).style.display= 'block';
            setTimeout(() => {                
                this.htmlLoader.getInnerElementById(id).style.display= 'none';
            }, 1000*2);
        } catch (error) {
            console.log(error);            
        }
    }

    //前台- 所有金流項目
    createItemAll(cityName,bkImg,container2,financialPage){
        let typeContent =  this.htmlLoader.getInnerElementById("typecontent");
        let timecontent = this.htmlLoader.getInnerElementById("timecontent");
        let time = '';
        for(let j = 0; j < 3 ; j++){
            switch(j){
                case 0:
                    time += "<option value=" + this.getSystmeData(j)  + " selected='selected' class='timecontent_op'>今天</option>";
                    break;
                case 1:
                    time += "<option value=" + this.getSystmeData(j)  + "  class='timecontent_op'>昨天</option>";

                    break;
                case 2:
                    time += "<option value=" + this.getSystmeData(j)  + "  class='timecontent_op'>前天</option>";
                    break;
                default:
                    break;
            }
        }

        timecontent.innerHTML = time;
        
        if(this.getPaymentFlow === null){
            LobbyService.itemAll().then(respItem => {
                let itemList = respItem.data.data;
                if(respItem.data.code === '0000'){
                    let index = 0;
                    let html = "<option value='1' selected='selected' class='typecontent_op'>全部</option>" ;
                    let cashFlowArray = [];
                    for(let key in itemList) {
                        cashFlowArray.push(itemList[key].itemID)
                        html += "<option value=" + itemList[key].itemID  + " class='typecontent_op'>" +itemList[key].itemName + "</option>";
                        index++;
                    }
                    typeContent.innerHTML = html;
                    this.getPaymentFlow = html;
                    this.getCashFlow = cashFlowArray;
                    this.getFinancialList(cityName,bkImg,container2);
                }else {
                    // let errorCode = `${res.data.code} - ${res.data.message}`;
                    // this.showDialog(errorCode);
                }
            });
        }else{
            typeContent.innerHTML = this.getPaymentFlow;
            this.getFinancialList(cityName,bkImg,container2);
        }

    }

    //資金往來時間
    onChangeTime(){
        let selectTime = this.htmlLoader.getInnerElementById("timecontent").value;
        let selectType = this.htmlLoader.getInnerElementById("typecontent").value;
        let financialPage = 1;
        let rechargeTimeObj = {
            "date": selectTime,
            "paymentItemList": [Number(selectType)],
            "page": financialPage,
            "count": 6
        }
        if(rechargeTimeObj.paymentItemList[0] === 1 && rechargeTimeObj.paymentItemList.length === 1){
            rechargeTimeObj.paymentItemList =  this.getCashFlow;
        }
        this.clearRecord();
        this.rechargeDataProcess.getFinancialRecordData(rechargeTimeObj,financialPage,true);
    }
    //資金往來類型
    onChangeType(){
        let selectTime = this.htmlLoader.getInnerElementById("timecontent").value;
        let selectType = this.htmlLoader.getInnerElementById("typecontent").value;
        let financialPage = 1;
        let rechargeTypeObj = {
            "date": selectTime,
            "paymentItemList":  [Number(selectType)],
            "page": financialPage,
            "count": 6
        }
        if(rechargeTypeObj.paymentItemList[0] === 1 && rechargeTypeObj.paymentItemList.length === 1){
            rechargeTypeObj.paymentItemList =  this.getCashFlow;
        }
        this.clearRecord();
        this.rechargeDataProcess.getFinancialRecordData(rechargeTypeObj,financialPage,true);
    }


    //清空record
    clearRecord(){
        let rechargeRecord = this.htmlLoader.getInnerElementById("record_infinite");
        let rechargeRecordInner = this.htmlLoader.getInnerElementById("record_infinite_inner");

        let financialRecord = this.htmlLoader.getInnerElementById("financial_infinite");

        let withdrawalRecord = this.htmlLoader.getInnerElementById("withdrawal_infinite");

        let withdrawalAuditRecord = this.htmlLoader.getInnerElementById("withdrawal_infinite_audit"); // nothing

        let rechargeInfiniteRecord = this.htmlLoader.getInnerElementById("recharge_infinite");
        let rechargeLeftInfiniteRecord = this.htmlLoader.getInnerElementById("recharge_left_infinite");

        let depositInfiniteRecord = this.htmlLoader.getInnerElementById("deposit_infinite");

        let companyMsg = this.htmlLoader.getInnerElementById("company_type_msg");

        let withdrawalErrMsg = this.htmlLoader.getInnerElementById("withdrawalErrMsg");

            companyMsg.style.display = "none";
            withdrawalErrMsg.style.display = "none";
        if(rechargeRecord){
            while (rechargeRecord.firstChild) {
                rechargeRecord.removeChild(rechargeRecord.firstChild);
            }
        }

        if(depositInfiniteRecord){
            while (depositInfiniteRecord.firstChild) {
                depositInfiniteRecord.removeChild(depositInfiniteRecord.firstChild);
            }
        }

        if(withdrawalAuditRecord){
            while (withdrawalAuditRecord.firstChild) {
                withdrawalAuditRecord.removeChild(withdrawalAuditRecord.firstChild);
            }
        }

        if(rechargeLeftInfiniteRecord){
            while (rechargeLeftInfiniteRecord.firstChild) {
                rechargeLeftInfiniteRecord.removeChild(rechargeLeftInfiniteRecord.firstChild);
            }
        }

        if(rechargeInfiniteRecord){
            while (rechargeInfiniteRecord.firstChild) {
                rechargeInfiniteRecord.removeChild(rechargeInfiniteRecord.firstChild);
            }
        }

        if(withdrawalRecord){
            while (withdrawalRecord.firstChild) {
                withdrawalRecord.removeChild(withdrawalRecord.firstChild);
            }
        }

        if(rechargeRecordInner){
            while (rechargeRecordInner.firstChild) {
                    rechargeRecordInner.removeChild(rechargeRecordInner.firstChild);
            }
        }

        if(financialRecord){
            while (financialRecord.firstChild) {
                financialRecord.removeChild(financialRecord.firstChild);
            }
        }
    }

     //清空record
     reflashRecordData(){
        let recharge_record_word = this.htmlLoader.getInnerElementByClassName("recharge_record_word");
        let recharge_record_num = this.htmlLoader.getInnerElementByClassName("recharge_record_num");
        let wechat_content = this.htmlLoader.getInnerElementByClassName("wechat_content");
            if(recharge_record_word){
                for(let key = 0; key < recharge_record_word.length; key++){
                    let rm = recharge_record_word[key];
                    rm.remove();
                }
            
            }
            if(recharge_record_num){
                for(let key = 0; key < recharge_record_num.length; key++){
                    let rm = recharge_record_num[key];
                    rm.remove();
                }
            
            }

            if(wechat_content){
                for(let key = 0; key < wechat_content.length; key++){
                    let rm = wechat_content[key];
                    rm.remove();
                }
            }
     }
 
    //取得系統時間
    getSystmeData(calculation){
        let today = new Date();
        let calculationDate = new Date(today);
    
            calculationDate.setDate(calculationDate.getDate() - calculation);
        let dd = String(calculationDate.getDate()).padStart(2, '0');
        let mm = String(calculationDate.getMonth() + 1).padStart(2, '0'); 
        let yyyy = calculationDate.getFullYear();
            calculationDate = yyyy + '/' + mm + '/' + dd;
         
            return calculationDate;
        }
    
        

    
    
    createDynamicButton(){
        this.htmlLoader.visible = true;
        let container2 = this.htmlLoader.getInnerElementById("container2");

        if(container2){
            container2.style.display = "block";
            this.htmlDynamicDom.addDynamicPaymentType(this.payWayData,container2);

            
        }
        let _payWayList = JSON.parse(JSON.stringify(this.payWayData));
        _payWayList = _payWayList.reverse();
        _payWayList.unshift({
            paywayID: "1000",
            paywayName: "VIP充值",
            paywayNameColor: "#a49a74",
            isQuickChoice: false,
            balanceString: "100|200|300|400|500",
            iconURL: "",
        });
        for(let i = 1; i<_payWayList.length; i++){
                let payWayObj = _payWayList[i];

                this.htmlDynamicDom.addButtonDom(payWayObj,i);
        }

        this.htmlDynamicDom.createDialogMsg();
        // this.createIframeBackground();

    }

    
    createIframeBackground() {
        let target = document.getElementById("container");
        if(target) {
            let elem = document.createElement("img");
                elem.src = "https://s3-ap-southeast-1.amazonaws.com/pokerphotos/A0001/recharge/pay_mask01.png/pay_mask01.png";
                elem.style.width = "100%";
                elem.style.height = "100%";
                elem.id = "payMask";
                elem.addEventListener('mousedown',  function btnMousedown (ev) { ev.stopPropagation();});
                elem.addEventListener('mouseup', function btnMouseup (ev) { ev.stopPropagation();});
                target.appendChild(elem);
        }
    }

    showCloseButton(){
        let close_btn = this.htmlLoader.getInnerElementById("icon_close");
            close_btn.style.display = "block";
    }

    onClickClose() {
        this.htmlLoader.visible = false;
        window.HtmlMask1.visible = false;
        let payMask = document.getElementById("payMask");
        if(payMask){
            payMask.remove();
            // this.htmlDynamicDom.removeButtonDom("amountDiv");
        }
    }

   openAbove(evt, cityName) {
        let leftDiv = this.htmlLoader.getInnerElementByClassName("leftcontent");
        let recordDiv = this.htmlLoader.getInnerElementByClassName("tabrecordcontent");
        // let container1 = this.htmlLoader.getInnerElementById("container1");
        let container2 = this.htmlLoader.getInnerElementById("container2");
        let i, tabcontent, tablinks;
        this.displayView("none");
        this.showCloseButton();
        for(let j = 0; j < leftDiv.length; j++){
            leftDiv[j].style.display = "none";
        }

        for(let x = 0; x < recordDiv.length; x++){
            recordDiv[x].style.display = "none";
        }
         
        tabcontent = this.htmlLoader.getInnerElementByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }

        tablinks = this.htmlLoader.getInnerElementByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }

        this.htmlLoader.getInnerElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
        let bkImg = this.htmlLoader.getInnerElementById("bkImg");
           
            
            switch (cityName) {
                case 'recharge':
                    this.htmlLoader.getInnerElementById("recharge_top_img").style.display ='block';
                    bkImg.setAttribute("src","@../../../../assets/recharge/pay_popup01.png");
                    let doubleCheck = this.htmlLoader.getInnerElementById("recharge_amount4");
                    this.clearRecord();
                    this.changeHoverImage(cityName);
                    if(!doubleCheck){
                        this.createDynamicButton();
                    }
                    this.rechargeDataProcess.createRechargeContent("recharge");
                    // container1.style.display = "block";
                    container2.style.display = "block";
                    break;   
                case 'withdrawal':
                    this.htmlLoader.getInnerElementById("recharge_top_img").style.display ='block';
                    bkImg.setAttribute("src","@../../../../assets/recharge/pay_popup07.png");
                    const user = this.scene.registry.get(Constant.REGISTRY_USER);
                    let withdrawalLab3 = this.htmlLoader.getInnerElementById("withdrawalLab3");
                        withdrawalLab3.innerHTML = user.balance;
                    let withdrawalAmount = this.htmlLoader.getInnerElementById("withdrawalAmount");
                        withdrawalAmount.value = "";
                    this.changeHoverImage(cityName);
                    container2.style.display = "none";
                    break;
                case 'record':
                    this.htmlLoader.getInnerElementById("recharge_top_img").style.display ='none';
                    bkImg.setAttribute("src","@../../../../assets/recharge/pay_popup10.png");
                    this.clearRecord();
                    let recordPage = 1;
                    this.rechargeDataProcess.getRechargeRecordData('record_infinite',recordPage);
                    this.changeHoverImage(cityName);
                    container2.style.display = "none";
                    let recordElem = this.htmlLoader.getInnerElementById("record_infinite");
                    recordElem.addEventListener('scroll', () =>  {
                        if (recordElem.scrollTop + recordElem.clientHeight >= recordElem.scrollHeight) {
                            recordPage = recordPage + 1;
                            this.rechargeDataProcess.getRechargeRecordData('record_infinite',recordPage);
                        }
                    });
                    break;
                case 'financial':
                    this.htmlLoader.getInnerElementById("recharge_top_img").style.display ='none';
                    let financialPage = 1;
                    this.htmlLoader.getInnerElementById("financial_infinite").remove();
                    let financial_infinite = document.createElement('div');
                    financial_infinite.setAttribute('id','financial_infinite');
                    this.htmlLoader.getInnerElementById("financial").appendChild(financial_infinite);

                    let timeElem = this.htmlLoader.getInnerElementById("financial_infinite");
                    timeElem.addEventListener('scroll', (event) =>  {
                        if (timeElem.scrollTop + timeElem.clientHeight >= timeElem.scrollHeight) {

                            financialPage = financialPage + 1;
                            
                            let selectTime = this.htmlLoader.getInnerElementById("timecontent").value;
                            let selectType = this.htmlLoader.getInnerElementById("typecontent").value;
                           
                            let typeRecordObj = {
                                "date": selectTime,
                                "paymentItemList":  [Number(selectType)],
                                "page": financialPage,
                                "count": 6
                            }

                            if(typeRecordObj.paymentItemList[0] === 1 && typeRecordObj.paymentItemList.length === 1){
                                typeRecordObj.paymentItemList =  this.getCashFlow;
                            }
                            if((this.financialMemoryType !== selectType || this.financialMemorySelectTime !== selectTime) && financialPage !== 2){
                                financialPage = 1;
                            }
                            this.financialMemorySelectTime = selectTime;
                            this.financialMemoryType = selectType;
                            this.rechargeDataProcess.getFinancialRecordData(typeRecordObj,financialPage,false);
                        }
                    });
                    this.createItemAll(cityName,bkImg,container2,financialPage,true);
                    break;
                default:
                    break;
            }

        }
    getFinancialList(cityName,bkImg,container2){
        let financialPage = 1;
        let financialRecordObj = {
                "date": this.getSystmeData(0),
                "paymentItemList": this.getCashFlow,
                "page": financialPage,
                "count": 6
        }

        this.clearRecord();
        this.rechargeDataProcess.getFinancialRecordData(financialRecordObj,financialPage,true);
        this.changeHoverImage(cityName);
        bkImg.setAttribute("src","@../../../../assets/recharge/pay_popup11.png");
        container2.style.display = "none";
    }
  

    openInner(evt, cityName) {
        let leftDiv = this.htmlLoader.getInnerElementByClassName("leftcontent");
        let aboveDiv = this.htmlLoader.getInnerElementByClassName("tabcontent");
        let i, tabcontent, tablinks;

        for(let j = 0; j < leftDiv.length; j++){
            leftDiv[j].style.display = "none";
        }

        for(let x = 0; x < aboveDiv.length; x++){
            aboveDiv[x].style.display = "none";
        }
                tabcontent = this.htmlLoader.getInnerElementByClassName("tabrecordcontent");
                for (i = 0; i < tabcontent.length; i++) {
                    tabcontent[i].style.display = "none";
            }
                tablinks = this.htmlLoader.getInnerElementByClassName("innerlinks");
            for (i = 0; i < tablinks.length; i++) {
                tablinks[i].className = tablinks[i].className.replace(" active", "");
            }
                this.htmlLoader.getInnerElementById(cityName).style.display = "block";
                evt.currentTarget.className += " active";
                
            if(cityName == "recordinner"){
                    this.clearRecord();
                    let recordInnerPage = 1;
                    this.rechargeDataProcess.getRechargeRecordData('record_infinite_inner',recordInnerPage);
                    let recordInnerElem = this.htmlLoader.getInnerElementById("record_infinite_inner");
                    recordInnerElem.addEventListener('scroll', () =>  {
                        if (recordInnerElem.scrollTop + recordInnerElem.clientHeight >= recordInnerElem.scrollHeight) {
                            recordInnerPage = recordInnerPage + 1;
                            this.rechargeDataProcess.getRechargeRecordData('record_infinite_inner',recordInnerPage);
                        }
                    });
            }else if(cityName == "withdrawalinner"){
                this.clearRecord();
                let withdrawalPage = 1;
                let withdrawalElem = this.htmlLoader.getInnerElementById("withdrawal_infinite");
                    withdrawalElem.addEventListener('scroll', () =>  {
                    if (withdrawalElem.scrollTop + withdrawalElem.clientHeight >= withdrawalElem.scrollHeight) {
                        withdrawalPage = withdrawalPage + 1;
                        this.rechargeDataProcess.getWithdrawalRecordData(withdrawalPage);
                    }
                });
                this.rechargeDataProcess.getWithdrawalRecordData(withdrawalPage);

            }
        }

        openLeftBanner(evt, cityName) {
            let recordDiv = this.htmlLoader.getInnerElementByClassName("tabrecordcontent");
            let aboveDiv = this.htmlLoader.getInnerElementByClassName("tabcontent");
            let container2 = this.htmlLoader.getInnerElementById("container2");
            let i, tabcontent, tablinks;
            tabcontent = this.htmlLoader.getInnerElementByClassName("leftcontent");
                
                container2.style.display = "block";
            for(let j = 0; j < recordDiv.length; j++){
                    recordDiv[j].style.display = "none";
                }

            for(let x = 0; x < aboveDiv.length; x++){
                    aboveDiv[x].style.display = "none";
                }

                
            for (i = 0; i < tabcontent.length; i++) {
                        tabcontent[i].style.display = "none";
                }
                    tablinks = this.htmlLoader.getInnerElementByClassName("leftlinks");
            for (i = 0; i < tablinks.length; i++) {
                    tablinks[i].className = tablinks[i].className.replace(" active", "");
                }
            if( cityName !== 'rechargeType_companyDeposit'){  
                let leftMenuTarget = document.getElementById("loader").contentWindow.document.getElementsByClassName("payWay");
                for (i = 0; i < leftMenuTarget.length; i++) {
                    leftMenuTarget[i].className = leftMenuTarget[i].className.replace(" active", "");
                    leftMenuTarget[i].style.color = '';
                }         
                evt.currentTarget.className += " active";
                event.target.className += ' active';
            }

            this.htmlLoader.getInnerElementById(cityName).style.display = "block";
        }

      


    
        changeHoverImage(choceName){
            let rechargeBtn = this.htmlLoader.getInnerElementById("rechargeBtn");
            let withdrawalBtn = this.htmlLoader.getInnerElementById("withdrawalBtn");
            let recordBtn = this.htmlLoader.getInnerElementById("recordBtn");
            let financialBtn = this.htmlLoader.getInnerElementById("financialBtn");
            
            switch (choceName){
                case "recharge":
                    rechargeBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_01_hover.png");
                    withdrawalBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_02.png");
                    recordBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_03.png");
                    financialBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_04.png");
                    let clearActive = Array.from(document.getElementById("loader").contentWindow.document.getElementById("container2").children);
                    clearActive.forEach((element,index) => {
                        element.className = 'payWay';
                        element.style.color = '';
                        if(index == 0){
                            element.className = 'payWay active'
                            element.style.color = '#4f3e27';
                        }
                    });
                break;
                case "withdrawal":
                    rechargeBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_01.png");
                    withdrawalBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_02_hover.png");
                    recordBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_03.png");
                    financialBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_04.png");

                    break;
                case "record":
                    rechargeBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_01.png");
                    withdrawalBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_02.png");
                    recordBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_03_hover.png");
                    financialBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_04.png");

                    break;
                case "financial":
                    rechargeBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_01.png");
                    withdrawalBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_02.png");
                    recordBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_03.png");
                    financialBtn.setAttribute("src","@../../../../assets/recharge/pay_tab_04_hover.png");
                    break;
                default:
                break;
            }

        }

    onClickPay02() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width,
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/fast_recharge.html'
        }
        let component = new FastRechargeComponet(config);
        // this.htmlLoader.loaderElement.style.visibility="hidden";
        // this.htmlLoader.src="/src/pageView/recharge/fast_recharge.html";
        // this.htmlLoader.loaderElement.style.display="block";
    }

   showMsgDialog(msgCode,errColor){
        let show_msg = this.htmlLoader.getInnerElementById("show_msg")
        let show_lab1 = this.htmlLoader.getInnerElementById("show_labe1");
        let show_btn = this.htmlLoader.getInnerElementById("show_btn");
        let show_close = this.htmlLoader.getInnerElementById("close_amount");
    // let dialog_mes = document.getElementById("loader").contentWindow.document.getElementById("amount_msg");

        // dialog_mes.style.display = "none";
        show_msg.style.display = "block";
        show_lab1.innerHTML  = msgCode;
        show_lab1.color = errColor;

        show_btn.addEventListener("click",()=>{
            let show_msg = this.htmlLoader.getInnerElementById("show_msg");
            show_msg.style.display = "none";
        });
        show_close.addEventListener("click", ()=>{
            let show_msg = this.htmlLoader.getInnerElementById("show_msg");
            show_msg.style.display = "none";
        });

   }

   //稽核用訊息
   showithdrawAuditMsg(msgCode,errColor,status){
    let show_msg = this.htmlLoader.getInnerElementById("show_msg")
    let show_lab1 = this.htmlLoader.getInnerElementById("show_labe1");
    let show_btn = this.htmlLoader.getInnerElementById("show_btn");
    let show_close = this.htmlLoader.getInnerElementById("close_amount");
    // let dialog_mes = document.getElementById("loader").contentWindow.document.getElementById("amount_msg");
        // dialog_mes.style.display = "none";
        show_msg.style.display = "block";
        show_lab1.innerText = msgCode;
        show_lab1.color = errColor;

        show_btn.addEventListener("click",()=>{
            let show_msg = this.htmlLoader.getInnerElementById("show_msg");
            let hidden_view = this.htmlLoader.getInnerElementById("withdrawal_audit");
            let tab_content = this.htmlLoader.innerDocument.getElementsByClassName("tabcontent");
            let hidden_view2 = this.htmlLoader.getInnerElementById("withdrawal_message");

            if(status == 'stateHere'){
                show_msg.style.display = "none";
                return
            }

            for(let a = 0; a < tab_content.length; a++){
                tab_content[a].style.display = "block";
            }
            show_msg.style.display = "none";
            hidden_view.style.display = "none";
            hidden_view2.style.display = "none";

            
            let withdrawalBtn = this.htmlLoader.getInnerElementById("withdrawalBtn");
            let icon_close = this.htmlLoader.getInnerElementById("icon_close");
            icon_close.style.display = "block";
            withdrawalBtn.click();
              
        });
        show_close.addEventListener("click", ()=>{
            let show_msg = this.htmlLoader.getInnerElementById("show_msg");
            let hidden_view = this.htmlLoader.getInnerElementById("withdrawal_audit");
            let tab_content = this.htmlLoader.innerDocument.getElementsByClassName("tabcontent");
            let hidden_view2 = this.htmlLoader.getInnerElementById("withdrawal_message");
            for(let a = 0; a < tab_content.length; a++){
                tab_content[a].style.display = "block";
            }
                show_msg.style.display = "none";
                hidden_view.style.display = "none";
                hidden_view2.style.display = "none";
               
                let withdrawalBtn = this.htmlLoader.getInnerElementById("withdrawalBtn");
                let icon_close = this.htmlLoader.getInnerElementById("icon_close");
                icon_close.style.display = "block";
                withdrawalBtn.click();
               
        });

   }
    
   
    
    


    onClickWechatTransfer() {
        let wechat_transfer_close = this.htmlLoader.innerDocument.getElementById("wechat_transfer_close");
        let wechat_transfer = this.htmlLoader.innerDocument.getElementById("wechat_transfer");
        this.displayView("none");
        this.rechargeDataProcess.wechatTransferData()
        wechat_transfer.style.display = "block";
       


    }
    //提款前稽核
    getWithdrawalAuditData(withdrawalAuditObj){
        
        LobbyService.withdrawAudit(withdrawalAuditObj).then(respwithdrawalAuditData => {
            let withdrawalAuditDataList = respwithdrawalAuditData.data.data;
            if(respwithdrawalAuditData.data.code === '0000'){
                this.documentId = withdrawalAuditDataList.documentId;
                let showAudit = withdrawalAuditDataList.showAudit;
                let bankAccount = withdrawalAuditDataList.bankAccount;

                this.displayView("none");
                this.clearRecord();
                if(showAudit){
                    let withdrawal_audit = this.htmlLoader.innerDocument.getElementById("withdrawal_audit");
                    this.rechargeDataProcess.withdrawalAuditData(withdrawalAuditDataList,bankAccount);
                    withdrawal_audit.style.display = "block";
                }else{
                    let fee = withdrawalAuditDataList.fee;
                    this.onClickWithdrawalMessag(fee,bankAccount);
                }
                
            }else {
                
                let errorCode = `${respwithdrawalAuditData.data.message}`;
                this.showMsgDialog(errorCode,"#FF0000");
            }
        });
     }

    onClickWithdrawalCenter() {
        let withdrawalAmount = this.htmlLoader.innerDocument.getElementById("withdrawalAmount").value;

        let withdrawalAuditObj = {
                        "money": Number(withdrawalAmount),
                    }
       
        this.getWithdrawalAuditData(withdrawalAuditObj);


    }

    withdrawalAmountSubmit(){
        let withdrawal_amount_val = this.htmlLoader.getInnerElementById("withdrawal_amount").textContent;
        let withdrawal_fee_val = this.htmlLoader.getInnerElementById("withdrawal_fee").textContent;
        let withdrawal_paid_val = this.htmlLoader.getInnerElementById("withdrawal_paid").textContent;
        let withdrawal_safe = this.htmlLoader.getInnerElementById("withdrawal_safe").value;

        let withdrawalAmountObj = {
            "withdrawBalance": Number(withdrawal_amount_val),
             "fee": Number(withdrawal_fee_val),
             "finalBalance": Number(withdrawal_paid_val),
             "password": withdrawal_safe
        }
        
        LobbyService.withdraw(withdrawalAmountObj).then(respAmount => {
            let withdrawalData = respAmount.data.data;
            this.htmlLoader.getInnerElementById("withdrawal_safe").value = '';
            if(respAmount.data.code === '0000'){
                this.showithdrawAuditMsg("提款成功","#FFFFFF");
                this.updateUserBalence();
            }else {
                let errorCode = `${respAmount.data.message}`;
                this.showithdrawAuditMsg(errorCode,"#FF0000",'stateHere');
            }
        });
    }
    updateUserBalence(){
        let userData = this.scene.registry.get(Constant.REGISTRY_USER);
        PlayerService.info().then(playerRes => {
            const playerData = playerRes.data.data;
            if(playerRes.data.code === '0000'){
                userData.balance = playerData.balance;
                this.scene.registry.set(Constant.REGISTRY_USER, userData);
            }
        }).catch(err => {
            console.log(err);
            alert('Resource Error')
        });
    }
    onClickCancelWithdrawal(){
        let cancelObj = {
                "documentId": this.documentId
        }
        
        LobbyService.withdrawCancel(cancelObj).then(respCancel => {
            let cancelData = respCancel.data.data;

            if(respCancel.data.code === '0000'){
               this.showithdrawAuditMsg("取消成功","#FFFFFF");

            }else {
                
                let errorCode = `${respCancel.data.code} - ${respCancel.data.message}`;
                this.showithdrawAuditMsg(errorCode,"#FF0000");
            }
        });
    }

    onClickWithdrawalMessag(fee,bankAccount) {
        let message_close = this.htmlLoader.innerDocument.getElementById("withdrawal_message_close");
        let withdrawal_message = this.htmlLoader.innerDocument.getElementById("withdrawal_message");
        let withdrawal_audit = this.htmlLoader.innerDocument.getElementById("withdrawal_audit");
        let withdrawalAmount = this.htmlLoader.innerDocument.getElementById("withdrawalAmount").value;
        this.displayView("none");
        
        this.rechargeDataProcess.withdrawalMsgData(withdrawalAmount,fee,bankAccount);
        withdrawal_audit.style.display = "none";
        withdrawal_message.style.display = "block";
        message_close.addEventListener("click",()=>{
            let tab_content = this.htmlLoader.innerDocument.getElementsByClassName("tabcontent");
            let hidden_view2 = this.htmlLoader.getInnerElementById("withdrawal_message");
            for(let a = 0; a < tab_content.length; a++){
                tab_content[a].style.display = "none";
            }
                hidden_view2.style.display = "none";
                let withdrawal = this.htmlLoader.getInnerElementById("withdrawal");
                let icon_close = this.htmlLoader.getInnerElementById("icon_close");
                icon_close.style.display = "block";
                withdrawal.style.display = "block";
        });


    }

    displayView(viewCode){
        let left_content = this.htmlLoader.innerDocument.getElementsByClassName("leftcontent");
        let record_content = this.htmlLoader.innerDocument.getElementsByClassName("tabrecordcontent");
        let tab_content = this.htmlLoader.innerDocument.getElementsByClassName("tabcontent");
        let containder2 = this.htmlLoader.innerDocument.getElementById("container2");
        let icon_close = this.htmlLoader.innerDocument.getElementById("icon_close");
        let bank_deposit = this.htmlLoader.innerDocument.getElementById("bank_deposit");
        let bank_transfer = this.htmlLoader.innerDocument.getElementById("bank_transfer");
        let wechat_transfer = this.htmlLoader.innerDocument.getElementById("wechat_transfer");
        let withdrawal_audit = this.htmlLoader.innerDocument.getElementById("withdrawal_audit");
        let withdrawal_message = this.htmlLoader.innerDocument.getElementById("withdrawal_message");
        let wehcat_popup = this.htmlLoader.innerDocument.getElementById("wehcat_popup");

        

            for(let j = 0; j < left_content.length; j++){
                left_content[j].style.display = viewCode;
            }

            for(let x = 0; x < record_content.length; x++){
                record_content[x].style.display = viewCode;
            }

            for(let a = 0; a < tab_content.length; a++){
                tab_content[a].style.display = viewCode;
            }

            // containder1.style.display = viewCode;
            containder2.style.display = viewCode;
            icon_close.style.display = viewCode;
            bank_deposit.style.display = viewCode;
            bank_transfer.style.display = viewCode;
            wechat_transfer.style.display = viewCode;
            withdrawal_audit.style.display = viewCode;
            withdrawal_message.style.display = viewCode;            
            wehcat_popup.style.display = viewCode;


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
        // this.htmlLoader.visible = false;
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            htmlDynamicDom: this.htmlDynamicDom,
            payWayData : this.payWayData,
            width: DisplaySize.RechargeFrame.width,
            height: DisplaySize.RechargeFrame.height,
            src: '/src/pageView/recharge/financial_dealings.html'
        }
        let component = new FinancilDealingComponent(config);
    }
    

    validateMsg(id,message){
        let errMsg = this.htmlLoader.getInnerElementById(id);
            errMsg.style.display = "block";
            errMsg.style.color = "red";
            errMsg.innerHTML = message;
    }
    hideMsg(id){
        let errMsg = this.htmlLoader.getInnerElementById(id);
            errMsg.style.display = "none";
            errMsg.innerHTML = '';
    }

   



}

export default RechargeCenterComponent;