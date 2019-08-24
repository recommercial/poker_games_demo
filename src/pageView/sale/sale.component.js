
import DisplaySize from '../../common/display'


/**
 * Making UserInfo basic.html page events and operations.
 */
class SaleTabComponent {
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
        this.htmlLoader.width = DisplaySize.SaleFrame.width;
        this.htmlLoader.height = DisplaySize.SaleFrame.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
        //    this.htmlLoader.visible = true;
           let discounted = this.htmlLoader.getInnerElementById("discounted");
               discounted.style.display = "block";
           // Detect when scrolled to bottom.

            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'icon_close_sale':
                        this.onClickClose();
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

    onViewBack(backView){
        backView.style.display = "block";
        window.HtmlMask1.visible = true;
    }
    
   
    
    

}

export default SaleTabComponent;