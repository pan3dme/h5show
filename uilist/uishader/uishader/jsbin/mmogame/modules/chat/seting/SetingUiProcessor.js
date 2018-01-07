var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var setingui;
(function (setingui) {
    var SetingUiModule = (function (_super) {
        __extends(SetingUiModule, _super);
        function SetingUiModule() {
            _super.apply(this, arguments);
        }
        SetingUiModule.prototype.getModuleName = function () {
            return "SetingUiModule";
        };
        SetingUiModule.prototype.listProcessors = function () {
            return [new SetingUiProcessor()];
        };
        return SetingUiModule;
    })(Module);
    setingui.SetingUiModule = SetingUiModule;
    var SetingUiEvent = (function (_super) {
        __extends(SetingUiEvent, _super);
        function SetingUiEvent() {
            _super.apply(this, arguments);
        }
        SetingUiEvent.SHOW_SETING_UI_PANEL = "SHOW_SETING_UI_PANEL";
        SetingUiEvent.HIDE_SETING_UI_PANEL = "HIDE_SETING_UI_PANEL";
        return SetingUiEvent;
    })(BaseEvent);
    setingui.SetingUiEvent = SetingUiEvent;
    var SetingUiProcessor = (function (_super) {
        __extends(SetingUiProcessor, _super);
        function SetingUiProcessor() {
            _super.apply(this, arguments);
        }
        SetingUiProcessor.prototype.getName = function () {
            return "SetingUiProcessor";
        };
        SetingUiProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof SetingUiEvent) {
                var evt = $event;
                if (evt.type == SetingUiEvent.SHOW_SETING_UI_PANEL) {
                    this.showPanel();
                }
                if (evt.type == SetingUiEvent.HIDE_SETING_UI_PANEL) {
                    this.hidePanel();
                }
            }
        };
        SetingUiProcessor.prototype.hidePanel = function () {
            if (this.setingUiPanel) {
                UIManager.getInstance().removeUIContainer(this.setingUiPanel);
            }
        };
        SetingUiProcessor.prototype.showPanel = function () {
            var _this = this;
            if (!this.setingUiPanel) {
                this.setingUiPanel = new setingui.SetingUiPanel();
            }
            this.setingUiPanel.load(function () {
                UIManager.getInstance().addUIContainer(_this.setingUiPanel);
                _this.setingUiPanel.refresh();
            }, false);
        };
        SetingUiProcessor.prototype.listenModuleEvents = function () {
            return [
                new SetingUiEvent(SetingUiEvent.SHOW_SETING_UI_PANEL),
                new SetingUiEvent(SetingUiEvent.HIDE_SETING_UI_PANEL),
            ];
        };
        return SetingUiProcessor;
    })(BaseProcessor);
    setingui.SetingUiProcessor = SetingUiProcessor;
})(setingui || (setingui = {}));
//# sourceMappingURL=SetingUiProcessor.js.map