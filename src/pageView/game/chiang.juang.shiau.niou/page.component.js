import DisplaySize from '../../../common/display';
import Util from '../../../common/util';

class PageComponent {
    constructor(config) {
        this._config = config || {};
        this.htmlLoader = config.htmlLoader; 
        this.src  = config.src;
        this.scene = config.scene; 
        this.initComponent();
    }

    initComponent() {
        this.htmlLoader.visible = false;
        this.htmlLoader.src = this.src +'?v='+(Math.random()*100).toFixed();

        this.htmlLoader.loaderElement.addEventListener('load', () => {
            this.htmlLoader.innerDocument.addEventListener('click', (event) => { 
                switch (event.target.id) {
                    case PageComponent.BUTTON.HELP_CLOSE:
                    case PageComponent.BUTTON.RECORD_CLOSE:
                    case PageComponent.BUTTON.FEEDBACK_CLOSE:
                    case PageComponent.BUTTON.SETTING_CLOSE:
                        this.closeAll();
                        break;
                    case PageComponent.BUTTON.FEEDBACK_OK:
                        this.feedbackSubmit();
                        break;
                    case PageComponent.BUTTON.SETTING_MUSIC_SWITCH:
                        this.settingMusicSwitch();
                        break;
                    case PageComponent.BUTTON.SETTING_EFFECT_SWITCH:
                        this.settingEffectSwitch();
                        break;
                    case PageComponent.HELP_TAB[0].TAB:
                        this.showHelpTab(PageComponent.HELP_TAB[0]);
                        break;
                    case PageComponent.HELP_TAB[1].TAB:
                        this.showHelpTab(PageComponent.HELP_TAB[1]);
                        break;
                    case PageComponent.HELP_TAB[2].TAB:
                        this.showHelpTab(PageComponent.HELP_TAB[2]);
                        break;
                    case PageComponent.HELP_TAB[3].TAB:
                        this.showHelpTab(PageComponent.HELP_TAB[3]);
                        break;
                    case PageComponent.HELP_TAB[4].TAB:
                        this.showHelpTab(PageComponent.HELP_TAB[4]);
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

    showHelpTab(choiceTab) {
        // make all hide
        let innDoc = this.htmlLoader.innerDocument;
        PageComponent.HELP_TAB.forEach(tab => {
            let elem = innDoc.getElementById(tab.CONTENT);
            elem.style.display = 'none';
            let tabBtn = innDoc.getElementById(tab.TAB);
            tabBtn.className = tab.UNSELECTED_CLASS;
        });

        // make selected
        let choiceElem = innDoc.getElementById(choiceTab.CONTENT);
        choiceElem.style.display = 'block';
        choiceElem.scrollTop = 0;
        let choiceTabBtn = innDoc.getElementById(choiceTab.TAB);
        choiceTabBtn.className = choiceTab.SELECTED_CLASS;
    }

    setAndDisplayRecordData(data, listDomId) {
        let innDoc = this.htmlLoader.innerDocument;
        let listDom = innDoc.getElementById(listDomId);
        listDom.innerHTML = '';                 //make empty;
        for(let i=0; i<data.length; i++) {
            const dataItem = data[i];
            this.setRecordRowTemplate(dataItem, listDom);
        }
        let container = innDoc.getElementById(PageComponent.RECORD_LIST_CONTAINER);
        container.scrollTop = 0;
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
        let textarea = innDoc.getElementById('GCJ_feedback_content');
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
    RECORD: 'GCJ_record_panel',
    HELP: 'GCJ_help_panel',
    FEEDBACK: 'GCJ_feedback_panel',
    SETTING: 'GCJ_setting_panel',
}

//Button Dom ID
PageComponent.BUTTON = {
    RECORD_CLOSE: 'GCJ_record_cancel',
    HELP_CLOSE: 'GCJ_help_cancel',
    FEEDBACK_CLOSE: 'GCJ_feedback_cancel',
    FEEDBACK_OK: 'GCJ_feedback_ok',
    SETTING_CLOSE: 'GCJ_setting_cancel',
    SETTING_MUSIC_SWITCH: 'GCJ_setting_music_switch',
    SETTING_EFFECT_SWITCH: 'GCJ_setting_effect_switch',
}

PageComponent.RECORD_LIST_CONTAINER = 'GCJ_record_list_container';
PageComponent.RECORD_LIST = 'GCJ_record_list';

// Help tab dom id
PageComponent.HELP_TAB = [
    {
        CONTENT: 'GCJ_help1_content',
        TAB: 'GCJ_btn_help1',
        SELECTED_CLASS: 'GCJ_help1_selected',
        UNSELECTED_CLASS: 'GCJ_help1_unselected',
    },
    {
        CONTENT: 'GCJ_help2_content',
        TAB: 'GCJ_btn_help2',
        SELECTED_CLASS: 'GCJ_help2_selected',
        UNSELECTED_CLASS: 'GCJ_help2_unselected',
    },
    {
        CONTENT: 'GCJ_help3_content',
        TAB: 'GCJ_btn_help3',
        SELECTED_CLASS: 'GCJ_help3_selected',
        UNSELECTED_CLASS: 'GCJ_help3_unselected',
    },
    {
        CONTENT: 'GCJ_help4_content',
        TAB: 'GCJ_btn_help4',
        SELECTED_CLASS: 'GCJ_help4_selected',
        UNSELECTED_CLASS: 'GCJ_help4_unselected',
    },
    {
        CONTENT: 'GCJ_help5_content',
        TAB: 'GCJ_btn_help5',
        SELECTED_CLASS: 'GCJ_help5_selected',
        UNSELECTED_CLASS: 'GCJ_help5_unselected',
    },
];

PageComponent.SETTING = {
    MUSIC: 'GCJ_setting_music_value',
    EFFECT: 'GCJ_setting_effect_value',
    MUSIC_BAR: 'GCJ_setting_music_bar',
    EFFECT_BAR: 'GCJ_setting_effect_bar',
    BAR_WIDTH: 1026,
    SWITCH_CLASS_ON: 'switch_on',
    SWITCH_CLASS_OFF: 'switch_off',
}


export default PageComponent;