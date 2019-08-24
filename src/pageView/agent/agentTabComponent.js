import agentData from '../../data/agent.data';
import DisplaySize from '../../common/display'

/**
 * Making UserInfo basic.html page events and operations.
 */
class AgentTabComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.agentData = new agentData(config);
        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.width = DisplaySize.AgentFrame.width;
        this.htmlLoader.height = DisplaySize.AgentFrame.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
        //    this.htmlLoader.visible = true;
            this.onClickMyPromotion();
            let agentTab01 = this.htmlLoader.getInnerElementById("agent_tab_01");
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'icon_close':
                        this.onClickClose();
                        break;
                    case 'icon_close_extract':
                            agentTab01.click();
                        break;
                    case 'icon_close_msg_help':
                            agentTab01.click();
                        break;
                    case 'agent_tab_01':
                        this.displayView("none");
                        this.onClickMyPromotion();
                        break;
                    case 'agent_tab_02':
                        this.displayView("none");
                        this.onClickAgentPromotion();
                        break;
                    case 'agent_tab_03':
                        this.displayView("none");
                        this.onClickPromotionTutorial();
                        break;
                    case 'agent_tab_04':
                        this.displayView("none");
                        this.onClickpromotionWeeklyRank();
                        break;
                    case 'agent_icon_getRecord' :
                         this.displayView("none");
                         this.onClickExtractRecord();
                         break;
                    case 'agent_icon_help':
                        this.displayView("none");
                        this.onClickMsgHelp();
                        break;
                    case 'agent_icon_getGift':
                        this.agentData.getBonusEvent();
                        break;
                    case 'agent_QRCode_300x300':
                        this.agentData.showQRcode('showQRcode');
                        break;
                    case 'getBonus_close':
                    case 'getBonus_confirm':
                        this.agentData.showMsgDialog(false);
                        break;
                    case 'showQRcode_close':
                            this.htmlLoader.getInnerElementById("showQRcode").style.display = 'none';
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
    
    onClickAgentPromotion() {
        let agentPromo = this.htmlLoader.innerDocument.getElementById("agent_promo");
            agentPromo.style.display = "block";
            this.agentData.prmoteDetail();
    }
    onClickMyPromotion() {
        let myPromotion = this.htmlLoader.innerDocument.getElementById("my_promotion");
            myPromotion.style.display = "block";
            this.agentData.getPromotionInfo();
    }
    onClickPromotionTutorial() {
        let promotionTutorial = this.htmlLoader.innerDocument.getElementById("promotion_tutorial");
            promotionTutorial.style.display = "block";
    }

    onClickpromotionWeeklyRank() {
        let promotionWeeklyRank = this.htmlLoader.innerDocument.getElementById("promotion_weekly_rank");
            promotionWeeklyRank.style.display = "block";
            this.agentData.getWeeklyRank();
    }

    onClickExtractRecord() {
        let extractRecord = this.htmlLoader.innerDocument.getElementById("extract_record");
            extractRecord.style.display = "block";
            this.agentData.getHistory();
    }

    onClickMsgHelp() {
        let msgHelp = this.htmlLoader.getInnerElementById("msg_help")
            msgHelp.style.display = "block";
    }

   

    

    displayView(viewCode){
        let myPromotion = this.htmlLoader.innerDocument.getElementById("my_promotion");
        let promotionTutorial = this.htmlLoader.innerDocument.getElementById("promotion_tutorial");
        let promotionWeeklyRank = this.htmlLoader.innerDocument.getElementById("promotion_weekly_rank");
        let extractRecord  = this.htmlLoader.getInnerElementById("extract_record");
        let msgHelp = this.htmlLoader.getInnerElementById("msg_help")
        let agentPromo =  this.htmlLoader.getInnerElementById("agent_promo");



        
        myPromotion.style.display = viewCode;
        promotionTutorial.style.display = viewCode;
        promotionWeeklyRank.style.display = viewCode;
        extractRecord.style.display = viewCode;
        msgHelp.style.display = viewCode;
        agentPromo.style.display = viewCode;
    }
    




}

export default AgentTabComponent;