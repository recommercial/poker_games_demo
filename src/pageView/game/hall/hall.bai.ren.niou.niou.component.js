
import DisplaySize from '../../../common/display'
import LobbyService from '../../../service/lobby-service';
import Constant from '../../../common/constant'
import Util from '../../../common/util'




/**
 * Making UserInfo basic.html page events and operations.
 */
class HallBaiRenNiouNiouComponenst {
    constructor(config) {
        this._config = config || {};
        this.scene = config.scene;                              //phaser.Scene
        if(!this.scene) { throw "Argument error. Can't find scene object HallBaiRenNiouNiouComponenst"; }
        this.htmlLoader = config.htmlLoader;                    //'./src/common/dom/html.loader.js'
        this.htmlDynamicDom = config.htmlDynamicDom;
        this.data = config.data;
        this.width = config.width;
        this.height = config.height;
        this.src  = config.src;
        this.type = config.type
        
        this.prepareComponent();
        
    }

    //init function
    prepareComponent() {
        this.htmlLoader.setLoaderSize(DisplaySize.HallBaiRenNiouInfo.width, DisplaySize.HallBaiRenNiouInfo.height);
        this.htmlLoader.width = DisplaySize.HallBaiRenNiouInfo.width;
        this.htmlLoader.height = DisplaySize.HallBaiRenNiouInfo.height;
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();
        this.htmlLoader.width = DisplaySize.HallBaiRenNiouInfo.width;
        this.htmlLoader.height = DisplaySize.HallBaiRenNiouInfo.height;
        this.htmlLoader.loaderElement.addEventListener('load', () => {
          this.setTableData(this.data);
          if(this.type === 'help'){
            this.innerClickEvent('bai_ren_help_close','hall_bai_ren_help');
          }
          if(this.type === 'record'){
            this.innerClickEvent('bai_ren_record_close','hall_bai_ren_record');
          }
            
            
        });  //End load event
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
    innerClickEvent(eventID,domID){
      this.htmlLoader.innerDocument.getElementById(domID).style.display = 'block';
      this.htmlLoader.innerDocument.getElementById(eventID).addEventListener('click', (event) => {
        this.htmlLoader.innerDocument.getElementById(domID).style.display = 'none';
        this.htmlLoader.visible = false;
        window.HtmlMask1.visible = false;
      });  //End click event
    }
    setTableData(data){
      let table = this.htmlLoader.innerDocument.getElementById("bai_ren_css_table");
      let tableChild = Array.from(this.htmlLoader.innerDocument.getElementById("bai_ren_css_table").children);
      this.tableEmpty(tableChild);
      data.forEach(el => {
        let tr = document.createElement('div');
        tr.className = 'css_tr';
        this.createRowCell(el.seq, 'seq', tr);
        this.createRowCell(el.allocateNum, 'allocateNum', tr);
        this.createRowCell(el.room, 'room', tr);
        this.createRowCell(el.profit, 'profit', tr);
        this.createRowCell(el.endTime, 'endTime', tr);
        table.appendChild(tr);
      });
    }
    createRowCell(val, type, parent) {
      let columBalance = document.createElement('div');
      columBalance.className = (type == 'profit' && Number(val) >=0  ? 'css_td red' : 'css_td green');
      columBalance.textContent = val;
      parent.appendChild(columBalance);
  }
    tableEmpty(children){
      children.forEach(element => {
        element.remove();
      });
    }
}

export default HallBaiRenNiouNiouComponenst;