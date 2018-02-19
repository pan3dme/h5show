var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var left;
(function (left) {
    var LeftEvent = /** @class */ (function (_super) {
        __extends(LeftEvent, _super);
        function LeftEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LeftEvent.SHOW_LEFT_PANEL = "SHOW_LEFT_PANEL"; //显示面板
        LeftEvent.HIDE_LEFT_PANEL = "HIDE_LEFT_PANEL"; //显示面板
        return LeftEvent;
    }(BaseEvent));
    left.LeftEvent = LeftEvent;
    var LeftModule = /** @class */ (function (_super) {
        __extends(LeftModule, _super);
        function LeftModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LeftModule.prototype.getModuleName = function () {
            return "LeftModule";
        };
        LeftModule.prototype.listProcessors = function () {
            return [new LeftProcessor()];
        };
        return LeftModule;
    }(Module));
    left.LeftModule = LeftModule;
    var LeftProcessor = /** @class */ (function (_super) {
        __extends(LeftProcessor, _super);
        function LeftProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        LeftProcessor.prototype.getName = function () {
            return "LeftProcessor";
        };
        LeftProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof LeftEvent) {
                var $leftEvent = $event;
                if ($leftEvent.type == LeftEvent.SHOW_LEFT_PANEL) {
                    this.showLeftPanel();
                    this.showReflactionView();
                }
                if ($leftEvent.type == LeftEvent.HIDE_LEFT_PANEL) {
                    this.hideLeftPanel();
                }
            }
        };
        LeftProcessor.prototype.showReflactionView = function () {
        };
        LeftProcessor.prototype.hideLeftPanel = function () {
            if (this.leftPanel) {
                UIManager.getInstance().removeUIContainer(this.leftPanel);
            }
        };
        LeftProcessor.prototype.showLeftPanel = function () {
            if (!this.leftPanel) {
                this.leftPanel = new left.LeftPanel;
            }
            if (!this.leftPanel.hasStage) {
                UIManager.getInstance().addUIContainer(this.leftPanel);
                left.ModelShowModel.getInstance().addBaseModel();
            }
            else {
                ModuleEventManager.dispatchEvent(new LeftEvent(LeftEvent.HIDE_LEFT_PANEL));
            }
        };
        LeftProcessor.prototype.listenModuleEvents = function () {
            return [
                new LeftEvent(LeftEvent.SHOW_LEFT_PANEL),
                new LeftEvent(LeftEvent.HIDE_LEFT_PANEL),
            ];
        };
        return LeftProcessor;
    }(BaseProcessor));
    left.LeftProcessor = LeftProcessor;
})(left || (left = {}));
//# sourceMappingURL=LeftProcessor.js.map