/**
 * Making UserInfo basic.html page events and operations.
 */
import LeaderBoardData from '../../data/leaderborad.data';
import DisplaySize from '../../common/display'

class LeaderBoardTabComponent {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.leaderBoard = new LeaderBoardData(config);
        this.prepareComponent();
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(this.width, this.height);
        this.htmlLoader.width = this.width;
        this.htmlLoader.height = this.height;
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.width = DisplaySize.LeaderBoardFrame.width;
        this.htmlLoader.height = DisplaySize.LeaderBoardFrame.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
        //    this.htmlLoader.visible = true;
           let profitBoard = this.htmlLoader.innerDocument.getElementById("profit_board");
               profitBoard.style.display = "block";
            this.leaderBoard.getProfitBoard();
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case 'profit_close':
                    case 'lucky_close':
                        this.onClickClose();
                        break;
                    case 'profit_award_tab_01_hover':
                    case 'profit_award_tab_01':
                        this.displayView("none");
                        this.onClickProfitBoard();
                        break;
                    case 'profit_award_tab_02_hover':
                    case 'profit_award_tab_02':
                        this.displayView("none");
                        this.onClickLuckyBoard();

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
    
    onClickLuckyBoard() {
        let luckyBoard = this.htmlLoader.innerDocument.getElementById("lucky_board");
            luckyBoard.style.display = "block";
            this.leaderBoard.getLuckyBoard();

    } 
    onClickProfitBoard() {
        let profitBoard = this.htmlLoader.innerDocument.getElementById("profit_board");
            profitBoard.style.display = "block";
            this.leaderBoard.getProfitBoard();

    }

    displayView(viewCode){
        let luckyBoard = this.htmlLoader.innerDocument.getElementById("lucky_board");
        let profitBoard = this.htmlLoader.innerDocument.getElementById("profit_board");

        
        luckyBoard.style.display = viewCode;
        profitBoard.style.display = viewCode;
    }




    
    




}

export default LeaderBoardTabComponent;