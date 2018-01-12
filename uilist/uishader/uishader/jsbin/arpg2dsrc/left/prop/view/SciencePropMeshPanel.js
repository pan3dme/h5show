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
var prop;
(function (prop) {
    var SciencePropMeshPanel = /** @class */ (function (_super) {
        __extends(SciencePropMeshPanel, _super);
        function SciencePropMeshPanel() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SciencePropMeshPanel.prototype.getView = function () {
            var ary = [
                { Type: prop.ReflectionData.Vec3Color, Label: "环境光:", FunKey: "constXValue", target: this, Step: 0.1 },
                { Type: prop.ReflectionData.Vec3Color, Label: "光法线:", FunKey: "constXValue", target: this, Step: 0.1 },
            ];
            return ary;
        };
        Object.defineProperty(SciencePropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this._colorAbc = new Vector3D(1, 0.5, 1);
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SciencePropMeshPanel.prototype, "constXValue", {
            get: function () {
                return this._colorAbc;
            },
            set: function (value) {
                this._colorAbc = value;
            },
            enumerable: true,
            configurable: true
        });
        return SciencePropMeshPanel;
    }(prop.MetaDataView));
    prop.SciencePropMeshPanel = SciencePropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=SciencePropMeshPanel.js.map