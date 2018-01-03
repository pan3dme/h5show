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
var materialui;
(function (materialui) {
    var RightMenuEvent = /** @class */ (function (_super) {
        __extends(RightMenuEvent, _super);
        function RightMenuEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RightMenuEvent.SHOW_RIGHT_MENU = "SHOW_RIGHT_MENU"; //显示面板
        RightMenuEvent.HIDE_RIGHT_MENU = "HIDE_RIGHT_MENU"; //显示面板
        return RightMenuEvent;
    }(BaseEvent));
    materialui.RightMenuEvent = RightMenuEvent;
    var RightMenuModule = /** @class */ (function (_super) {
        __extends(RightMenuModule, _super);
        function RightMenuModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RightMenuModule.prototype.getModuleName = function () {
            return "RightMenuModule";
        };
        RightMenuModule.prototype.listProcessors = function () {
            return [new RightMenuProcessor()];
        };
        return RightMenuModule;
    }(Module));
    materialui.RightMenuModule = RightMenuModule;
    var RightMenuProcessor = /** @class */ (function (_super) {
        __extends(RightMenuProcessor, _super);
        function RightMenuProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RightMenuProcessor.prototype.getName = function () {
            return "RightMenuProcessor";
        };
        RightMenuProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof RightMenuEvent) {
                var $materialEvent = $event;
                if ($materialEvent.type == RightMenuEvent.SHOW_RIGHT_MENU) {
                    this.showMenuPanel($materialEvent.posv2d);
                }
                if ($materialEvent.type == RightMenuEvent.HIDE_RIGHT_MENU) {
                    if (this._rightMenuPanel) {
                        UIManager.getInstance().removeUIContainer(this._rightMenuPanel);
                        Scene_data.uiBlankStage.removeEventListener(InteractiveEvent.Down, this.onMouseDown, this);
                    }
                }
            }
        };
        RightMenuProcessor.prototype.showMenuPanel = function (posv2d) {
            if (!this._rightMenuPanel) {
                this._rightMenuPanel = new materialui.RightMenuPanel();
            }
            this._rightMenuPanel.left = posv2d.x / UIData.Scale;
            this._rightMenuPanel.top = posv2d.y / UIData.Scale;
            UIManager.getInstance().addUIContainer(this._rightMenuPanel);
            this._rightMenuPanel.refrish();
            Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Down, this.onMouseDown, this);
        };
        RightMenuProcessor.prototype.onMouseDown = function ($evt) {
            ModuleEventManager.dispatchEvent(new RightMenuEvent(RightMenuEvent.HIDE_RIGHT_MENU));
        };
        RightMenuProcessor.prototype.listenModuleEvents = function () {
            return [
                new RightMenuEvent(RightMenuEvent.SHOW_RIGHT_MENU),
                new RightMenuEvent(RightMenuEvent.HIDE_RIGHT_MENU),
            ];
        };
        return RightMenuProcessor;
    }(BaseProcessor));
    materialui.RightMenuProcessor = RightMenuProcessor;
})(materialui || (materialui = {}));
//# sourceMappingURL=RightMenuProcessor.js.map