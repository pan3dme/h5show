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
                { Type: prop.ReflectionData.NumberInput, Label: "贴图:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
            ];
            return ary;
        };
        return TexturePropMeshPanel;
    })(prop.MetaDataView);
    prop.TexturePropMeshPanel = TexturePropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=TexturePropMeshPanel.js.map