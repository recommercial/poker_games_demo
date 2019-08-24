import DisplaySize from '../../../common/display';
import Util from '../../../common/util';

class PageComponent {
    constructor(config) {
        this._config = config || {};
        this.htmlLoader = config.htmlLoader; 
        this.src = config.src;
        this.scene = config.scene; 
        this.initComponent();
    }

    initComponent() {
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();

        this.htmlLoader.loaderElement.addEventListener('load', () => {
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case PageComponent.BUTTON.FEEDBACK_OK:
                        this.feedbackSubmit();
                        break;
                    case PageComponent.BUTTON.SETTING_MUSIC_SWITCH:
                        this.settingMusicSwitch();
                        break;
                    case PageComponent.BUTTON.SETTING_EFFECT_SWITCH:
                        this.settingEffectSwitch();
                        break;
                    case PageComponent.BUTTON.HELP_CLOSE:
                    case PageComponent.BUTTON.RECORD_CLOSE:
                    case PageComponent.BUTTON.FEEDBACK_CLOSE:
                    case PageComponent.BUTTON.SETTING_CLOSE:
                        this.closeAll();
                        break;
                    default:
                        break;
                }
            }, false);

            this.htmlLoader.innerDocument.addEventListener('change', (event) => { 
                switch (event.target.id) {
                    case PageComponent.SETTING.MUSIC:
                        this.settingMusicValue();
                        break;
                    case PageComponent.SETTING.EFFECT:
                        this.settingEffectValue();
                        break;
                    default:
                        break;
                }
            }, false);
        });
    }

    showPanel(panelDomId) {
        let innDoc = this.htmlLoader.innerDocument;
        Object.keys(PageComponent.PANEL).map(key => {
            innDoc.getElementById(PageComponent.PANEL[key]).style.display = 'none';
        });
        if(panelDomId && panelDomId !== '') {
            innDoc.getElementById(panelDomId).style.display = 'block';
        }
    }

    scrollTopContainer(containerDomId) {
        let innDoc = this.htmlLoader.innerDocument;
        let container = innDoc.getElementById(containerDomId);
        container.scrollTop = 0;
    }

    setAndDisplayRecordData(data, listDomId) {
        let innDoc = this.htmlLoader.innerDocument;
        let listDom = innDoc.getElementById(listDomId);
        listDom.innerHTML = '';                 //make empty;
        for(let i=0; i<data.length; i++) {
            const dataItem = data[i];
            this.setRecordRowTemplate(dataItem, listDom);
        }
    }

    setRecordRowTemplate(record, parent) {
        let tr = document.createElement('div');
        tr.className = 'css_tr';
        this.setRecordCellTemplate(record.seq, tr);             //seq
        this.setRecordCellTemplate(record.allocateNum, tr);     //allocateNum
        this.setRecordCellTemplate(record.room, tr);            //room
        let colorClass = 'red';
        if(record.profit < 0) {
            colorClass = 'green';
        }
        let strProfit = Util.currencyFormat(record.profit);
        this.setRecordCellTemplate(strProfit, tr, colorClass);  //profit
        this.setRecordCellTemplate(record.endTime, tr);         //end time
        parent.appendChild(tr);
    }

    setRecordCellTemplate(data, parent, colorClass) {
        let td = document.createElement('div');
        td.className = 'css_td';
        if(colorClass !== undefined) {
            td.className += ' ' + colorClass;
        }
        td.textContent = data;
        parent.appendChild(td);
    }

    feedbackSubmit() {
        //TODO...
        this.closeAll();
    }

    setFeedbackInputEmpty() {
        let innDoc = this.htmlLoader.innerDocument;
        let textarea = innDoc.getElementById('GBJ_feedback_content');
        textarea.value = '';
    }

    settingMusicSwitch() {
        let innDoc = this.htmlLoader.innerDocument;
        let switchBtn = innDoc.getElementById(PageComponent.BUTTON.SETTING_MUSIC_SWITCH);
        this.doSwitch(switchBtn);

    }

    settingEffectSwitch() {
        let innDoc = this.htmlLoader.innerDocument;
        let switchBtn = innDoc.getElementById(PageComponent.BUTTON.SETTING_EFFECT_SWITCH);
        this.doSwitch(switchBtn);
    }

    doSwitch(elem) {
        let isTurnOn = false;
        if(elem.className === PageComponent.SETTING.SWITCH_CLASS_ON ) {
            elem.className = PageComponent.SETTING.SWITCH_CLASS_OFF;
            isTurnOn = false;
        } else {
            elem.className = PageComponent.SETTING.SWITCH_CLASS_ON;
            isTurnOn = true;
        }
        // if(isTurnOn) {
        //     this.scene.sound.setVolume(100);
        // } else {
        //     this.scene.sound.setVolume(0);
        // }
    }

    settingMusicValue() {
        let innDoc = this.htmlLoader.innerDocument;
        let rangeElem = innDoc.getElementById(PageComponent.SETTING.MUSIC);
        let rangeBar = innDoc.getElementById(PageComponent.SETTING.MUSIC_BAR);
        rangeBar.style.width = rangeElem.value * PageComponent.SETTING.BAR_WIDTH / 100 + 'px';
    }
    
    settingEffectValue() {
        let innDoc = this.htmlLoader.innerDocument;
        let rangeElem = innDoc.getElementById(PageComponent.SETTING.EFFECT);
        let rangeBar = innDoc.getElementById(PageComponent.SETTING.EFFECT_BAR);
        rangeBar.style.width = rangeElem.value * PageComponent.SETTING.BAR_WIDTH / 100 + 'px';
    }


    closeAll() {
        this.htmlLoader.visible = false;
        window.HtmlMask1.visible = false;
    }
}

//Panel Dom ID 
PageComponent.PANEL = {
    RECORD: 'GBJ_record_panel',
    HELP: 'GBJ_help_panel',
    FEEDBACK: 'GBJ_feedback_panel',
    SETTING: 'GBJ_setting_panel',
}

//Button Dom ID
PageComponent.BUTTON = {
    RECORD_CLOSE: 'GBJ_record_cancel',
    HELP_CLOSE: 'GBJ_help_cancel',
    FEEDBACK_CLOSE: 'GBJ_feedback_cancel',
    FEEDBACK_OK: 'GBJ_feedback_ok',
    SETTING_CLOSE: 'GBJ_setting_cancel',
    SETTING_MUSIC_SWITCH: 'GBJ_setting_music_switch',
    SETTING_EFFECT_SWITCH: 'GBJ_setting_effect_switch',
}

PageComponent.RECORD_LIST_CONTAINER = 'GBJ_record_list_container';
PageComponent.RECORD_LIST = 'GBJ_record_list';
PageComponent.HELP_CONTAINER = 'GBJ_help_content';

PageComponent.SETTING = {
    MUSIC: 'GBJ_setting_music_value',
    EFFECT: 'GBJ_setting_effect_value',
    MUSIC_BAR: 'GBJ_setting_music_bar',
    EFFECT_BAR: 'GBJ_setting_effect_bar',
    BAR_WIDTH: 550,
    SWITCH_CLASS_ON: 'switch_on',
    SWITCH_CLASS_OFF: 'switch_off',
}

export default PageComponent;