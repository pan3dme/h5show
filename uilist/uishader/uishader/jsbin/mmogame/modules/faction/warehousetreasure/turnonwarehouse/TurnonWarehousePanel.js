var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var turnonwarehouse;
(function (turnonwarehouse) {
    var TurnonWarehousePanel = (function (_super) {
        __extends(TurnonWarehousePanel, _super);
        function TurnonWarehousePanel() {
            _super.call(this);
            this.uiAtlasComplet = false;
            this.setBlackBg();
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
            this._midRender.uiAtlas = new UIAtlas;
        }
        TurnonWarehousePanel.prototype.dispose = function () {
            this._midRender.dispose();
            this._midRender = null;
            if (this.treasurehouseUpList) {
                this.treasurehouseUpList.dispose();
                this.treasurehouseUpList = null;
            }
            _super.prototype.dispose.call(this);
        };
        TurnonWarehousePanel.prototype.applyLoad = function () {
            var _this = this;
            this._midRender.uiAtlas.setInfo("ui/uidata/faction/warehousetreasure/warehousetreasure.xml", "ui/uidata/faction/warehousetreasure/warehousetreasure.png", function () { _this.loadConfigCom(); }, "ui/uidata/faction/warehousetreasure/warehouseuse.png");
        };
        TurnonWarehousePanel.prototype.loadConfigCom = function () {
            this.addChild(this._midRender.getComponent("f_tittle_txt"));
            this.treasurehouseUpList = new turnonwarehouse.TurnonWarehouseList(this);
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
        };
        TurnonWarehousePanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        TurnonWarehousePanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.c_close:
                    this.hide();
                    break;
            }
        };
        TurnonWarehousePanel.prototype.show = function () {
            if (!this.hasStage) {
                this.treasurehouseUpList.show();
                UIManager.getInstance().addUIContainer(this);
            }
        };
        TurnonWarehousePanel.prototype.refresh = function () {
            if (this.hasStage) {
                this.treasurehouseUpList.show();
            }
        };
        TurnonWarehousePanel.prototype.hide = function () {
            if (this.hasStage) {
                this.treasurehouseUpList.hide();
                UIManager.getInstance().removeUIContainer(this);
            }
        };
        return TurnonWarehousePanel;
    })(WindowCentenMin);
    turnonwarehouse.TurnonWarehousePanel = TurnonWarehousePanel;
})(turnonwarehouse || (turnonwarehouse = {}));
//# sourceMappingURL=TurnonWarehousePanel.js.map