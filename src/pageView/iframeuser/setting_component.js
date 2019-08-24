
import DisplaySize from '../../common/display'

import InfoComponent from './info_component'
import BankComponent from './bank_component'
import BasicComponent from './basic_component'

import ChangeAvatarComponent from './change_avatar_component'
import ChangeNameComponent from './change_name_component'


/**
 * Making UserInfo basic.html page events and operations.
 */
class SettingComponent {
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
                    case 'user_tab_01':
                        this.onClickTab01();
                        break;
                    case 'user_tab_02':
                        this.onClickTab02();
                        break;
                    case 'user_tab_03':
                        this.onClickTab03();
                        break;
                    case 'user_tab_04':
                        this.onClickTab04();
                        break;
                    case 'change_avatar':
                        this.onClickChangeAvatar();
                        break;
                    case 'copy':
                        this.onClickCopy();
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
                    default:
                        break;
                }   //End switch
                
            });  //End click event

        });  //End load event
    }

    onClickClose() {
        this.htmlLoader.visible = false;
    }
    
    onClickTab01() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            width: DisplaySize.UserInfoChangeAvatar.width,
            height: DisplaySize.UserInfoChangeAvatar.height,
            src: '/src/pageView/iframeuser/basic.html'
        }
        let component = new BasicComponent(config);
    }
    
    onClickTab02() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            width: DisplaySize.UserInfoChangeAvatar.width,
            height: DisplaySize.UserInfoChangeAvatar.height,
            src: '/src/pageView/iframeuser/info.html'
        }
        let component = new InfoComponent(config);
    }
    
    onClickTab03() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            width: DisplaySize.UserInfoChangeAvatar.width,
            height: DisplaySize.UserInfoChangeAvatar.height,
            src: '/src/pageView/iframeuser/bank.html'
        }
        let component = new BankComponent(config);
    }
    
    onClickTab04() {
        //nothing
    }
    
    onClickChangeAvatar() {
        // this.htmlLoader.visible = false;
        const scene = this.scene;
        const htmlLoader = this.htmlLoader;
        const config = {
            scene,
            htmlLoader,
            width: DisplaySize.UserInfoChangeAvatar.width,
            height: DisplaySize.UserInfoChangeAvatar.height,
            src: '/src/pageView/iframeuser/change_avatar.html'
        }
        let changeAvatarComponent = new ChangeAvatarComponent(config);
    }
    
    onClickCopy() {
    }
    
    onClickEdit() {
        // this.htmlLoader.visible = false;
        const scene = this.scene;
        const htmlLoader = this.htmlLoader;
        const config = {
            scene,
            htmlLoader,
            width: DisplaySize.UserInfoChangeName.width,
            height: DisplaySize.UserInfoChangeName.height,
            src: '/src/pageView/iframeuser/change_name.html'
        }
        let changeNameComponent = new ChangeNameComponent(config);
    }
    
    onClickLoginKey() {
    }
    
    onClickSecurityKey() {
    }


}

export default SettingComponent;