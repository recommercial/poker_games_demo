
import DisplaySize from '../../common/display'
import BulletinData from '../../data/bulletin.data';

/**
 * Making UserInfo basic.html page events and operations.
 */
class BulletinTabComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.bulletinData = new BulletinData(config);
        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
        //    this.htmlLoader.visible = true;
               this.onClickPopularMessage();
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'popular_close':
                    case 'game_close':
                        this.onClickClose();
                        break;
                    case 'events_tab_01_hover':
                    case 'events_tab_01':
                        this.displayView("none");
                        this.onClickPopularMessage();
                        break;
                    case 'events_tab_02':
                    case 'events_tab_02_hover':
                        this.displayView("none");
                        this.onClickGameMessage();
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
    
    onClickGameMessage() {
        let gamMeessage = this.htmlLoader.innerDocument.getElementById("game_message");
            gamMeessage.style.display = "block";
            let jumpObj = {
                    "type": 2 
            }
            this.bulletinData.getJumpMsg(jumpObj);

    }
    onClickPopularMessage() {
        let popularMessage = this.htmlLoader.innerDocument.getElementById("popular_message");
            popularMessage.style.display = "block";
            let jumpObj = {
                "type": 1
            }
            this.bulletinData.getJumpMsg(jumpObj);

    }

    displayView(viewCode){
        let gamMeessage = this.htmlLoader.innerDocument.getElementById("game_message");
        let popularMessage = this.htmlLoader.innerDocument.getElementById("popular_message");

        
        gamMeessage.style.display = viewCode;
        popularMessage.style.display = viewCode;
    }
    




}

export default BulletinTabComponent;