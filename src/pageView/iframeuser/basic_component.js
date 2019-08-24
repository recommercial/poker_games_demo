
import DisplaySize from '../../common/display'
import Constant from '../../common/constant'
import Auth from '../../common/auth'

import InfoComponent from './info_component'
import BankComponent from './bank_component'
import SettingComponent from './setting_component'

import ChangeAvatarComponent from './change_avatar_component'
import ChangeNameComponent from './change_name_component'

import PlayerService from '../../service/player-service'
import PlayerBasic from '../../data/player.basic'
// import LoginComponent from '../login/login.tab';
import Utils from './../../common/util'

/**
 * Making UserInfo basic.html page events and operations.
 */
class BasicComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.prepareComponent();
        this._playerBasic = new PlayerBasic(config);
        this._editObj = {};
        this._userObj ={};
        this._infoObj ={};

        this.AVATAR_KEY = {
            Woman: 'avatar_woman',
            Man: 'avatar_man'
        }
        this.gender = this.AVATAR_KEY.Woman;
        this.currentAvatarKey = this.scene.registry.get(Constant.REGISTRY_USER).avatarKey;
        
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        
        
        this.htmlLoader.loaderElement.addEventListener('load', () => {
            this.initInfo();
            let tab01 = this.htmlLoader.getInnerElementById("user_tab_01");
            let tab02 = this.htmlLoader.getInnerElementById("user_tab_02");
            let tab03 = this.htmlLoader.getInnerElementById("user_tab_03");
            // console.log("tab01",tab01);
            // this.htmlLoader.visible = true;
            
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                this.onClickChoiceAvatar(event);
                // this.htmlLoader.visible = true;

                switch (event.target.id) {
                    case 'user_close':
                        this.onClickClose();
                        break;                
                    case 'name_close':
                        let nameView = this.htmlLoader.getInnerElementById("change_name_edit");
                        this.onColseView(nameView);
                        this.showInitView(tab01);
                            break;
                    case 'avatar_close':
                        let changeAvatarView = this.htmlLoader.getInnerElementById("change_avatar_type");
                        this.onColseView(changeAvatarView);
                        this.showInitView(tab01);
                        this.htmlLoader.width = DisplaySize.UserInfoChangeAvatar.width;
                        this.htmlLoader.height = DisplaySize.UserInfoChangeAvatar.height;
                        this.scene.scaleBox();
                            break;
                    case 'pass_close':
                        let changePasswordView = this.htmlLoader.getInnerElementById("change_password_login");
                        this.showInitView(tab01);
                        this.onColseView(changePasswordView);
                            break;

                    case 'secrue_close':
                        let passwordSecrueView = this.htmlLoader.getInnerElementById("change_password_secrue");
                        this.showInitView(tab01);
                        this.onColseView(passwordSecrueView);
                            break;
                    case 'real_close':
                        let realNameView = this.htmlLoader.getInnerElementById("real_name_edit");
                        this.onColseView(realNameView);
                        this.showInitView(tab02);
                            break;
                    case 'birthday_close':
                        let birthdayView = this.htmlLoader.getInnerElementById("set_birthday");
                        this.onColseView(birthdayView);
                        this.showInitView(tab02);
                            break;
                    case 'phone_close':
                        let phoneView = this.htmlLoader.getInnerElementById("bind_phone_number");
                        this.htmlLoader.getInnerElementById("input_phone_confirmnumber").value = '';
                        this.onColseView(phoneView);
                        this.showInitView(tab02);
                            break;
                    case 'email_close':
                        let emailView = this.htmlLoader.getInnerElementById("bind_email");
                        this.onColseView(emailView);
                        this.showInitView(tab02);
                            break;
                    case 'delete_close':
                    case 'delete_cancel':
                        let deleteBankView = this.htmlLoader.getInnerElementById("delete_bank_card");
                        this.onColseView(deleteBankView);
                        this.showInitView(tab03);
                            break;
                    case 'bank_card_close':
                        this.clearErrMsg("bank_err_msg");
                        this.clearErrMsg("bank_err_msg_name");
                        let bankCardView = this.htmlLoader.getInnerElementById("bind_bank_card");
                        this.onColseView(bankCardView);
                        this.showInitView(tab03);
                       break;
                    case 'user_tab_01':
                        this.openAbove(event,"root");
                        break;
                    case 'user_tab_02':
                        this.openAbove(event,"user_info");
                        this._playerBasic.getUserInfo();
                        break;
                    case 'user_tab_03':
                        this.openAbove(event,"bank");
                        this.htmlLoader.getInnerElementById("check_default").checked = true;
                        this._playerBasic.getBankCardInfo()
                        break;
                    case 'user_tab_04':
                        this.openAbove(event,"setting");
                        break;
                    case 'change_avatar':
                        this.onClickChangeAvatar();
                        break;
                    case 'copy':
                        let root = this.htmlLoader.getInnerElementById("root");
                        this.onClickCopy("copyIsCopyed",root,"label_account");
                        break;
                    case 'click_account':
                        let userInfo = this.htmlLoader.getInnerElementById("user_info");
                        this.onClickCopy("click_accountIsCopyed",userInfo,"input_account");
                        break;
                    case 'edit':
                        this.onClickEdit();
                        break;
                    case 'login_key':
                        this.onClickLoginKey();
                        break;
                    case 'security_key':
                        this.onClickSecurityKey();
                        break;
                    case 'click_name':
                        this.onClickRealName();
                        break;
                    case 'click_birthday':
                        this.onClickSetBirthday();
                        break;
                    case 'click_phonenumber':
                        this.onClickBindPhoneNumber();
                        break;
                    case 'click_email':
                        this.onClickBindEmail();
                        break;
                    case 'name_save':
                        let userName = this.htmlLoader.getInnerElementById("user_name").value;
                        let actionView = this.htmlLoader.getInnerElementById("change_name_edit");
                        this.clearErrMsg("name_err_msg");
                        if(userName === "" ||userName === "undefined"){
                            this.validateMsg("name_err_msg","姓名不可为空");
                            return;
                        }else if(Utils.validateNumber(userName)){
                            this.validateMsg("name_err_msg","姓名必须为文字");
                            return;
                        }
                        this._editObj.username = userName;
                        this._editObj.type = "0";
                        this._userObj.nickName = userName;
                        this.saveBasicData(this._editObj,this._userObj,actionView);
                        this.showInitView(tab01);
                        break;
                    case 'pass_save' :
                        let oldPassword = this.htmlLoader.getInnerElementById("input_password").value;
                        let newPassword = this.htmlLoader.getInnerElementById("input_newpassword").value;
                        let confirmPassword = this.htmlLoader.getInnerElementById("input_confirmpassword").value;
                        let changeview = this.htmlLoader.getInnerElementById("change_password_login");
                        this.clearErrMsg("password_err_msg");
                        if(oldPassword === "" ||oldPassword === "undefined"){
                            this.validateMsg("password_err_msg","原始密码不可为空");
                            return;
                        }else if(newPassword === "" ||newPassword === "undefined"){
                            this.validateMsg("password_err_msg","新密码不可为空");
                            return;
                        }else if(confirmPassword === "" ||confirmPassword === "undefined"){
                            this.validateMsg("password_err_msg","确认密码不可为空");
                            return;
                        }else if(!Utils.validateNumber(oldPassword)){
                            this.validateMsg("password_err_msg","原始密码不可为中文");
                            return;
                        }else if(!Utils.validateNumber(confirmPassword)){
                            this.validateMsg("password_err_msg","新密码不可为中文");
                            return;
                        }else if(!Utils.validateNumber(confirmPassword)){
                            this.validateMsg("password_err_msg","确认密码不可为中文");
                            return;
                        }
                        this._editObj.oldPassword =  oldPassword;
                        this._editObj.newPassword = newPassword;
                        this._editObj.confirmPassword = confirmPassword;
                        this._editObj.type = "2";
                        this.saveBasicData(this._editObj,this._userObj,changeview);
                        this.showInitView(tab01);
                        break;
                    case 'secrue_save' :
                        let secruePassword = this.htmlLoader.getInnerElementById("input_secrue_password").value.trim();
                        let secrueView = this.htmlLoader.getInnerElementById("change_password_secrue");
                        this.clearErrMsg("secrue_err_msg");
                        let reg = (/^[A-Za-z0-9_.]{6,16}$/);
                        if(reg.test(secruePassword) === false){
                            this.validateMsg("secrue_err_msg","请输入6~16英文、数字、点、下划线组合");
                            return;
                        }
                        if(secruePassword === "" ||secruePassword === "undefined"){
                            this.validateMsg("secrue_err_msg","安全密码不可为空");
                            return;
                        }else if(!Utils.validateNumber(secruePassword)){
                            this.validateMsg("secrue_err_msg","安全密码不可为中文");
                            return;
                        }
                        
                        this._editObj.secruePassword = secruePassword;
                        this._editObj.type = "3";
                        this.saveBasicData(this._editObj,this._userObj,secrueView);
                        this.showInitView(tab01);
                        break;
                    case 'avatar_save' :
                        this.onClickSave();
                        this.showInitView(tab01);
                        this.htmlLoader.width = DisplaySize.UserInfoChangeAvatar.width;
                        this.htmlLoader.height = DisplaySize.UserInfoChangeAvatar.height;
                        this.scene.scaleBox();
                        break;
                    case 'real_save' :
                        let real_name = this.htmlLoader.getInnerElementById("real_name").value;
                        let real_view = this.htmlLoader.getInnerElementById("real_name_edit");
                        if(real_name === "" ||real_name === "undefined"){
                            this.validateMsg("real_err_msg","姓名不可为空");
                            return;
                        }else if(Utils.validateNumber(real_name)){
                            this.validateMsg("real_err_msg","姓名必须为文字");
                            return;
                        }else if(!Utils.specialCharReg(real_name)){
                            this.validateMsg("real_err_msg","不可输入特殊字元");
                            return;
                        }
                        this.clearErrMsg("real_err_msg");
                        this._infoObj.type = "0";
                        this._infoObj.name = real_name;
                        this._userObj.name = real_name;
                        this.saveUserInfoData(this._infoObj,this._userObj,real_view);
                        this.showInitView(tab02);
                        break;
                    case 'birthday_save' :
                        let birthday = this.htmlLoader.getInnerElementById("birthday").value;
                        let birthday_view = this.htmlLoader.getInnerElementById("set_birthday");
                        this._infoObj.type = "1";
                        this._infoObj.birthday = new Date(birthday).getTime();
                        this._userObj.birthday = birthday;
                        this.saveUserInfoData(this._infoObj,this._userObj,birthday_view);
                        this.showInitView(tab02);
                        break;
                    case 'phone_save':
                        let account = this.htmlLoader.getInnerElementById("input_phone_account").value;
                        let phone = this.htmlLoader.getInnerElementById("input_phone_phonenumber").value;
                        let confirm_number = this.htmlLoader.getInnerElementById("input_phone_confirmnumber").value;
                        let phone_view = this.htmlLoader.getInnerElementById("bind_phone_number");
                        this.clearErrMsg("phone_err_msg");
                        this.clearErrMsg("capchaCode_err_msg");
                        if(phone === "" || phone === "undefined"){
                            this.validateMsg("phone_err_msg","手机号不可为空");
                            return;
                        }else if(!Utils.validateNumber(phone)){
                            this.validateMsg("phone_err_msg","手机号必须为数字");
                            return;
                        }else if(confirm_number === "" || confirm_number === "undefined"){
                            this.validateMsg("capchaCode_err_msg","验证码不可为空");
                            return;
                        }else if(!Utils.validateNumber(confirm_number)){
                            this.validateMsg("capchaCode_err_msg","验证码必须为数字");
                            return;
                        }
                        this._infoObj.type = "2";
                        this._infoObj.mobile = phone;
                        this._infoObj.captcha = confirm_number;
                        this._userObj.mobile = phone;
                        this.saveUserInfoData(this._infoObj,this._userObj,phone_view);
                        this.showInitView(tab02);
                        break;
                    case 'email_save':
                        let email = this.htmlLoader.getInnerElementById("input_email_phonenumber").value;
                        let email_view = this.htmlLoader.getInnerElementById("bind_email");
                        this.clearErrMsg("email_err_msg");
                        this.validateMsg("email_err_msg","邮箱不可为空");
                            if(email === "" || email === "undefined"){
                            return;
                        }else if(!Utils.validateEmail(email)){
                            this.validateMsg("email_err_msg","邮箱格式不符");
                            return;
                        }
                        this._infoObj.type = "3";
                        this._infoObj.email = email;
                        this._userObj.email = email;
                        this.saveUserInfoData(this._infoObj,this._userObj,email_view);
                        this.showInitView(tab02);
                        break;
                    case 'bank_card_save':
                        let input_bank_card_name = this.htmlLoader.getInnerElementById("input_bank_card_name").value.trim();
                        let bank_card_select_area = this.htmlLoader.getInnerElementById("bank_card_select_area").value;
                        let input_bank_card_cardnumber = this.htmlLoader.getInnerElementById("input_bank_card_cardnumber").value;
                        this.clearErrMsg("bank_err_msg");
                        this.clearErrMsg("bank_err_msg_name");
                        if(bank_card_select_area === "" || bank_card_select_area === "undefined" ){
                                this.validateMsg("bank_err_msg","开户地区不可为空");
                                return;
                        }else if(input_bank_card_cardnumber === "" || input_bank_card_cardnumber === "undefined"){
                                this.validateMsg("bank_err_msg","银行卡号不可为空");
                                return;
                        }else if(!Utils.validateNumber(input_bank_card_cardnumber)){
                                this.validateMsg("bank_err_msg","银行卡号必须为数字");
                                return;              
                        }else if(input_bank_card_name === ''){
                                this.validateMsg("bank_err_msg_name","姓名不可为空");
                                return;             
                        }else if(Utils.validateNumber(input_bank_card_name)){
                                this.validateMsg("bank_err_msg_name","姓名必须为文字");
                                return;
                        }
                        this.saveBankCardData(this._userObj);
                        this.showInitView(tab03);
                        break;
                    case 'bank_card_update':
                        let bank_card_area_up = this.htmlLoader.getInnerElementById("bank_card_select_area").value;
                        let input_bank_card_up = this.htmlLoader.getInnerElementById("input_bank_card_cardnumber").value;
                        this.clearErrMsg("bank_err_msg");
                        if(bank_card_area_up === "" || bank_card_area_up === "undefined" ){
                                    this.validateMsg("bank_err_msg","开户地区不可为空");
                                    return;
                        }else if(input_bank_card_up === "" || input_bank_card_up === "undefined"){
                                    this.validateMsg("bank_err_msg","银行卡号不可为空");
                                    return;
                        }else if(!Utils.validateNumber(input_bank_card_up)){
                                    this.validateMsg("bank_err_msg","银行卡号必须为数字");
                                    return;
                        }     
                        this.updateBankCardData(this._userObj);
                        this.showInitView(tab03);
                        break;
                    case 'delete_save':
                        let deleteView = this.htmlLoader.getInnerElementById("delete_bank_card");
                        this.deleteBankCardData(this._userObj,deleteView);
                        this.showInitView(tab03);
                        break;
                    case 'click_defaultcard':
                            tab03.click(); 
                        break;
                    case 'add': 
                        //新增銀行卡
                        this.htmlLoader.width = DisplaySize.UserInfoBasic.width+120;
                        this.htmlLoader.height = DisplaySize.UserInfoBasic.height;
                        this.scene.scaleBox();
                        this.onClickBindBankCard();
                        break;
                    case 'male':
                    case 'label_male':
                        this.onClickMale();
                        break;
                    case 'female':
                    case 'label_female':
                        this.onClickFemale();
                        break;
                    case 'basic_switch_on':
                    case 'basic_switch_off':
                        this.switchMusicToggle(event);
                        break;
                    case 'basic_switch_account':
                        this.switchAccount();
                        break;
                    case 'get_confirmnumber':
                        this.getConfirmCode();
                        break;
                    default:
                        break;
                }   //End switch
                
            });  //End click event
            this.htmlLoader.innerDocument.addEventListener('change', (event) => { 
                switch (event.target.id) {
                    case 'basic_music_icon':    
                    case 'basic_voice_icon':
                        this.showVal(event);
                        break;
                    case 'bank_card_select_region':
                        let region_id = this.htmlLoader.getInnerElementById("bank_card_select_region").value;
                        this._playerBasic.getAreaList(region_id);
                        break;
                    default:
                        break; 
                }             
            });  //End change event
            this.htmlLoader.innerDocument.addEventListener('input', (event) => { 
                switch (event.target.id) {
                    case 'basic_music_icon':   
                    case 'basic_voice_icon':
                        this.showVal(event);
                        break;
                    default:
                        break; 
                }             
            });  //End input event

            let userTab01 = this.htmlLoader.getInnerElementById("user_tab_01");
            userTab01.click();
        });  //End load event
    }

    clearErrMsg(id){
        let errMsg = this.htmlLoader.getInnerElementById(id);
            errMsg.style.display = "none";
    }

    changeHoverImage(choceName){
        let userTab01 = this.htmlLoader.getInnerElementById("user_tab_01");
        let userTab02 = this.htmlLoader.getInnerElementById("user_tab_02");
        let userTab03 = this.htmlLoader.getInnerElementById("user_tab_03");
        let userTab04 = this.htmlLoader.getInnerElementById("user_tab_04");
        
        switch (choceName){
            case "root":
            userTab01.setAttribute("src","@../../../../assets/iframeuser/user_tab_01_hover.png");
            userTab02.setAttribute("src","@../../../../assets/iframeuser/user_tab_02.png");
            userTab03.setAttribute("src","@../../../../assets/iframeuser/user_tab_03.png");
            userTab04.setAttribute("src","@../../../../assets/iframeuser/user_tab_04.png");

            break;
            case "user_info":
                userTab01.setAttribute("src","@../../../../assets/iframeuser/user_tab_01.png");
                userTab02.setAttribute("src","@../../../../assets/iframeuser/user_tab_02_hover.png");
                userTab03.setAttribute("src","@../../../../assets/iframeuser/user_tab_03.png");
                userTab04.setAttribute("src","@../../../../assets/iframeuser/user_tab_04.png");

                break;
            case "bank":
                userTab01.setAttribute("src","@../../../../assets/iframeuser/user_tab_01.png");
                userTab02.setAttribute("src","@../../../../assets/iframeuser/user_tab_02.png");
                userTab03.setAttribute("src","@../../../../assets/iframeuser/user_tab_03_hover.png");
                userTab04.setAttribute("src","@../../../../assets/iframeuser/user_tab_04.png");

                break;
            case "setting":
                userTab01.setAttribute("src","@../../../../assets/iframeuser/user_tab_01.png");
                userTab02.setAttribute("src","@../../../../assets/iframeuser/user_tab_02.png");
                userTab03.setAttribute("src","@../../../../assets/iframeuser/user_tab_03.png");
                userTab04.setAttribute("src","@../../../../assets/iframeuser/user_tab_04_hover.png");

                let music_val = 0;
                let voice_val = 0;
                if(localStorage.getItem('volume') === null){
                    music_val = 100;
                }else{
                    music_val = (Number(localStorage.getItem('volume'))*100);
                    // if(this.scene.sound.getVolume === 0 ){
                    //     music_val = (Number(localStorage.getItem('volumeLast'))*100);
                    // }
                }

                if(music_val === 0){
                    this.htmlLoader.getInnerElementById('basic_switch_off').className = 'switch_off';
                }
                if(this.htmlLoader.getInnerElementById('basic_switch_off').className === 'switch_off'){
                    music_val = 0;
                }
                this.htmlLoader.getInnerElementById('basic_music_icon').value = music_val;
                this.htmlLoader.getInnerElementById('basic_user_voiceBar').style.width = music_val*8+'px';
                // this.htmlLoader.getInnerElementById('basic_user_musicBar').style.width = (Number(localStorage.getItem('volume'))*800)+'px' || 800+'px';
                // this.htmlLoader.getInnerElementById('basic_voice_icon').value = (Number(localStorage.getItem('volume'))*100) || 100;
                break;
            default:
            break;
        }

    }

    onClickSave() {
        let user = this.scene.registry.get(Constant.REGISTRY_USER);
        if(this.gender === this.AVATAR_KEY.Woman){
            this._editObj.gender = "F";
        }else {
            this._editObj.gender = "M";
        }
        user.avatarKey = this.currentAvatarKey;
        user.gender =  this._editObj.gender;
        user.image = this.currentAvatarKey;

        this._editObj.type = "1";
        this._editObj.imageId = user.image;
        this._userObj = user;
    
       this.saveBasicData(this._editObj, this._userObj);
    }

    saveBasicData(editObj,userObj,actionView){
        let basicObj = {
            "type": editObj.type || '',
            "nickName": editObj.username || '',
            "oldPWD": editObj.oldPassword || '',
            "newPWD": editObj.newPassword || '',
            "confirmPWD": editObj.confirmPassword || '',
            "securityCode": editObj.secruePassword || '',
            "oldSC": editObj.oldPassword || '',
            "newSC": editObj.newPassword || '',
            "confirmSC": editObj.confirmPassword || '',
            "gender":  editObj.gender || '',
            "imageId": editObj.imageId || ''
        }

        this._playerBasic.updatePlayerBasic(basicObj,userObj,actionView);
    }

    saveUserInfoData(infoObj,userObj,actionView){
        let basicObj = {
                "type": infoObj.type || '',
                "name": infoObj.name || '',
                "birthday": infoObj.birthday || '',
                "mobile": infoObj.mobile || '',
                "captcha": infoObj.captcha || '',
                "vcode": infoObj.vcode || '',
                "email": infoObj.email || '',
                "bankId": infoObj.bankId || '',
                "bankAccount": infoObj.bankcAccount || '',
                "regionId": infoObj.regionId || '',
                "cityId": infoObj.cityId || '',
                "isDefault": infoObj.isDefault
        }

        this._playerBasic.updateUserInfo(infoObj,userObj,actionView);
        this.htmlLoader.getInnerElementById("input_phone_confirmnumber").value = '';
    }

    saveBankCardData(userObj){
        let bank_card_select_bank = this.htmlLoader.getInnerElementById("bank_card_select_bank").value;
        let bank_card_select_area = this.htmlLoader.getInnerElementById("bank_card_select_area").value;
        let bank_card_select_region = this.htmlLoader.getInnerElementById("bank_card_select_region").value;
        let input_bank_card_cardnumber = this.htmlLoader.getInnerElementById("input_bank_card_cardnumber").value;
        let check_default = this.htmlLoader.getInnerElementById("check_default").checked;
       
        let addObj = {};
            addObj.bankId = bank_card_select_bank;
            addObj.regionId = bank_card_select_region;
            addObj.cityId = bank_card_select_area;
            addObj.accountNumber = input_bank_card_cardnumber;
            addObj.isDefault = check_default;

        let bankCardObj = {
            "addBankInfos": [
              {
                "id": addObj.id || '',
                "isDefault": addObj.isDefault,
                "bankId": addObj.bankId,
                "regionId": addObj.regionId,
                "cityId": addObj.cityId,
                "accountNumber": addObj.accountNumber
              }
            ]
          }
          this._playerBasic.updateBankCard(bankCardObj,userObj,addObj,"1");
    }

    updateBankCardData(userObj){
        let bank_card_select_bank = this.htmlLoader.getInnerElementById("bank_card_select_bank").value;
        let bank_card_select_area = this.htmlLoader.getInnerElementById("bank_card_select_area").value;
        let bank_card_select_region = this.htmlLoader.getInnerElementById("bank_card_select_region").value;
        let input_bank_card_cardnumber = this.htmlLoader.getInnerElementById("input_bank_card_cardnumber").value;
        let bank_card_id = this.htmlLoader.getInnerElementById("bank_card_id").value;
        let check_default = this.htmlLoader.getInnerElementById("check_default").checked;
        let updateObj = {};
            updateObj.id = bank_card_id;
            updateObj.bankId = bank_card_select_bank;
            updateObj.regionId = bank_card_select_region;
            updateObj.cityId = bank_card_select_area;
            updateObj.accountNumber = input_bank_card_cardnumber;
            updateObj.isDefault = check_default;
        let bankCardObj = {
            "updateBankInfos": [
              {
                "id": updateObj.id || '',
                "isDefault": updateObj.isDefault,
                "bankId": updateObj.bankId || '',
                "regionId": updateObj.regionId || '',
                "cityId": updateObj.cityId | '',
                "accountNumber": updateObj.accountNumber || ''
              }
            ]
          }
          this._playerBasic.updateBankCard(bankCardObj,userObj,updateObj,"2");

    }

    deleteBankCardData(userObj,actionView){
        let delete_val = this.htmlLoader.getInnerElementById("delete_bankId").value;
        let deleteObj = {
            id :　delete_val
        }
        let deleteCardObj = {
            "deleteBankIds": [
                delete_val
            ]
          }
        this._playerBasic.deleteBankCardInfo(deleteCardObj,deleteObj,userObj,"3",actionView);

    }


    openAbove(evt, cityName) {
        let userPopup = this.htmlLoader.getInnerElementById("user_popup01");
        let userTab01 = this.htmlLoader.getInnerElementById("user_tab_01");
        let userTab02 = this.htmlLoader.getInnerElementById("user_tab_02");
        let userTab03 = this.htmlLoader.getInnerElementById("user_tab_03");
        let userTab04 = this.htmlLoader.getInnerElementById("user_tab_04");
        let userClose = this.htmlLoader.getInnerElementById("user_close");
        let i, tabcontent ,tablinks;
        this.displayView("none");
        userPopup.style.display = "block";
        userTab01.style.display = "block";
        userTab02.style.display = "block";
        userTab03.style.display = "block";
        userTab04.style.display = "block";
        userClose.style.display = "block";

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
            
            switch (cityName) {

                case 'root':
                    this.changeHoverImage('root');
                    break;   
                case 'user_info':
                    this.changeHoverImage('user_info');
                    break;
                case 'bank':
                    this.changeHoverImage('bank');
                    break;
                case 'setting':
                    this.changeHoverImage('setting');
                    break;
                default:
                    break;
            }

        }

        onClickMale() {
            this.gender = this.AVATAR_KEY.Man;
            this.showCheckAndAvatarList();
        }
    
        onClickFemale() {
            this.gender = this.AVATAR_KEY.Woman;
            this.showCheckAndAvatarList();
        }

        onClickChoiceAvatar(event) {
            if(event.target.className === 'choice_avatar') {
                // set currentAvatarKey string
                const avatarKey = event.target.id;
                const genderOrder = avatarKey.substring(avatarKey.lastIndexOf('_'));
                if(this.gender === this.AVATAR_KEY.Man) {
                    this.currentAvatarKey = 'circle_man' + genderOrder;
                } else {
                    this.currentAvatarKey = 'circle_woman' + genderOrder;
                }
                // show chosen image
                this.showChosen(event.target);
            }
        }

        showCheckAndAvatarList() {
            // change radio image
            const maleImg = this.htmlLoader.getInnerElementById('male');
            const femaleImg = this.htmlLoader.getInnerElementById('female');
            const rdoNo = this.htmlLoader.getInnerElementById('radio_no');
            const rdoYes = this.htmlLoader.getInnerElementById('radio_yes');
            if(this.gender === this.AVATAR_KEY.Man) {
                maleImg.src = rdoYes.src;
                femaleImg.src = rdoNo.src;
            } else {
                maleImg.src = rdoNo.src;
                femaleImg.src = rdoYes.src;
            }
    
            // change avatar list
            const allAvatarImages = this.htmlLoader.innerDocument.getElementsByClassName('for_data');
            const choiceAvatar = this.htmlLoader.innerDocument.getElementsByClassName('choice_avatar');
            let idx = 0;
            for (let i=0; i<allAvatarImages.length; i++) {
                const avatarImg = allAvatarImages[i];
                if(avatarImg.id.indexOf(this.gender) >= 0) {
                    choiceAvatar[idx].src = avatarImg.src;
                    idx++;
                }
            }
    
            //set init chosen
            const pickAvatar = this.htmlLoader.getInnerElementById('pick_avatar');
            pickAvatar.style.display = 'none';
            let chItem = this.findChosenItem();
            if(chItem){
                this.showChosen(chItem);
            } 
    
        }

        /**
         * inner function
         */
        showChosen(elem) {
            const pickAvatar = this.htmlLoader.getInnerElementById('pick_avatar');
            pickAvatar.style.display = 'block';
            pickAvatar.style.left = (elem.offsetLeft + elem.clientWidth - pickAvatar.clientWidth) + 'px';
            pickAvatar.style.top = (elem.offsetTop + elem.clientHeight - pickAvatar.clientHeight) + 'px';
        }

        findChosenItem() {
            //TODO: better method like specific id given each item...
            const avatarKey = this.currentAvatarKey;
            const genderStr = avatarKey.substring(avatarKey.indexOf('_') + 1, avatarKey.lastIndexOf('_'));
            const genderOrder = avatarKey.substring(avatarKey.lastIndexOf('_'));
            const item = this.htmlLoader.getInnerElementById('avatar' + genderOrder);
            // console.log('genderOrder:', genderOrder, 'avatar' + genderOrder, 'item:', item)
            if(genderStr === 'man' && this.gender === this.AVATAR_KEY.Man) {
                return item;
            } else if(genderStr === 'woman' && this.gender === this.AVATAR_KEY.Woman) {
                return item;
            } 
            return undefined;
        }


    initInfo() {
        const user = this.scene.registry.get(Constant.REGISTRY_USER);
        this._userObj = user;

        //show user avatar
        const user_avatar = this.htmlLoader.getInnerElementById('user_avatar');
        const avatarImages = this.htmlLoader.innerDocument.getElementsByClassName('for_data');
        const avatarKey = user.avatarKey.substring(user.avatarKey.indexOf('_'));
        let avatarUrl;
        for (let i=0; i<avatarImages.length; i++) {
            const avatarImg = avatarImages[i];
            if(avatarImg.id.indexOf(avatarKey) >=0 ) {
                avatarUrl = avatarImg.src;
                break;
            }
        }
        user_avatar.src = avatarUrl;

        //user account
        const label_account = this.htmlLoader.getInnerElementById('label_account');
        label_account.innerHTML = user.account || '';

        //nickname
        const label_nickname = this.htmlLoader.getInnerElementById('label_nickname');
        label_nickname.innerHTML = user.nickName || '';

        //wallet balance
        const label_wallet = this.htmlLoader.getInnerElementById('label_wallet');
        label_wallet.innerHTML = user.balance || '';

        //point score
        const label_points = this.htmlLoader.getInnerElementById('label_points');
        label_points.innerHTML = user.score || '0';
        
    }

    onClickClose() {
        this.htmlLoader.visible = false;
        window.HtmlMask1.visible = false;
    }

    showInitView(backView){
        let user_popup01 = this.htmlLoader.getInnerElementById("user_popup01");
        let user_close = this.htmlLoader.getInnerElementById("user_close");
        let user_tab_01 = this.htmlLoader.getInnerElementById("user_tab_01");
        let user_tab_02 = this.htmlLoader.getInnerElementById("user_tab_02");
        let user_tab_03 = this.htmlLoader.getInnerElementById("user_tab_03");
        let user_tab_04 = this.htmlLoader.getInnerElementById("user_tab_04");

            user_popup01.style.display = "block";
            user_close.style.display = "block";
            user_tab_01.style.display = "block";
            user_tab_02.style.display = "block";
            user_tab_03.style.display = "block";
            user_tab_04.style.display = "block";
            
            if(backView.id === 'user_tab_01'){
                this.htmlLoader.getInnerElementById("root").style.display = 'block';
            }
            if(backView.id === 'user_tab_02'){
                this.htmlLoader.getInnerElementById("user_info").style.display = 'block';
            }
            if(backView.id === 'user_tab_03'){
                this.htmlLoader.getInnerElementById("bank").style.display = 'block';
                this.htmlLoader.getInnerElementById("bank_infinite").style.display = 'block';
            }
    }

    onColseView(closeView){
        closeView.style.display = "none";
        // window.HtmlMask1.visible = false;
    }
    
    // onClickTab01() {
    //     //nothing
    // }
    
    // onClickTab02() {
    //     const config = {
    //         scene: this.scene,
    //         htmlLoader: this.htmlLoader,
    //         width: DisplaySize.UserInfoChangeAvatar.width,
    //         height: DisplaySize.UserInfoChangeAvatar.height,
    //         src: '/src/pageView/iframeuser/info.html'
    //     }
    //     let component = new InfoComponent(config);
    // }
    
    // onClickTab03() {
    //     const config = {
    //         scene: this.scene,
    //         htmlLoader: this.htmlLoader,
    //         width: DisplaySize.UserInfoChangeAvatar.width,
    //         height: DisplaySize.UserInfoChangeAvatar.height,
    //         src: '/src/pageView/iframeuser/bank.html'
    //     }
    //     let component = new BankComponent(config);
    // }
    
    // onClickTab04() {
    //     const config = {
    //         scene: this.scene,
    //         htmlLoader: this.htmlLoader,
    //         width: DisplaySize.UserInfoChangeAvatar.width,
    //         height: DisplaySize.UserInfoChangeAvatar.height,
    //         src: '/src/pageView/iframeuser/setting.html'
    //     }
    //     let component = new SettingComponent(config);
    // }
    
    onClickChangeAvatar() {
        //resize
        this.htmlLoader.width = DisplaySize.UserInfoChangeAvatar.width;
        this.htmlLoader.height = DisplaySize.UserInfoChangeAvatar.height;
        this.scene.scaleBox();

        let chageAvatarType = this.htmlLoader.getInnerElementById("change_avatar_type");
            this.displayView("none");
            chageAvatarType.style.display = "block";
            this.showCheckAndAvatarList();
           
    }

    onClickRealName(){
        let realNameEdit = this.htmlLoader.getInnerElementById("real_name_edit");
        let inputRelName = this.htmlLoader.getInnerElementById("input_name").value;
        let innerRelName = this.htmlLoader.getInnerElementById("real_name");
        console.log("inputRelName",inputRelName);
            this.displayView("none");
            realNameEdit.style.display = "block";
            innerRelName.value = inputRelName;
    }

    onClickSetBirthday(){
        let setBirthday = this.htmlLoader.getInnerElementById("set_birthday");
            this.displayView("none");
            setBirthday.style.display = "block";
    }
    onClickBindPhoneNumber(){
        const user = this.scene.registry.get(Constant.REGISTRY_USER);
        let bindPhoneNumber = this.htmlLoader.getInnerElementById("bind_phone_number");
        let phoneAccount = this.htmlLoader.getInnerElementById("input_phone_account");
        let phoneNumber = this.htmlLoader.getInnerElementById("input_phonenumber").value;
        let innerNumber = this.htmlLoader.getInnerElementById("input_phone_phonenumber");
            phoneAccount.value = user.account;
            this.displayView("none");
            bindPhoneNumber.style.display = "block";
            innerNumber.value = '';
    }

    onClickBindEmail(){
        const user = this.scene.registry.get(Constant.REGISTRY_USER);
        let bindEmail = this.htmlLoader.getInnerElementById("bind_email");
        let emailAccount = this.htmlLoader.getInnerElementById("input_email_account");
        let email =  this.htmlLoader.getInnerElementById("input_email").value;
        let innerEmail = this.htmlLoader.getInnerElementById("input_email_phonenumber");
            emailAccount.value = user.account;
            this.displayView("none");
            bindEmail.style.display = "block";
            innerEmail.value = email;
    }

    onClickBindBankCard(){
        const user = this.scene.registry.get(Constant.REGISTRY_USER);
        let name = this.htmlLoader.getInnerElementById("input_bank_card_name");
        let saveBtn = this.htmlLoader.getInnerElementById("bank_card_save");
        let bankCardTitle = this.htmlLoader.getInnerElementById("bank_card_title");
        let bindBankCard = this.htmlLoader.getInnerElementById("bind_bank_card");
        let updataBtn = this.htmlLoader.getInnerElementById("bank_card_update");
        let cardNo = this.htmlLoader.getInnerElementById("input_bank_card_cardnumber");
        let bankArea = this.htmlLoader.getInnerElementById("bank_card_select_area");

            this.displayView("none");
            bindBankCard.style.display = "block";
            bankCardTitle.src = "@../../../../assets/iframeuser/user_title_07.png";

            name.value = user.name;
            this._playerBasic.getBankList(1);
            this._playerBasic.getRegionList(1);
            this._playerBasic.getAreaList(1);
            saveBtn.style.display = "block";
            updataBtn.style.display = "none";
            cardNo.value = "";
    }

    onClickDeleteBankCard(){
        let deleteBankCard = this.htmlLoader.getInnerElementById("delete_bank_card");
        let cardNumber = this.htmlLoader.getInnerElementById("delete_name");
            this.displayView("none");
            deleteBankCard.style.display = "block";
    }


    displayView(viewCode){
        let user_content = this.htmlLoader.innerDocument.getElementsByClassName("usercontent");
        let userTab01 = this.htmlLoader.getInnerElementById("user_tab_01");
        let userTab02 = this.htmlLoader.getInnerElementById("user_tab_02");
        let userTab03 = this.htmlLoader.getInnerElementById("user_tab_03");
        let userTab04 = this.htmlLoader.getInnerElementById("user_tab_04");
        let changeAvatarType = this.htmlLoader.getInnerElementById("change_avatar_type");
        let changeNameEdit = this.htmlLoader.getInnerElementById("change_name_edit");
        let userPopup = this.htmlLoader.getInnerElementById("user_popup01");
        let changePasswordLogin = this.htmlLoader.getInnerElementById("change_password_login");
        let changePasswordSecrue = this.htmlLoader.getInnerElementById("change_password_secrue");
        let realNameEdit = this.htmlLoader.getInnerElementById("real_name_edit");
        let setBirthday = this.htmlLoader.getInnerElementById("set_birthday");
        let bindPhoneNumber = this.htmlLoader.getInnerElementById("bind_phone_number");
        let bindEmail = this.htmlLoader.getInnerElementById("bind_email");
        let bindBankCard = this.htmlLoader.getInnerElementById("bind_bank_card");
        let deleteBankCard = this.htmlLoader.getInnerElementById("delete_bank_card");


        let userClose = this.htmlLoader.getInnerElementById("user_close");

        

        

            for(let j = 0; j < user_content.length; j++){
                user_content[j].style.display = viewCode;
            }
            userTab01.style.display = viewCode;
            userTab02.style.display = viewCode;
            userTab03.style.display = viewCode;
            userTab04.style.display = viewCode;
            changeAvatarType.style.display = viewCode;
            changeNameEdit.style.display = viewCode;
            userPopup.style.display = viewCode;
            changePasswordLogin.style.display = viewCode;
            changePasswordSecrue.style.display = viewCode;
            userClose.style.display = viewCode;
            realNameEdit.style.display = viewCode;
            setBirthday.style.display = viewCode;
            bindPhoneNumber.style.display = viewCode;
            bindEmail.style.display = viewCode;
            bindBankCard.style.display = viewCode;
            deleteBankCard.style.display = viewCode;

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
    
    onClickEdit() {
        let chageAvatarType = this.htmlLoader.getInnerElementById("change_name_edit");
        let nickName = this.htmlLoader.getInnerElementById("label_nickname").textContent;
        let user_name = this.htmlLoader.getInnerElementById("user_name");
            user_name.value = nickName;
            this.displayView("none");
            chageAvatarType.style.display = "block";
    }
    
    onClickLoginKey() {
        let changePasswordLogin = this.htmlLoader.getInnerElementById("change_password_login");
            this.displayView("none");
            changePasswordLogin.style.display = "block";
    }
    
    onClickSecurityKey() {
        let changePasswordSecrue = this.htmlLoader.getInnerElementById("change_password_secrue");
            this.displayView("none");
            changePasswordSecrue.style.display = "block";
    }
    switchMusicToggle(event){
        let doc_id = event.target.id;
        let class_name = event.target.className;

        let current_id = '';
        let current_bar = '';

        if(doc_id === 'basic_switch_off'){
            current_id = 'basic_music_icon';
            current_bar = 'basic_user_voiceBar';
            let currntMusic = Number(localStorage.getItem('volume'));
            let currntVoice = Number(localStorage.getItem('volume'));
            if(currntMusic === 0){
                currntMusic = Number(localStorage.getItem('volumeLast'));
                localStorage.setItem('volume',currntMusic);
            }
            if(class_name === 'switch_off'){
                this.htmlLoader.getInnerElementById(doc_id).className = 'switch_on';
                if(localStorage.getItem('volume') === null){
                    this.scene.sound.setVolume(1);
                }else{
                    this.scene.sound.setVolume(currntMusic);
                }
                this.htmlLoader.getInnerElementById(current_id).value = 100*currntMusic;            
                this.htmlLoader.getInnerElementById(current_bar).style.width = 800*currntMusic+'px';
                this.scene.sound.setVolume(currntMusic);
            }else{
                this.htmlLoader.getInnerElementById(doc_id).className = 'switch_off';
                this.htmlLoader.getInnerElementById(current_id).value = 0;            
                this.htmlLoader.getInnerElementById(current_bar).style.width = 0+'px';            
                this.scene.sound.setVolume(0);
                localStorage.setItem('volumeLast',currntMusic);
                localStorage.setItem('volume',0);
                // if(currntMusic !== 0){
                // }
                    
            }
        }else{
            current_id = 'basic_voice_icon';
            current_bar = 'basic_user_musicBar';
            if(class_name === 'switch_off'){
                this.htmlLoader.getInnerElementById(doc_id).className = 'switch_on';
                this.htmlLoader.getInnerElementById(current_id).value = 100;            
                this.htmlLoader.getInnerElementById(current_bar).style.width = 800+'px';
                // if(localStorage.getItem('volume') === null){
                //     this.scene.sound.setVolume(1);
                // }else{
                //     this.scene.sound.setVolume(Number(localStorage.getItem('volume')));
                // }    
            }else{
                this.htmlLoader.getInnerElementById(doc_id).className = 'switch_off';
                this.htmlLoader.getInnerElementById(current_id).value = 0;            
                this.htmlLoader.getInnerElementById(current_bar).style.width = 0+'px';            
                // this.scene.sound.setVolume(0);
            }
        }
    }

    validateMsg(id,message){
        let errMsg = this.htmlLoader.getInnerElementById(id);
            errMsg.style.display = "block";
            errMsg.style.color = "red";
            errMsg.innerHTML = message;
    }

    showVal(event){
        let target = event.target;
        let val = event.target.value;
        let music_val = undefined;
        let voice_val = undefined;
        music_val = ((val * 8)/ 800);

        if(target.id === 'basic_music_icon'){
            this.htmlLoader.getInnerElementById('basic_user_voiceBar').style.width = val * 8+'px';
            if( Number(this.htmlLoader.getInnerElementById('basic_music_icon').value )=== 0){
                this.htmlLoader.getInnerElementById('basic_switch_off').className ='switch_off';
            }else{
                this.htmlLoader.getInnerElementById('basic_switch_off').className ='switch_on';
            }
            localStorage.setItem('volume',music_val);
            this.scene.sound.setVolume(music_val);
        }else{
            this.htmlLoader.getInnerElementById('basic_user_musicBar').style.width = val * 8+'px';
            if( Number(this.htmlLoader.getInnerElementById('basic_voice_icon').value) === 0){
                this.htmlLoader.getInnerElementById('basic_switch_on').className ='switch_off';
            }else{
                this.htmlLoader.getInnerElementById('basic_switch_on').className ='switch_on';
            }
            voice_val = ((val * 8)/ 800);            
        }
        // music
        // voice ??

    }
    switchAccount(){
        // let self = this.scene;
        // let config = {
        //     scene: self,
        //     htmlLoader: this.htmlLoader,
        //     width: DisplaySize.LoginFrame.width,
        //     height: DisplaySize.LoginFrame.height,
        //     src: './src/pageView/login/login_tab.html'
        // }
        // window.HtmlMask1.visible = false;
        
        // this.htmlLoader.visible = false;
        // self.scale.off('resize', self.resize, self);
        // self.registry.events.off('changedata', self.updateUserInfo, self);
        // self.scene.stop('NewLobbyScene');
        // self.scene.start('LoginScene');
        // let loginBasic = new LoginComponent(config);

        Utils.delCookie(Auth.COOKIE_NAME);
        location.reload();
    }
    getConfirmCode(){
        let codeObj = {
            mobile :this.htmlLoader.getInnerElementById('input_phone_phonenumber').value.trim()
        };
        if(codeObj.mobile === '' || isNaN(Number(codeObj.mobile)) === true){
            this.showDialog('手机号错误',"phone_err_msg");
            return
        }
        this.clearErrMsg("phone_err_msg");
        PlayerService.code(codeObj).then(respCode => {
            const codeData = respCode.data.data;
            if(respCode.data.code === '0000'){                
                this.htmlLoader.getInnerElementById('input_phone_confirmnumber').value = codeData.code;
            }else{
                let errorCode = `${respCode.data.code} - ${respCode.data.message}`;
                this.showDialog(errorCode,"phone_err_msg");
            }
           
        });
    };
    showDialog(errorCode,errId){
        let modal_errMsg = this.htmlLoader.getInnerElementById(errId);
        modal_errMsg.style.display = 'block';
        modal_errMsg.innerHTML = errorCode;       
    }                    


}

export default BasicComponent;