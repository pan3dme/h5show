var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var left;
(function (left) {
    var LeftEvent = (function (_super) {
        __extends(LeftEvent, _super);
        function LeftEvent() {
            _super.apply(this, arguments);
        }
        LeftEvent.SHOW_LEFT_PANEL = "SHOW_LEFT_PANEL"; //显示面板
        LeftEvent.HIDE_LEFT_PANEL = "HIDE_LEFT_PANEL"; //显示面板
        return LeftEvent;
    })(BaseEvent);
    left.LeftEvent = LeftEvent;
    var LeftModule = (function (_super) {
        __extends(LeftModule, _super);
        function LeftModule() {
            _super.apply(this, arguments);
        }
        LeftModule.prototype.getModuleName = function () {
            return "LeftModule";
        };
        LeftModule.prototype.listProcessors = function () {
            return [new LeftProcessor()];
        };
        return LeftModule;
    })(Module);
    left.LeftModule = LeftModule;
    var LeftProcessor = (function (_super) {
        __extends(LeftProcessor, _super);
        function LeftProcessor() {
            _super.apply(this, arguments);
        }
        LeftProcessor.prototype.getName = function () {
            return "LeftProcessor";
        };
        LeftProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof LeftEvent) {
                var $leftEvent = $event;
                if ($leftEvent.type == LeftEvent.SHOW_LEFT_PANEL) {
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
                }
                if ($leftEvent.type == LeftEvent.HIDE_LEFT_PANEL) {
                    if (this.leftPanel) {
                        UIManager.getInstance().removeUIContainer(this.leftPanel);
                    }
                }
            }
        };
        LeftProcessor.prototype.listenModuleEvents = function () {
            return [
                new LeftEvent(LeftEvent.SHOW_LEFT_PANEL),
                new LeftEvent(LeftEvent.HIDE_LEFT_PANEL),
            ];
        };
        return LeftProcessor;
    })(BaseProcessor);
    left.LeftProcessor = LeftProcessor;
})(left || (left = {}));
//# sourceMappingURL=LeftProcessor.js.map