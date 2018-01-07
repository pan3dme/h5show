var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var prop;
(function (prop) {
    var Vec3PropMeshPanel = (function (_super) {
        __extends(Vec3PropMeshPanel, _super);
        function Vec3PropMeshPanel() {
            _super.apply(this, arguments);
        }
        Vec3PropMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.NumberInput, Label: "x:", FunKey: "constXValue", target: this, Category: "属性" },
                { Type: prop.ReflectionData.NumberInput, Label: "y:", FunKey: "constYValue", target: this, Category: "属性" },
                { Type: prop.ReflectionData.NumberInput, Label: "z:", FunKey: "constZValue", target: this, Category: "属性" },
            ];
            return ary;
        };
        Object.defineProperty(Vec3PropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.constVec3NodeUI = this._data;
                this._ve3d = this.constVec3NodeUI.constValue;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3PropMeshPanel.prototype, "constXValue", {
            get: function () {
                return this._ve3d.x;
            },
            set: function (value) {
                this._ve3d.x = value;
                this.constVec3NodeUI.constValue = this._ve3d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3PropMeshPanel.prototype, "constYValue", {
            get: function () {
                return this._ve3d.y;
            },
            set: function (value) {
                this._ve3d.y = value;
                this.constVec3NodeUI.constValue = this._ve3d;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec3PropMeshPanel.prototype, "constZValue", {
            get: function () {
                return this._ve3d.z;
            },
            set: function (value) {
                this._ve3d.z = value;
                this.constVec3NodeUI.constValue = this._ve3d;
            },
            enumerable: true,
            configurable: true
        });
        return Vec3PropMeshPanel;
    })(prop.MetaDataView);
    prop.Vec3PropMeshPanel = Vec3PropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=Vec3PropMeshPanel.js.map