var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Hangup;
(function (Hangup) {
    var HangupUiModel = (function (_super) {
        __extends(HangupUiModel, _super);
        function HangupUiModel() {
            _super.apply(this, arguments);
        }
        HangupUiModel.prototype.getModuleName = function () {
            return "HangupUiModel";
        };
        HangupUiModel.prototype.listProcessors = function () {
            return [new HangupSettingProcessor()];
        };
        return HangupUiModel;
    })(Module);
    Hangup.HangupUiModel = HangupUiModel;
    var HangupUiEvent = (function (_super) {
        __extends(HangupUiEvent, _super);
        function HangupUiEvent() {
            _super.apply(this, arguments);
        }
        //展示技能面板
        HangupUiEvent.SHOW_HANGUPUI_EVENT = "SHOW_HANGUPUI_EVENT";
        //隐藏技能面板
        HangupUiEvent.HIDE_HANGUPUI_EVENT = "HIDE_HANGUPUI_EVENT";
        return HangupUiEvent;
    })(BaseEvent);
    Hangup.HangupUiEvent = HangupUiEvent;
    var HangupSettingProcessor = (function (_super) {
        __extends(HangupSettingProcessor, _super);
        function HangupSettingProcessor() {
            _super.apply(this, arguments);
        }
        HangupSettingProcessor.prototype.getName = function () {
            return "HangupSettingProcessor";
        };
        HangupSettingProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof HangupUiEvent) {
                var $skillUIEvent = $event;
                if ($skillUIEvent.type == HangupUiEvent.SHOW_HANGUPUI_EVENT) {
                    this.showUi();
                }
                else if ($skillUIEvent.type == HangupUiEvent.HIDE_HANGUPUI_EVENT) {
                    this.hideUi();
                }
            }
            if ($event instanceof UIPanelEvent) {
                var panelEvent = $event;
                if (panelEvent.panel == this._hangupSettingUiPanel) {
                    this._hangupSettingUiPanel.dispose();
                    this._hangupSettingUiPanel = null;
                    console.log("释放面板 _hangupSettingUiPanel");
                }
            }
        };
        HangupSettingProcessor.prototype.hideUi = function () {
            if (this._hangupSettingUiPanel) {
                this._hangupSettingUiPanel.hide();
            }
        };
        HangupSettingProcessor.prototype.showUi = function () {
            var _this = this;
            if (!this._hangupSettingUiPanel) {
                this._hangupSettingUiPanel = new Hangup.HangupSettingUiPanel();
            }
            this._hangupSettingUiPanel.load(function () {
                _this._hangupSettingUiPanel.show();
            });
        };
        HangupSettingProcessor.prototype.listenModuleEvents = function () {
            return [
                new HangupUiEvent(HangupUiEvent.SHOW_HANGUPUI_EVENT),
                new HangupUiEvent(HangupUiEvent.HIDE_HANGUPUI_EVENT),
                new UIPanelEvent(UIPanelEvent.DISPOSE_PANEL_EVENT),
            ];
        };
        return HangupSettingProcessor;
    })(BaseProcessor);
    Hangup.HangupSettingProcessor = HangupSettingProcessor;
})(Hangup || (Hangup = {}));
//# sourceMappingURL=HangupSettingProcessor.js.map