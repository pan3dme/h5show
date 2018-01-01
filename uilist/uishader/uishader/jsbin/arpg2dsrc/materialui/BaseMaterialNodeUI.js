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
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._bottomRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._topRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this._topRender.uiAtlas = BaseMaterialNodeUI.baseUIAtlas;
            this.loadConfigCom();
        }
        BaseMaterialNodeUI.prototype.loadConfigCom = function () {
            this.a_tittle_bg = this.addEvntBut("a_tittle_bg", this._bottomRender);
            this.a_cell_base_bg = this.addEvntBut("a_cell_base_bg", this._bottomRender);
            this.a_tittle_bg.x = 0;
            this.a_tittle_bg.y = 0;
            this.a_tittle_bg.goToAndStop(0);
            this.a_cell_base_bg.x = 0;
            this.a_cell_base_bg.y = this.a_tittle_bg.height;
            this.a_cell_base_bg.width = this.a_tittle_bg.width;
            this.inPutItemVec = new Array;
            this.outPutItemVec = new Array;
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
            this.refreshNodePos();
        };
        BaseMaterialNodeUI.prototype.refreshNodePos = function () {
        };
        BaseMaterialNodeUI.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_tittle_bg:
                    this.addStageMoveEvets(evt);
                    break;
                default:
                    this.clikUiEvent(evt.target);
                    break;
            }
        };
        BaseMaterialNodeUI.prototype.clikUiEvent = function (evt) {
        };
        BaseMaterialNodeUI.prototype.addStageMoveEvets = function ($e) {
            this.lastPanelPos = new Vector2D(this.left, this.top);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        BaseMaterialNodeUI.prototype.onMove = function ($e) {
            this.left = this.lastPanelPos.x + ($e.x - this.mouseXY.x);
            this.top = this.lastPanelPos.y + ($e.y - this.mouseXY.y);
            this.resize();
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