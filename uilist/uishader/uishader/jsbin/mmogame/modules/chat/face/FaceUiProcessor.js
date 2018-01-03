var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var faceui;
(function (faceui) {
    var FaceUiModule = (function (_super) {
        __extends(FaceUiModule, _super);
        function FaceUiModule() {
            _super.apply(this, arguments);
        }
        FaceUiModule.prototype.getModuleName = function () {
            return "FaceUiModule";
        };
        FaceUiModule.prototype.listProcessors = function () {
            return [new FaceUiProcessor()];
        };
        return FaceUiModule;
    })(Module);
    faceui.FaceUiModule = FaceUiModule;
    var FaceUiEvent = (function (_super) {
        __extends(FaceUiEvent, _super);
        function FaceUiEvent() {
            _super.apply(this, arguments);
        }
        FaceUiEvent.SHOW_FACE_UI_PANEL = "SHOW_FACE_UI_PANEL";
        FaceUiEvent.HIDE_FACE_UI_PANEL = "HIDE_FACE_UI_PANEL";
        return FaceUiEvent;
    })(BaseEvent);
    faceui.FaceUiEvent = FaceUiEvent;
    var FaceUiProcessor = (function (_super) {
        __extends(FaceUiProcessor, _super);
        function FaceUiProcessor() {
            _super.apply(this, arguments);
        }
        FaceUiProcessor.prototype.getName = function () {
            return "FaceUiProcessor";
        };
        FaceUiProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof FaceUiEvent) {
                var $faceUiEvent = $event;
                if ($faceUiEvent.type == FaceUiEvent.SHOW_FACE_UI_PANEL) {
                    this.showPanel();
                    this.faceUiPanel.bfun = $faceUiEvent.data.bfun;
                    if ($faceUiEvent.data.left) {
                        this.faceUiPanel.left = $faceUiEvent.data.left;
                    }
                    if ($faceUiEvent.data.bottom) {
                        this.faceUiPanel.bottom = $faceUiEvent.data.bottom;
                    }
                }
                if ($faceUiEvent.type == FaceUiEvent.HIDE_FACE_UI_PANEL) {
                    this.hidePanel();
                }
            }
        };
        FaceUiProcessor.prototype.hidePanel = function () {
            if (this.faceUiPanel) {
                UIManager.getInstance().removeUIContainer(this.faceUiPanel);
            }
        };
        FaceUiProcessor.prototype.showPanel = function () {
            var _this = this;
            if (!this.faceUiPanel) {
                this.faceUiPanel = new faceui.FaceUiPanel();
            }
            this.faceUiPanel.load(function () {
                UIManager.getInstance().addUIContainer(_this.faceUiPanel);
            }, false);
        };
        FaceUiProcessor.prototype.listenModuleEvents = function () {
            return [
                new FaceUiEvent(FaceUiEvent.SHOW_FACE_UI_PANEL),
                new FaceUiEvent(FaceUiEvent.HIDE_FACE_UI_PANEL),
            ];
        };
        return FaceUiProcessor;
    })(BaseProcessor);
    faceui.FaceUiProcessor = FaceUiProcessor;
})(faceui || (faceui = {}));
//# sourceMappingURL=FaceUiProcessor.js.map