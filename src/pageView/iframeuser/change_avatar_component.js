
import DisplaySize from '../../common/display'
import Constant from '../../common/constant'

import BasicComponent from './basic_component'

/**
 * Making UserInfo chnage_avatar_component.html page events and operations.
 */
class ChangeAvatarComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;

        this.AVATAR_KEY = {
            Woman: 'avatar_woman',
            Man: 'avatar_man'
        }
        this.gender = this.AVATAR_KEY.Woman;
        this.currentAvatarKey = this.scene.registry.get(Constant.REGISTRY_USER).avatarKey;

        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        // this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();

        this.htmlLoader.loaderElement.addEventListener('load', () => {
            this.htmlLoader.visible = true;
            this.showCheckAndAvatarList();

            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                this.onClickChoiceAvatar(event);
                switch (event.target.id) {
                    case 'icon_close':
                        this.onClickClose();
                        break;
                    case 'save':
                        this.onClickSave();
                        break;
                    case 'male':
                    case 'label_male':
                        this.onClickMale();
                        break;
                    case 'female':
                    case 'label_female':
                        this.onClickFemale();
                        break;
                    default:
                        break;
                }   //End switch
                
            });  //End click event

        });  //End load event
    }


    /**
     * events
     */

    onClickClose() {
        this.toBasic();
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

    onClickSave() {
        let user = this.scene.registry.get(Constant.REGISTRY_USER);
        user.avatarKey = this.currentAvatarKey;
        this.scene.registry.set(Constant.REGISTRY_USER, user);
        this.toBasic();
    }
    
    onClickMale() {
        this.gender = this.AVATAR_KEY.Man;
        this.showCheckAndAvatarList();
    }

    onClickFemale() {
        this.gender = this.AVATAR_KEY.Woman;
        this.showCheckAndAvatarList();
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

    toBasic() {
        const config = {
            scene: this.scene,
            htmlLoader: this.htmlLoader,
            width: DisplaySize.UserInfoChangeAvatar.width,
            height: DisplaySize.UserInfoChangeAvatar.height,
            src: '/src/pageView/iframeuser/basic.html'
        }
        let component = new BasicComponent(config);
    }
}

export default ChangeAvatarComponent;