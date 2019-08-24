
import DisplaySize from '../../common/display'

/**
 * Making UserInfo basic.html page events and operations.
 */
class PromotionTabComponent {
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
        this.htmlLoader.width = DisplaySize.PromoteFrame.width;
        this.htmlLoader.height = DisplaySize.PromoteFrame.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
        //    this.htmlLoader.visible = true;
           let titleDetail = this.htmlLoader.getInnerElementById("detail_promo");
               titleDetail.style.display = "block";
           // Detect when scrolled to bottom.

            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'icon_close_detail':
                        this.onClickClose();
                        break;
                    case 'promote_tab_01_detail':
                            this.onViewClose();
                            let detailPromo = this.htmlLoader.getInnerElementById("detail_promo");
                            let promote_form_header_detail1 = this.htmlLoader.getInnerElementById("promote_form_header_detail");
                            promote_form_header_detail1.src = '/src/assets/lobby/promotion/promote_form_header.png';
                            detailPromo.style.display = "block";
                            this.changeHoverImage("promote_tab_01_detail");
                        break;
                    case 'promote_tab_02_detail':
                            this.onViewClose();
                            let recordPromo = this.htmlLoader.getInnerElementById("record_promo");
                            recordPromo.style.display = "block";
                            let promote_form_header_detail2 = this.htmlLoader.getInnerElementById("promote_form_header_detail");
                            promote_form_header_detail2.src = '/src/assets/lobby/promotion/promote_form_header.png';
                            this.changeHoverImage("promote_tab_02_detail");
                        break;
                    case 'promote_tab_03_detail':
                            this.onViewClose();
                            let rulePromo = this.htmlLoader.getInnerElementById("rule_promo");
                            let promote_form_header_detail3 = this.htmlLoader.getInnerElementById("promote_form_header_detail");
                            let bgHead02 = this.htmlLoader.getInnerElementById("promote_rule_heading_bg02_detail");
                            bgHead02.style.display = "block";
                            rulePromo.style.display = "block";
                            promote_form_header_detail3.src = '/src/assets/lobby/promotion/promote_rule_heading_bg.png';
                            this.changeHoverImage("promote_tab_03_detail");
                    break;
                    case 'promote_tab_04_detail' :
                            let sharePromo = this.htmlLoader.getInnerElementById("share_promo");
                            let promote_form_header_detail4 = this.htmlLoader.getInnerElementById("promote_form_header_detail");
                            promote_form_header_detail4.src = '/src/assets/lobby/promotion/promote_form_header.png';
                            this.onViewClose();
                            sharePromo.style.display = "block";
                            this.changeHoverImage("promote_tab_04_detail");
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

    onViewClose(){
        let detailPromo = this.htmlLoader.getInnerElementById("detail_promo");
        let recordPromo = this.htmlLoader.getInnerElementById("record_promo");
        let rulePromo = this.htmlLoader.getInnerElementById("rule_promo");
        let sharePromo = this.htmlLoader.getInnerElementById("share_promo");
        let bgHead02 = this.htmlLoader.getInnerElementById("promote_rule_heading_bg02_detail");


        detailPromo.style.display = "none";
        recordPromo.style.display = "none";
        rulePromo.style.display = "none";
        sharePromo.style.display = "none";
        bgHead02.style.display = "none";

    }



    onViewBack(backView){
        backView.style.display = "block";
        window.HtmlMask1.visible = true;
    }
    
    changeHoverImage(choceName){
        let promoteTab01 = this.htmlLoader.getInnerElementById("promote_tab_01_detail");
        let promoteTab02 = this.htmlLoader.getInnerElementById("promote_tab_02_detail");
        let promoteTab03 = this.htmlLoader.getInnerElementById("promote_tab_03_detail");
        let promoteTab04 = this.htmlLoader.getInnerElementById("promote_tab_04_detail");
        
        switch (choceName){
            case "promote_tab_01_detail":
                    promoteTab01.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_01_hover.png");
                    promoteTab02.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_02.png");
                    promoteTab03.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_03.png");
                    promoteTab04.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_04.png");
            break;
            case "promote_tab_02_detail":
                    promoteTab01.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_01.png");
                    promoteTab02.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_02_hover.png");
                    promoteTab03.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_03.png");
                    promoteTab04.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_04.png");
                break;
            case "promote_tab_03_detail":
                    promoteTab01.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_01.png");
                    promoteTab02.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_02.png");
                    promoteTab03.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_03_hover.png");
                    promoteTab04.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_04.png");
                break;
            case "promote_tab_04_detail":
                    promoteTab01.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_01.png");
                    promoteTab02.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_02.png");
                    promoteTab03.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_03.png");
                    promoteTab04.setAttribute("src","@../../../../assets/lobby/promotion/promote_tab_04_hover.png");

                default:
                        break;
            }
        }
    
    




}

export default PromotionTabComponent;