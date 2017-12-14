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
var camand;
(function (camand) {
    var CammandRender = /** @class */ (function (_super) {
        __extends(CammandRender, _super);
        function CammandRender() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CammandRender.prototype.draw = function () {
            var ctx = UIManager.getInstance().getContext2D(this.uvData.ow, this.uvData.oh, false);
            UiDraw.cxtDrawImg(ctx, PuiData.Slist_select, new Rectangle(0, 0, 98, 50), UIData.publicUi);
            this.drawLable(ctx, 50, 15, this._listItemData.data.txt, 16, "#000000", false);
            this.atlas.updateCtx(ctx, this.uvData.ox, this.uvData.oy);
        };
        CammandRender.prototype.drawLable = function (ctx, $xpos, $ypos, $str, fontsize, fontColor, bolder) {
            if (bolder === void 0) { bolder = false; }
            ctx.textBaseline = TextAlign.TOP;
            ctx.textAlign = TextAlign.CENTER;
            ctx.fillStyle = fontColor;
            ctx.font = (bolder ? "bolder " : "") + fontsize + "px" + UIData.font;
            ctx.fillText($str, $xpos, $ypos);
        };
        return CammandRender;
    }(ListItemRender));
    camand.CammandRender = CammandRender;
    var CammandPanel = /** @class */ (function (_super) {
        __extends(CammandPanel, _super);
        function CammandPanel() {
            var _this = _super.call(this) || this;
            //  this.makeBgWinPanel();
            _this.width = 600;
            _this.height = 400;
            _this.center = 0;
            _this.middle = 0;
            _this._listRender = new UIListRenderComponent;
            _this.addRender(_this._listRender);
            _this._baseRender = new UIRenderComponent();
            _this.addRender(_this._baseRender);
            _this.addList();
            return _this;
        }
        CammandPanel.prototype.addList = function () {
            var $pos = new Vector2D(30, 20);
            this._bgList = this._listRender.createGridList();
            this._bgList.x = $pos.x;
            this._bgList.y = $pos.y;
            this.addChild(this._bgList);
            this._bgMask = new UIMask();
            this._bgMask.x = $pos.x;
            this._bgMask.y = $pos.y;
            this._bgMask.width = 512;
            this._bgMask.height = 300;
            this.addMask(this._bgMask);
            this._listRender.mask = this._bgMask;
            this.refreshData();
        };
        CammandPanel.prototype.refreshData = function () {
            var _this = this;
            var ary = new Array;
            var butItem = [
                "回主城",
                "去新手村",
                "慈云寺",
                "莽苍山",
                "去幻境",
                "测试场景",
                "显示A星",
            ];
            for (var i = 0; i < butItem.length; i++) {
                var listItemData = new ListItemData();
                listItemData.data = { txt: butItem[i], id: i };
                listItemData.clickFun = function ($listItemData) { _this.itemDataClick($listItemData); };
                ary.push(listItemData);
            }
            this._bgList.contentY = 0;
            this._bgList.setGridData(ary, CammandRender, 5, 100, 50, 512, 512, 512, 300);
        };
        CammandPanel.prototype.itemDataClick = function ($listItemData) {
            var str = $listItemData.data.txt;
            console.log(str);
            switch (str) {
                case "回主城":
                    NetManager.getInstance().protocolos.teleport_map(1, GuidData.map.getLineID());
                    break;
                case "去新手村":
                    NetManager.getInstance().protocolos.teleport_map(1001, GuidData.map.getLineID());
                    break;
                case "莽苍山":
                    NetManager.getInstance().protocolos.teleport_map(1002, GuidData.map.getLineID());
                    break;
                case "慈云寺":
                    NetManager.getInstance().protocolos.teleport_map(1003, GuidData.map.getLineID());
                    break;
                case "测试场景":
                    NetManager.getInstance().protocolos.teleport_map(1007, GuidData.map.getLineID());
                    break;
                case "去幻境":
                    NetManager.getInstance().protocolos.enter_risk_instance();
                    break;
                case "显示A星":
                    SceneAstarModel.getInstance().showAstarLine();
                    break;
                default:
                    break;
            }
            this.hide();
        };
        CammandPanel.prototype.hide = function () {
            if (this.hasStage) {
                UIManager.getInstance().removeUIContainer(this);
                Scene_data.uiBlankStage.removeEventListener(InteractiveEvent.Down, this.onStageMouseUp, this);
            }
        };
        CammandPanel.prototype.show = function () {
            if (!this.hasStage) {
                UIManager.getInstance().addUIContainer(this);
                Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Up, this.onStageMouseUp, this);
            }
        };
        CammandPanel.prototype.onStageMouseUp = function (evt) {
            this.hide();
        };
        return CammandPanel;
    }(UIConatiner));
    camand.CammandPanel = CammandPanel;
})(camand || (camand = {}));
//# sourceMappingURL=CammandPanel.js.map