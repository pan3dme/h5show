var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var prop;
(function (prop) {
    var TexturePropMeshPanel = (function (_super) {
        __extends(TexturePropMeshPanel, _super);
        function TexturePropMeshPanel() {
            _super.apply(this, arguments);
        }
        TexturePropMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.Texturue2DUI, Label: "纹理:", FunKey: "picurl", target: this, Category: "属性" },
                { Type: prop.ReflectionData.ComboBox, Label: "warp:", FunKey: "constValue", target: this, Category: "属性" },
                { Type: prop.ReflectionData.ComboBox, Label: "mipmin:", FunKey: "constValue", target: this, Category: "属性" },
                { Type: prop.ReflectionData.ComboBox, Label: "filter:", FunKey: "constValue", target: this, Category: "属性" },
                { Type: prop.ReflectionData.ComboBox, Label: "预乘:", FunKey: "constValue", target: this, Category: "属性" },
            ];
            return ary;
        };
        Object.defineProperty(TexturePropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.textureSampleNodeUI = this._data;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TexturePropMeshPanel.prototype, "picurl", {
            get: function () {
                return this.textureSampleNodeUI.nodeTree.url;
            },
            set: function (value) {
                this.textureSampleNodeUI.nodeTree.url = value;
            },
            enumerable: true,
            configurable: true
        });
        return TexturePropMeshPanel;
    })(prop.MetaDataView);
    prop.TexturePropMeshPanel = TexturePropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=TexturePropMeshPanel.js.map