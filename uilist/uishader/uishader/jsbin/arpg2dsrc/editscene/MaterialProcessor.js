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
    var MaterialEvent = /** @class */ (function (_super) {
        __extends(MaterialEvent, _super);
        function MaterialEvent() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MaterialEvent.SHOW_MATERIA_PANEL = "INIT_MATERIA_PANEL"; //
        MaterialEvent.SAVE_MATERIA_PANEL = "SAVE_MATERIA_PANEL"; //
        MaterialEvent.SELECT_MATERIAL_NODE_UI = "SELECT_MATERIAL_NODE_UI"; //
        MaterialEvent.COMPILE_MATERIAL = "COMPILE_MATERIAL"; //
        MaterialEvent.SCENE_UI_TRUE_MOVE = "SCENE_UI_TRUE_MOVE"; //
        return MaterialEvent;
    }(BaseEvent));
    materialui.MaterialEvent = MaterialEvent;
    var MaterialModule = /** @class */ (function (_super) {
        __extends(MaterialModule, _super);
        function MaterialModule() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MaterialModule.prototype.getModuleName = function () {
            return "MaterialModule";
        };
        MaterialModule.prototype.listProcessors = function () {
            return [new MaterialProcessor()];
        };
        return MaterialModule;
    }(Module));
    materialui.MaterialModule = MaterialModule;
    var MaterialProcessor = /** @class */ (function (_super) {
        __extends(MaterialProcessor, _super);
        function MaterialProcessor() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MaterialProcessor.prototype.getName = function () {
            return "MaterialProcessor";
        };
        MaterialProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof MaterialEvent) {
                var $materialEvent = $event;
                if ($materialEvent.type == MaterialEvent.SHOW_MATERIA_PANEL) {
                    this.openMaterialPanel();
                }
                if ($materialEvent.type == MaterialEvent.SAVE_MATERIA_PANEL) {
                    this.saveMateriaPanel();
                }
                if ($materialEvent.type == MaterialEvent.SELECT_MATERIAL_NODE_UI) {
                    this.selectNodeUi($materialEvent.nodeUi);
                }
                if ($materialEvent.type == MaterialEvent.COMPILE_MATERIAL) {
                    materialui.MaterialCompile.getInstance().compile(materialui.MaterialCtrl.getInstance().nodeList, this.baseMaterialTree);
                }
                if ($materialEvent.type == MaterialEvent.SCENE_UI_TRUE_MOVE) {
                    this.stageMoveTx($materialEvent.v2d);
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
                    this.removeLine($mevent_Material_Connect.line);
                }
                if ($mevent_Material_Connect.type == materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE) {
                    this.setConnetLine($mevent_Material_Connect.startNode, $mevent_Material_Connect.endNode);
                }
            }
        };
        MaterialProcessor.prototype.setConnetLine = function ($startItem, $endItem) {
            this.lineContainer.addConnentLine($startItem, $endItem);
        };
        MaterialProcessor.prototype.saveMateriaPanel = function () {
            this._materialTree = new materialui.MaterialTree();
            this._materialTree.data = materialui.MaterialCtrl.getInstance().getObj();
            console.log(this._materialTree.data);
        };
        MaterialProcessor.prototype.selectNodeUi = function ($nodeUi) {
            for (var i = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $temp = UIManager.getInstance()._containerList[i];
                if ($temp) {
                    $temp.select = Boolean($nodeUi == $temp);
                }
            }
        };
        MaterialProcessor.prototype.removeLine = function ($line) {
            this.lineContainer.removeLine($line);
        };
        MaterialProcessor.prototype.startDragLine = function ($node) {
            this.lineContainer.startLine($node);
        };
        MaterialProcessor.prototype.stopDragLine = function ($node) {
            this.lineContainer.stopLine($node);
        };
        MaterialProcessor.prototype.listenModuleEvents = function () {
            return [
                new MaterialEvent(MaterialEvent.SHOW_MATERIA_PANEL),
                new MaterialEvent(MaterialEvent.SELECT_MATERIAL_NODE_UI),
                new MaterialEvent(MaterialEvent.SAVE_MATERIA_PANEL),
                new MaterialEvent(MaterialEvent.COMPILE_MATERIAL),
                new MaterialEvent(MaterialEvent.SCENE_UI_TRUE_MOVE),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE),
                new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE),
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
            var readtxt = true;
            if (readtxt) {
                this.readMaterialTree();
            }
            else {
                // MaterialCtrl.getInstance().addNodeUI(new ResultNodeUI())
                // MaterialCtrl.getInstance().addNodeUI(new TextureSampleNodeUI())
            }
            document.addEventListener(MouseType.MouseWheel, function ($evt) { _this.onMouseWheel($evt); });
            document.addEventListener(MouseType.MouseDown, function ($evt) { _this.onMouse($evt); });
            document.addEventListener(MouseType.MouseMove, function ($evt) { _this.onMouseMove($evt); });
            document.addEventListener(MouseType.MouseUp, function ($evt) { _this.onMouseUp($evt); });
            document.addEventListener(MouseType.KeyDown, function ($evt) { _this.onKeyDown($evt); });
            document.addEventListener(MouseType.KeyUp, function ($evt) { _this.onKeyUp($evt); });
            document.addEventListener("contextmenu", function (event) {
                event.preventDefault();
                var $rightMenuEvet = new materialui.RightMenuEvent(materialui.RightMenuEvent.SHOW_RIGHT_MENU);
                $rightMenuEvet.posv2d = new Vector2D(event.clientX, event.clientY);
                ModuleEventManager.dispatchEvent($rightMenuEvet);
            });
        };
        MaterialProcessor.prototype.readMaterialTree = function () {
            var _this = this;
            var $url = "pan/marmoset/uilist/baseTexturedata1.txt";
            materialui.MaterialTreeManager.getInstance().getMaterial($url, function ($materialTree) {
                _this.baseMaterialTree = $materialTree;
                materialui.MaterialViewBuildUtils.getInstance().addFun = function (ui) { materialui.MaterialCtrl.getInstance().addNodeUI(ui); };
                materialui.MaterialViewBuildUtils.getInstance().setData($materialTree.data);
                ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
                //  this.stageMoveTx(new Vector2D(-1000, 0));
            });
        };
        MaterialProcessor.prototype.onKeyDown = function ($evt) {
            Arpg2dGameStart.altKey = $evt.altKey;
            switch ($evt.keyCode) {
                case KeyboardType.C:
                    break;
                case KeyboardType.Delete:
                    var $selectUi = this.getSelUI();
                    if ($selectUi) {
                        this.delUI($selectUi);
                    }
                    break;
                case KeyboardType.S:
                    if ($evt.altKey) {
                        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SAVE_MATERIA_PANEL));
                    }
                case KeyboardType.O:
                    ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
                    break;
                case KeyboardType.Z:
                    materialui.MtlUiData.Scale += 0.1;
                    UIManager.getInstance().resize();
                    break;
                default:
                    break;
            }
        };
        MaterialProcessor.prototype.delUI = function ($ui) {
            if ($ui instanceof materialui.ResultNodeUI) {
                return;
            }
            $ui.removeAllNodeLine();
            UIManager.getInstance().removeUIContainer($ui);
        };
        MaterialProcessor.prototype.getSelUI = function () {
            for (var i = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $temp = UIManager.getInstance()._containerList[i];
                if ($temp && $temp.select) {
                    return $temp;
                }
            }
            return null;
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
                $txy.x /= materialui.MtlUiData.Scale;
                $txy.y /= materialui.MtlUiData.Scale;
                this.stageMoveTx($txy);
                this.mouseXY = new Vector2D($e.x, $e.y);
            }
        };
        MaterialProcessor.prototype.onMouseUp = function ($e) {
            this._isMidelMouse = false;
        };
        MaterialProcessor.prototype.onMouseWheel = function ($evt) {
            var $slectUi = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($evt.x, $evt.y));
            if ($slectUi && $slectUi.name == "modelPic") {
                Scene_data.cam3D.distance += ($evt.wheelDelta * Scene_data.cam3D.distance) / 1000;
            }
            else {
                materialui.MtlUiData.Scale = Math.max(0.15, materialui.MtlUiData.Scale);
                var $addScale = $evt.wheelDelta > 0 ? +0.1 : -0.1;
                materialui.MtlUiData.Scale += $addScale;
            }
        };
        MaterialProcessor.prototype.stageMoveTx = function ($txy) {
            Arpg2dGameStart.stagePos.x += $txy.x;
            Arpg2dGameStart.stagePos.y += $txy.y;
            for (var i = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $uiConatiner = UIManager.getInstance()._containerList[i];
                if ($uiConatiner instanceof materialui.MtUiPanel) {
                    $uiConatiner.left += $txy.x;
                    $uiConatiner.top += $txy.y;
                }
            }
            UIManager.getInstance().resize();
        };
        return MaterialProcessor;
    }(BaseProcessor));
    materialui.MaterialProcessor = MaterialProcessor;
})(materialui || (materialui = {}));
//# sourceMappingURL=MaterialProcessor.js.map