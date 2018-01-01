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
        BaseMaterialNodeUI.prototype.resetBgSize = function () {
            this.a_cell_base_bg.height = this.height;
        };
        BaseMaterialNodeUI.prototype.loadConfigCom = function () {
            this.a_tittle_bg = this.addEvntBut("a_tittle_bg", this._bottomRender);
            this.a_cell_base_bg = this.addEvntBut("a_cell_base_bg", this._bottomRender);
            this.a_tittle_bg.x = 0;
            this.a_tittle_bg.y = 0;
            this.a_tittle_bg.goToAndStop(0);
            this.a_cell_base_bg.x = 0;
            this.a_cell_base_bg.y = this.a_tittle_bg.height;
            this.inPutItemVec = new Array;
            this.outPutItemVec = new Array;
            this.resetBgSize();
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
        BaseMaterialNodeUI.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_tittle_bg:
                    this.addStageMoveEvets(evt);
                    break;
                default:
                    this.clikUiEvent(evt);
                    break;
            }
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
        return BaseMaterialNodeUI;
    })(UIPanel);
    materialui.BaseMaterialNodeUI = BaseMaterialNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=BaseMaterialNodeUI.js.map