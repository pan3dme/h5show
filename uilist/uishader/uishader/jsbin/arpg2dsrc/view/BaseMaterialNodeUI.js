var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var BaseMaterialNodeUI = (function (_super) {
        __extends(BaseMaterialNodeUI, _super);
        function BaseMaterialNodeUI() {
            _super.call(this);
            this.gap = 20;
            this.name = "BaseMaterialNodeUI" + random(9999999);
            this.width = 200;
            this.height = 200;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._bottomRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._midRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._topRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._container = new materialui.PanelContainer(this, this._topRender);
            this.loadConfigCom();
        }
        BaseMaterialNodeUI.prototype.setInItemByData = function (ary) {
        };
        BaseMaterialNodeUI.prototype.setOutItemByData = function (ary) {
        };
        BaseMaterialNodeUI.prototype.setData = function (obj) {
            this.left = obj.x + 500;
            this.top = obj.y + 300;
            this.nodeTree.isDynamic = obj.isDynamic;
            this.nodeTree.paramName = obj.paramName;
        };
        BaseMaterialNodeUI.prototype.getData = function () {
            var obj = new Object;
            obj.x = this.left;
            obj.y = this.top;
            obj.name = this.name;
            obj.isDynamic = this.nodeTree.isDynamic;
            obj.paramName = this.nodeTree.paramName;
            return obj;
        };
        BaseMaterialNodeUI.prototype.getObj = function () {
            return this.nodeTree.getObj();
        };
        BaseMaterialNodeUI.prototype.resetBgSize = function () {
            this.a_cell_base_bg.height = this.height;
            this.a_select_line.x = 0;
            this.a_select_line.y = 0;
            this.a_select_line.width = this.width;
            this.a_select_line.height = this.height + 25;
        };
        BaseMaterialNodeUI.prototype.loadConfigCom = function () {
            this.a_cell_base_bg = this._bottomRender.getComponent("a_cell_base_bg");
            this.addChild(this.a_cell_base_bg);
            this.a_tittle_bg = this.addEvntBut("a_tittle_bg", this._bottomRender);
            this.a_select_line = this._topRender.getComponent("a_select_line");
            this.a_panel_title_frame = this._topRender.getComponent("a_panel_title_frame");
            this.a_panel_title_frame.goToAndStop(BaseMaterialNodeUI.titleFrameId++);
            this.a_panel_title_frame.x = 20;
            this.addChild(this.a_panel_title_frame);
            this.a_tittle_bg.x = 0;
            this.a_tittle_bg.y = 0;
            this.a_tittle_bg.goToAndStop(0);
            this.a_cell_base_bg.x = 0;
            this.a_cell_base_bg.y = this.a_tittle_bg.height;
            this.inPutItemVec = new Array;
            this.outPutItemVec = new Array;
            this.resetBgSize();
            this.drawTitleToFrame("材质");
        };
        BaseMaterialNodeUI.prototype.drawTitleToFrame = function ($str) {
            this.drawTextToName(this.a_panel_title_frame, $str);
        };
        BaseMaterialNodeUI.prototype.drawTextToName = function ($ui, $str) {
            var $toRect = $ui.getSkinCtxRect();
            var $ctx = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            LabelTextFont.writeSingleLabelToCtx($ctx, $str, 20, 0, 0, TextAlign.LEFT);
            $ui.drawToCtx(this._bottomRender.uiAtlas, $ctx);
            console.log(150 * 1.5, 14 * 1.5);
        };
        BaseMaterialNodeUI.prototype.addItems = function ($nodeUI) {
            if ($nodeUI.inOut) {
                if (this.inPutItemVec.indexOf($nodeUI) == -1) {
                    this.inPutItemVec.push($nodeUI);
                    this.nodeTree.addInput($nodeUI.nodeTreeItem);
                }
            }
            else {
                if (this.outPutItemVec.indexOf($nodeUI) == -1) {
                    this.outPutItemVec.push($nodeUI);
                    this.nodeTree.addOutput($nodeUI.nodeTreeItem);
                }
            }
            $nodeUI.parent = this;
            this._container.addChild($nodeUI);
            this.refreshNodePos();
        };
        BaseMaterialNodeUI.prototype.removeItem = function ($nodeUI) {
            for (var i = 0; i < this.inPutItemVec.length; i++) {
                if (this.inPutItemVec[i] == $nodeUI) {
                    this.inPutItemVec.splice(i, 1);
                }
            }
            this.nodeTree.removeInput($nodeUI.nodeTreeItem);
            for (i = 0; i < this.outPutItemVec.length; i++) {
                if (this.outPutItemVec[i] == $nodeUI) {
                    this.outPutItemVec.splice(i, 1);
                }
            }
            this.nodeTree.removeOutput($nodeUI.nodeTreeItem);
            if ($nodeUI.parent) {
                this._container.removeChild($nodeUI);
            }
            this.refreshNodePos();
        };
        BaseMaterialNodeUI.prototype.refreshNodePos = function () {
            for (var i = 0; i < this.inPutItemVec.length; i++) {
                this.inPutItemVec[i].y = this.gap * i + 30;
                this.inPutItemVec[i].x = 10;
            }
            for (i = 0; i < this.outPutItemVec.length; i++) {
                this.outPutItemVec[i].y = this.gap * i + 30;
                this.outPutItemVec[i].x = 130;
            }
        };
        BaseMaterialNodeUI.prototype.removeAllNodeLine = function () {
            for (var i = 0; i < this.inPutItemVec.length; i++) {
                this.inPutItemVec[i].removeAllLine();
            }
            for (i = 0; i < this.outPutItemVec.length; i++) {
                this.outPutItemVec[i].removeAllLine();
            }
        };
        BaseMaterialNodeUI.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_tittle_bg:
                    this.addStageMoveEvets(evt);
                    break;
                default:
                    this.clikUiEvent(evt);
                    break;
            }
            var $materialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SELECT_MATERIAL_NODE_UI);
            $materialEvent.nodeUi = this;
            ModuleEventManager.dispatchEvent($materialEvent);
        };
        BaseMaterialNodeUI.prototype.getInItem = function ($id) {
            return this.inPutItemVec[$id];
        };
        BaseMaterialNodeUI.prototype.getOutItem = function ($id) {
            return this.outPutItemVec[$id];
        };
        BaseMaterialNodeUI.prototype.clikUiEvent = function ($mouseEvt) {
            var $itemMaterialUI = this.getPointFrameTagetFoItemVec($mouseEvt.target);
            if (Arpg2dGameStart.altKey) {
                $itemMaterialUI.removeAllLine();
                return;
            }
            if ($itemMaterialUI) {
                var $MEvent_Material_Connect = new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG);
                $MEvent_Material_Connect.itemNode = $itemMaterialUI;
                ModuleEventManager.dispatchEvent($MEvent_Material_Connect);
            }
        };
        BaseMaterialNodeUI.prototype.getPointFrameTagetFoItemVec = function ($targer) {
            for (var i = 0; i < this.inPutItemVec.length; i++) {
                if (this.inPutItemVec[i].pointframe == $targer) {
                    return this.inPutItemVec[i];
                }
            }
            for (i = 0; i < this.outPutItemVec.length; i++) {
                if (this.outPutItemVec[i].pointframe == $targer) {
                    return this.outPutItemVec[i];
                }
            }
            return null;
        };
        BaseMaterialNodeUI.prototype.addStageMoveEvets = function ($e) {
            this.lastPanelPos = new Vector2D(this.left, this.top);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        BaseMaterialNodeUI.prototype.onMove = function ($e) {
            this.left = this.lastPanelPos.x + ($e.x - this.mouseXY.x) / UIData.Scale;
            this.top = this.lastPanelPos.y + ($e.y - this.mouseXY.y) / UIData.Scale;
            this.resize();
            this.drawLine();
        };
        BaseMaterialNodeUI.prototype.drawLine = function () {
            for (var i = 0; i < this.inPutItemVec.length; i++) {
                this.inPutItemVec[i].drawLine();
            }
            for (i = 0; i < this.outPutItemVec.length; i++) {
                this.outPutItemVec[i].drawLine();
            }
        };
        BaseMaterialNodeUI.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        Object.defineProperty(BaseMaterialNodeUI.prototype, "select", {
            get: function () {
                return this._select;
            },
            set: function (value) {
                this._select = value;
                this.setUiListVisibleByItem([this.a_select_line], this._select);
            },
            enumerable: true,
            configurable: true
        });
        BaseMaterialNodeUI.titleFrameId = 0;
        return BaseMaterialNodeUI;
    })(UIPanel);
    materialui.BaseMaterialNodeUI = BaseMaterialNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=BaseMaterialNodeUI.js.map