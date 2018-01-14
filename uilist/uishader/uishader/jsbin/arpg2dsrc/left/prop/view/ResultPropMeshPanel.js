var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var prop;
(function (prop) {
    var OpPropMeshPanel = (function (_super) {
        __extends(OpPropMeshPanel, _super);
        function OpPropMeshPanel() {
            _super.apply(this, arguments);
        }
        OpPropMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.ComboBox, Label: "直接光照:", FunKey: "directLight", target: this, Data: [{ name: "false", type: 0 }, { name: "true", type: 1 }] },
            ];
            return ary;
        };
        Object.defineProperty(OpPropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpPropMeshPanel.prototype, "directLight", {
            get: function () {
                return 1;
            },
            set: function (value) {
            },
            enumerable: true,
            configurable: true
        });
        OpPropMeshPanel.prototype.changeData = function () {
        };
        return OpPropMeshPanel;
    })(prop.MetaDataView);
    prop.OpPropMeshPanel = OpPropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=ResultPropMeshPanel.js.map