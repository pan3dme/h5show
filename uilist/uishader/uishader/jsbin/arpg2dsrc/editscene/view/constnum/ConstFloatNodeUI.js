var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var ConstFloatNodeUI = (function (_super) {
        __extends(ConstFloatNodeUI, _super);
        function ConstFloatNodeUI() {
            _super.call(this);
            this.gap = 20;
            this.width = 162;
            this.height = 65;
            this._constValue = 0;
            this.nodeTree = new materialui.NodeTreeFloat;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.FLOAT;
            this.outItem = new materialui.ItemMaterialUI("out", materialui.MaterialItemType.FLOAT, false);
            this.addItems(this.outItem);
            this.drawTitleToFrame("float");
        }
        ConstFloatNodeUI.prototype.setData = function (obj) {
            _super.prototype.setData.call(this, obj);
            this.constValue = obj.constValue;
            this.nodeTree.constValue = this.constValue;
            this.showDynamic();
        };
        Object.defineProperty(ConstFloatNodeUI.prototype, "constValue", {
            get: function () {
                return this._constValue;
            },
            set: function (value) {
                this._constValue = value;
                this.nodeTree.constValue = value;
                this.showDynamic();
            },
            enumerable: true,
            configurable: true
        });
        ConstFloatNodeUI.prototype.showDynamic = function () {
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("float<" + this.nodeTree.paramName + ">(" + this.getNumStr(this._constValue) + ")");
            }
            else {
                this.drawTitleToFrame("float(" + this.getNumStr(this._constValue) + ")");
            }
        };
        ConstFloatNodeUI.prototype.getNumStr = function (num) {
            var n = Math.floor(num * 100) / 100;
            return n.toString();
        };
        return ConstFloatNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.ConstFloatNodeUI = ConstFloatNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ConstFloatNodeUI.js.map