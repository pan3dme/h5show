var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MaterialEvent = (function (_super) {
        __extends(MaterialEvent, _super);
        function MaterialEvent() {
            _super.apply(this, arguments);
        }
        MaterialEvent.INIT_MATERIA_PANEL = "SHOW_MAP_EVENT"; //显示面板
        MaterialEvent.HIDE_MAP_EVENT = "HIDE_MAP_EVENT"; //显示面板
        return MaterialEvent;
    })(BaseEvent);
    materialui.MaterialEvent = MaterialEvent;
    var MaterialModule = (function (_super) {
        __extends(MaterialModule, _super);
        function MaterialModule() {
            _super.apply(this, arguments);
        }
        MaterialModule.prototype.getModuleName = function () {
            return "MaterialModule";
        };
        MaterialModule.prototype.listProcessors = function () {
            return [new MaterialProcessor()];
        };
        return MaterialModule;
    })(Module);
    materialui.MaterialModule = MaterialModule;
    var MaterialProcessor = (function (_super) {
        __extends(MaterialProcessor, _super);
        function MaterialProcessor() {
            _super.apply(this, arguments);
        }
        MaterialProcessor.prototype.getName = function () {
            return "MaterialProcessor";
        };
        MaterialProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof MaterialEvent) {
                var $materialEvent = $event;
                if ($materialEvent.type == MaterialEvent.INIT_MATERIA_PANEL) {
                    this.openMaterialPanel();
                }
                if ($materialEvent.type == MaterialEvent.HIDE_MAP_EVENT) {
                }
            }
            if ($event instanceof materialui.MEvent_Material_Connect) {
                var $mevent_Material_Connect = $event;
                if ($mevent_Material_Connect.type == materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG) {
                    this.startDragLine($mevent_Material_Connect.itemNode);
                }
                if ($mevent_Material_Connect.type == materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG) {
                    this.stopDragLine($mevent_Material_Connect.itemNode);
                }
                if ($mevent_Material_Connect.type == materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE) {
                    this.stopDragLine($mevent_Material_Connect.itemNode);
                }
            }
        };
        MaterialProcessor.prototype.startDragLine = function ($node) {
            this.lineContainer.startLine($node);
        };
        MaterialProcessor.prototype.stopDragLine = function ($node) {
            this.lineContainer.stopLine($node);
        };
        MaterialProcessor.prototype.listenModuleEvents = function () {
            return [
                new MaterialEvent(MaterialEvent.INIT_MATERIA_PANEL),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE),
            ];
        };
        MaterialProcessor.prototype.openMaterialPanel = function () {
            var _this = this;
            Arpg2dGameStart.stagePos = new Vector2D();
            materialui.BaseMaterialNodeUI.baseUIAtlas = new UIAtlas();
            materialui.BaseMaterialNodeUI.baseUIAtlas.setInfo("pan/marmoset/uilist/baseui.xml", "pan/marmoset/uilist/baseui.png", function () { _this.loadConfigCom(); });
        };
        MaterialProcessor.prototype.loadConfigCom = function () {
            var _this = this;
            this.lineContainer = new materialui.MaterialLineContainer();
            UIManager.getInstance().addUIContainer(this.lineContainer);
            UIManager.getInstance().addUIContainer(new materialui.TextureSampleNodeUI());
            UIManager.getInstance().addUIContainer(new materialui.MathAddNodeUI());
            UIManager.getInstance().addUIContainer(new materialui.ResultNodeUI());
            document.addEventListener(MouseType.MouseWheel, function ($evt) { _this.onMouseWheel($evt); });
            document.addEventListener(MouseType.MouseDown, function ($evt) { _this.onMouse($evt); });
            document.addEventListener(MouseType.MouseMove, function ($evt) { _this.onMouseMove($evt); });
            document.addEventListener(MouseType.MouseUp, function ($evt) { _this.onMouseUp($evt); });
            document.addEventListener(MouseType.KeyDown, function ($evt) { _this.onKeyDown($evt); });
            document.addEventListener(MouseType.KeyUp, function ($evt) { _this.onKeyUp($evt); });
            var myMenu = document.getElementById("myMenu");
            document.addEventListener("contextmenu", function (event) {
                event.preventDefault();
                console.log("右键");
            });
            GameMouseManager.getInstance().addMouseEvent();
        };
        MaterialProcessor.prototype.onKeyDown = function ($evt) {
            Arpg2dGameStart.altKey = $evt.altKey;
            switch ($evt.keyCode) {
                case KeyboardType.C:
                    UIManager.getInstance().addUIContainer(new materialui.MathAddNodeUI());
                    break;
                default:
                    break;
            }
        };
        MaterialProcessor.prototype.onKeyUp = function ($evt) {
            Arpg2dGameStart.altKey = $evt.altKey;
        };
        MaterialProcessor.prototype.onMouse = function ($e) {
            if ($e.type == MouseType.MouseDown) {
                if ($e.button == 1) {
                    this._isMidelMouse = true;
                    this.mouseXY = new Vector2D($e.x, $e.y);
                }
            }
        };
        MaterialProcessor.prototype.onMouseMove = function ($e) {
            if (this._isMidelMouse) {
                var $txy = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y);
                Arpg2dGameStart.stagePos.x += $txy.x;
                Arpg2dGameStart.stagePos.y += $txy.y;
                for (var i = 0; i < UIManager.getInstance()._containerList.length; i++) {
                    var $uiConatiner = UIManager.getInstance()._containerList[i];
                    $uiConatiner.left += $txy.x;
                    $uiConatiner.top += $txy.y;
                }
                this.mouseXY = new Vector2D($e.x, $e.y);
                UIManager.getInstance().resize();
            }
        };
        MaterialProcessor.prototype.onMouseUp = function ($e) {
            this._isMidelMouse = false;
        };
        MaterialProcessor.prototype.onMouseWheel = function ($evt) {
            UIData.Scale += ($evt.wheelDelta / 1000);
            UIManager.getInstance().resize();
        };
        return MaterialProcessor;
    })(BaseProcessor);
    materialui.MaterialProcessor = MaterialProcessor;
})(materialui || (materialui = {}));
//# sourceMappingURL=MaterialProcessor.js.map