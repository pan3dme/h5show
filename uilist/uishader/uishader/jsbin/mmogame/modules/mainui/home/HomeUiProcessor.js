var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var homeui;
(function (homeui) {
    var HomeUiModule = (function (_super) {
        __extends(HomeUiModule, _super);
        function HomeUiModule() {
            _super.apply(this, arguments);
        }
        HomeUiModule.prototype.getModuleName = function () {
            return "HomeUiModule";
        };
        HomeUiModule.prototype.listProcessors = function () {
            return [new HomeUiProcessor()];
        };
        return HomeUiModule;
    })(Module);
    homeui.HomeUiModule = HomeUiModule;
    var HomeUiEvent = (function (_super) {
        __extends(HomeUiEvent, _super);
        function HomeUiEvent() {
            _super.apply(this, arguments);
        }
        HomeUiEvent.SHOW_HOME_UI_PANEL = "SHOW_HOME_UI_PANEL";
        HomeUiEvent.HIDE_HOME_UI_PANEL = "HIDE_HOME_UI_PANEL";
        HomeUiEvent.REFRESH_HOME_UI_PANEL = "REFRESH_HOME_UI_PANEL";
        return HomeUiEvent;
    })(BaseEvent);
    homeui.HomeUiEvent = HomeUiEvent;
    var HomeUiProcessor = (function (_super) {
        __extends(HomeUiProcessor, _super);
        function HomeUiProcessor() {
            _super.apply(this, arguments);
        }
        HomeUiProcessor.prototype.getName = function () {
            return "HomeUiProcessor";
        };
        HomeUiProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof HomeUiEvent) {
                var evt = $event;
                if (evt.type == HomeUiEvent.SHOW_HOME_UI_PANEL) {
                    if (GuidData.map.showAreaById(AreaType.rightChange_6)) {
                        this.showPanel();
                    }
                }
                if (evt.type == HomeUiEvent.HIDE_HOME_UI_PANEL) {
                    this.hidePanel();
                }
                if (evt.type == HomeUiEvent.REFRESH_HOME_UI_PANEL) {
                    if (this._homeUiPanel) {
                        this._homeUiPanel.homeSysPanel.refresh();
                    }
                }
            }
        };
        HomeUiProcessor.prototype.hidePanel = function () {
            if (this._homeUiPanel) {
                UIManager.getInstance().removeUIContainer(this._homeUiPanel);
            }
        };
        HomeUiProcessor.prototype.showPanel = function () {
            var _this = this;
            if (!this._homeUiPanel) {
                this._homeUiPanel = new homeui.HomeUiPanel();
            }
            this._homeUiPanel.load(function () {
                UIManager.getInstance().addUIContainer(_this._homeUiPanel);
            }, false);
        };
        HomeUiProcessor.prototype.listenModuleEvents = function () {
            return [
                new HomeUiEvent(HomeUiEvent.SHOW_HOME_UI_PANEL),
                new HomeUiEvent(HomeUiEvent.HIDE_HOME_UI_PANEL),
                new HomeUiEvent(HomeUiEvent.REFRESH_HOME_UI_PANEL),
            ];
        };
        return HomeUiProcessor;
    })(BaseProcessor);
    homeui.HomeUiProcessor = HomeUiProcessor;
})(homeui || (homeui = {}));
//# sourceMappingURL=HomeUiProcessor.js.map