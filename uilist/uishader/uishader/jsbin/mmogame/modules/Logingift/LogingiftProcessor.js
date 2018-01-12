var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var logingift;
(function (logingift) {
    var LogingiftModule = (function (_super) {
        __extends(LogingiftModule, _super);
        function LogingiftModule() {
            _super.apply(this, arguments);
        }
        LogingiftModule.prototype.getModuleName = function () {
            return "LogingiftModule";
        };
        LogingiftModule.prototype.listProcessors = function () {
            return [new LogingiftProcessor()];
        };
        return LogingiftModule;
    })(Module);
    logingift.LogingiftModule = LogingiftModule;
    var LogingiftEvent = (function (_super) {
        __extends(LogingiftEvent, _super);
        function LogingiftEvent() {
            _super.apply(this, arguments);
        }
        //展示面板
        LogingiftEvent.SHOW_Logingift_EVENT = "SHOW_Logingift_EVENT";
        //隐藏面板
        LogingiftEvent.HIDE_Logingift_EVENT = "HIDE_Logingift_EVENT";
        //领取状态变化
        LogingiftEvent.REFRESH_Logingift_EVENT = "REFRESH_Logingift_EVENT";
        return LogingiftEvent;
    })(BaseEvent);
    logingift.LogingiftEvent = LogingiftEvent;
    var LogingiftProcessor = (function (_super) {
        __extends(LogingiftProcessor, _super);
        function LogingiftProcessor() {
            _super.apply(this, arguments);
        }
        LogingiftProcessor.prototype.getName = function () {
            return "LogingiftProcessor";
        };
        LogingiftProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof LogingiftEvent) {
                var $givingUiEvent = $event;
                if ($givingUiEvent.type == LogingiftEvent.SHOW_Logingift_EVENT) {
                    this.showUi($givingUiEvent.data);
                }
                else if ($givingUiEvent.type == LogingiftEvent.REFRESH_Logingift_EVENT) {
                    this.refresh();
                }
                else if ($givingUiEvent.type == LogingiftEvent.HIDE_Logingift_EVENT) {
                    this.hideUi();
                }
            }
            if ($event instanceof UIPanelEvent) {
                var panelEvent = $event;
                if (panelEvent.panel == this._logingiftUiPanel) {
                    this._logingiftUiPanel.dispose();
                    this._logingiftUiPanel = null;
                    console.log("释放面板 _logingiftUiPanel");
                }
            }
        };
        LogingiftProcessor.prototype.refresh = function () {
            if (this._logingiftUiPanel && this._logingiftUiPanel.hasStage) {
                this._logingiftUiPanel.resetData();
            }
            if (this._logingiftUiPanel && this._logingiftUiPanel.logingiftList && this._logingiftUiPanel.logingiftList.hasStage) {
                this._logingiftUiPanel.logingiftList.refreshDataByNewData();
            }
        };
        LogingiftProcessor.prototype.hideUi = function () {
            this._logingiftUiPanel.hide();
            SceneManager.getInstance().render = true;
            ModuleEventManager.dispatchEvent(new mainUi.MainUiEvent(mainUi.MainUiEvent.SHOW_MAINUI_EVENT));
        };
        LogingiftProcessor.prototype.showUi = function ($type) {
            var _this = this;
            if (!this._logingiftUiPanel) {
                this._logingiftUiPanel = new logingift.LogingiftUiPanel();
            }
            this._logingiftUiPanel.load(function () {
                //停止绘制前面的ui
                SceneManager.getInstance().render = false;
                ModuleEventManager.dispatchEvent(new mainUi.MainUiEvent(mainUi.MainUiEvent.HIDE_MAINUI_EVENT));
                _this._logingiftUiPanel.show();
            });
        };
        // public getHanderMap(): Object {
        //     var obj: Object = new Object;
        //     obj[Protocols.SMSG_WELFARE_REWARDLIST_GETBACK] = ($byte: ByteArray) => { this.getbackResultList($byte) };
        //     return obj;
        // }
        LogingiftProcessor.prototype.listenModuleEvents = function () {
            return [
                new LogingiftEvent(LogingiftEvent.SHOW_Logingift_EVENT),
                new LogingiftEvent(LogingiftEvent.HIDE_Logingift_EVENT),
                new LogingiftEvent(LogingiftEvent.REFRESH_Logingift_EVENT),
                new UIPanelEvent(UIPanelEvent.DISPOSE_PANEL_EVENT),
            ];
        };
        return LogingiftProcessor;
    })(BaseProcessor);
    logingift.LogingiftProcessor = LogingiftProcessor;
})(logingift || (logingift = {}));
//# sourceMappingURL=LogingiftProcessor.js.map