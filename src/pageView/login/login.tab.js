
import DisplaySize from '../../common/display'
import PlayerService from '../../service/player-service'
import User from '../../entity/user'
import Constant from '../../common/constant'
import Avatar from '../../sprites/avatar/base'
import Auth from '../../common/auth'
import LobbyService from '../../service/lobby-service'
import playerService from '../../service/player-service';



/**
 * Making UserInfo basic.html page events and operations.
 */
class LoginComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        // this.htmlLoader.visible = false;
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();

        this.htmlLoader.loaderElement.addEventListener('load', () => {
            // this.htmlLoader.visible = true;
            let loginFrom = this.htmlLoader.getInnerElementById("login_from");
            loginFrom.style.display = "block";
            loginFrom.className = "lightbox";
            
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'login_close':
                    case 'register_close':
                    case 'forget_close' :
                        this.onClickClose();
                        break;
                    case 'login_btn1':
                            this.displayView("none");
                            this.onClickForgetPw();
                        break;
                    case 'login_btn2' :
                            this.createLoginObj();
                        break;
                    case 'login_btn3' : 
                            this.displayView("none");
                            this.onClickRegister();
                        break;
                    case 'register_code':
                        this.getRegisterCode();
                        break;
                    case 'forget_code':
                        this.getForgetCode();
                        break;
                    case 'register_btn' :
                        this.createRegisterObj();
                        break;
                    case 'forget_btn':
                        this.createForgetObj();
                        break;
                    
                    default:
                        break;
                }   //End switch
                
            });  //End click event
            this.htmlLoader.innerDocument.addEventListener('keypress', (event) => { 
                if(event.keyCode === 13){
                    switch (event.target.id) {
                        case 'login_input_pw' :
                                this.createLoginObj();
                            break;
                        default:
                            break;
                    }   //End switch
                }
                
            });  //End keypress event

        });  //End load event
    }

    onClickClose() {
        this.htmlLoader.visible = false;
        this.displayView("none");
    }

    onViewClose(closeView){
        closeView.style.display = "none";
    }
    
    onClickForgetPw() {
        let forgetForm = this.htmlLoader.innerDocument.getElementById("forget_from");
            forgetForm.style.display = "block";
        window.HtmlMask1.visible = true;
    }
    onClickRegister() {
        let registerFrom = this.htmlLoader.innerDocument.getElementById("register_from");
            registerFrom.style.display = "block";
        window.HtmlMask1.visible = true;
    }

    displayView(viewCode){
        // let loginFrom = this.htmlLoader.innerDocument.getElementById("login_from");
        // let registerFrom = this.htmlLoader.innerDocument.getElementById("register_from");
        // let forgetForm = this.htmlLoader.innerDocument.getElementById("forget_from");

        let loginFrom = this.htmlLoader.getInnerElementById("login_from");
        let registerFrom = this.htmlLoader.getInnerElementById("register_from");
        let forgetForm = this.htmlLoader.getInnerElementById("forget_from");
        loginFrom.style.display = viewCode;
        registerFrom.style.display = viewCode;
        forgetForm.style.display = viewCode;
        window.HtmlMask1.visible = viewCode === "none" ? false : true;
    }

    createLoginObj(){
        let accountVal = this.htmlLoader.getInnerElementById("login_input").value;
        let passwordVal = this.htmlLoader.getInnerElementById("login_input_pw").value;

        let loginData = {
            'pormotionCode': 'A0000001',
            'account': accountVal,
            'password': passwordVal
        }

        this.processLogin(loginData);

    }

    createRegisterObj(){
        let accountVal = this.htmlLoader.getInnerElementById("register_txt1").value;
        let registerCode = this.htmlLoader.getInnerElementById("register_txt2").value;
        let passwordVal = this.htmlLoader.getInnerElementById("register_txt3").value;
        let confirmPWVal = this.htmlLoader.getInnerElementById("register_txt4").value;
        let registerData = {
                "pormotionCode": "A0000001",
                "mobile": accountVal,
                "password": passwordVal,
                "confirmPW": confirmPWVal,
                "code": registerCode   
        }

        this.processRegister(registerData);

    }

    createForgetObj(){
        let accountVal = this.htmlLoader.getInnerElementById("forget_txt1").value;
        let forgetCode = this.htmlLoader.getInnerElementById("forget_txt2").value;
        let passwordVal = this.htmlLoader.getInnerElementById("forget_txt3").value;
        let confirmPWVal = this.htmlLoader.getInnerElementById("forget_txt4").value;
        
        let forgetData = {
            "pormotionCode": "A0000001",
            "mobile": accountVal,
            "password": passwordVal,
            "confirmPW": confirmPWVal,
            "code": forgetCode
        }

        this.processForgetpw(forgetData);
    }

    getRegisterCode(){
        let register_mobile = this.htmlLoader.getInnerElementById("register_code").value;

        let registerCodeObj = {
            "mobile": register_mobile,
        }
        this.getverificationCode(registerCodeObj);
    }

    getForgetCode(){
        let forget_mobile = this.htmlLoader.getInnerElementById("forget_txt1").value;

        let forgetCodeObj = {
            "mobile": forget_mobile,
        }
        this.getverificationCode(forgetCodeObj);
    }

    getverificationCode(codeObj){
        PlayerService.code(codeObj).then(respCode => {
            const codeData = respCode.data.data;
            if(respCode.data.code === '0000'){
                this.showDialog(codeData.code,"registerErrMsg");
            }else{
                let errorCode = `${respCode.data.code} - ${respCode.data.message}`;
                this.showDialog(errorCode,"registerErrMsg");
            }
           
        });
    }

    //註刪
    processRegister(registerData){
        //TODO: Getting more efficiently. Here are three tiers of callback...
        PlayerService.register(registerData).then(res => {
           if(res.data.code === '0000'){
               const resData = res.data.data;
               Auth.setToken(resData.token);        //set token in header
                //Balance
                PlayerService.balance().then(balanceRes => {
                   const balanceData = balanceRes.data.data;
                   Auth.setToken(balanceRes.token);
                   if(balanceRes.data.code === '0000'){
                       // Games
                       LobbyService.gameList().then(gamesRes => {
                           const gamesData = gamesRes.data.data;
                           if(gamesRes.data.code === '0000'){
                               let userData = new User({
                                   account: registerData.account,
                                   avatarKey: resData.image || Phaser.Utils.Array.GetRandom(Avatar.AllKeys),
                                   balance: balanceData.balance,
                                   pormotionCode: registerData.pormotionCode
                               });
                               this.scene.registry.set(Constant.REGISTRY_USER, userData);
                               this.scene.registry.set(Constant.REGISTRY_GAMES, gamesData);

                               //unregister event
                               this.scene.scale.off('resize', this.scene.resize, this.scene);
                               this.scene.scene.start('NewLobbyScene');
                               // document.getElementById("loader").remove();
                               this.htmlLoader.visible = false;
                               window.HtmlMask1.visible = false;
                           }
                       });
                       // End Games
                   }
               });
               //End Balance
           } else {
               
               let errorCode = `${res.data.code} - ${res.data.message}`;
               this.showDialog(errorCode,"registerErrMsg");
           }
       }).catch(err => {
           //htmlContext.innerHTML = err;
       })
   }

    //登入
    processLogin(loginData){
        //TODO: Getting more efficiently. Here are three tiers of callback...
        PlayerService.login(loginData).then(res => {

            if(res.data.code === '0000'){

                const resData = res.data.data;
                Auth.setToken(resData.token);        //set token in header
                //Balance
                PlayerService.info().then(playerRes => {
                    const playerData = playerRes.data.data;
                    // Auth.setToken(playerRes.token);
                    if(playerRes.data.code === '0000'){
                        // Games
                        LobbyService.gameList().then(gamesRes => {
                            const gamesData = gamesRes.data.data;
                            if(gamesRes.data.code === '0000'){
                                let userData = new User();
                                userData.account = playerData.account;
                                userData.avatarKey = playerData.image || Phaser.Utils.Array.GetRandom(Avatar.AllKeys);
                                userData.balance = playerData.balance;
                                userData.bankList = playerData.bankList;
                                userData.birthday = playerData.birthday;
                                userData.email = playerData.email;
                                userData.image = playerData.image;
                                userData.mobile = playerData.mobile;
                                userData.name = playerData.name;
                                userData.nickName = playerData.nickName;
                                userData.score = playerData.score;
                                userData.pormotionCode = loginData.pormotionCode;

                            
                                this.scene.registry.set(Constant.REGISTRY_USER, userData);
                                this.scene.registry.set(Constant.REGISTRY_GAMES, gamesData);

                                //unregister event
                                this.scene.scale.off('resize', this.scene.resize, this.scene);
                                this.scene.scene.start('NewLobbyScene');
                                // document.getElementById("loader").remove();
                                this.htmlLoader.visible = false;
                                window.HtmlMask1.visible = false;
                            }
                        });
                        // End Games
                    }
                });
                //End Balance
            } else {
                
                let errorCode = `${res.data.code} - ${res.data.message}`;
                this.showDialog(errorCode,"loginErrMsg");
            }
        }).catch(err => {
            //htmlContext.innerHTML = err;
        })
    }

    //忘記密碼
    processForgetpw(forgetpwData){
        //TODO: Getting more efficiently. Here are three tiers of callback...
        playerService.forgetpw(forgetpwData).then(res => {
           if(res.data.code === '0000'){
               const resData = res.data.data;
               this.showDialog("成功","forgetErrMsg");
           } else {
               
               let errorCode = `${res.data.code} - ${res.data.message}`;
               this.showDialog(errorCode,"forgetErrMsg");
           }
       }).catch(err => {
           //htmlContext.innerHTML = err;
       })
   }

    showDialog(errorCode,errId){
       let modal_errMsg = this.htmlLoader.getInnerElementById(errId);
       console.log("modal_errMsg",modal_errMsg);

       modal_errMsg.innerHTML = errorCode;
      
   }

    




}

export default LoginComponent;