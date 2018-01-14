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
                { Type: prop.ReflectionData.Vec3Color, Label: "环境颜色:", FunKey: "sunDirect", target: this, Step: 0.1 },
                { Type: prop.ReflectionData.Vec3Color, Label: "sun颜色:", FunKey: "sunColor", target: this, Step: 0.1 },
                { Type: prop.ReflectionData.Vec3Color, Label: "基本颜色:", FunKey: "ambientColor", target: this, Step: 0.1 },
            ];
            return ary;
        };
        Object.defineProperty(OpPropMeshPanel.prototype, "data", {
            get: function () {
                return this._data;
            },
            set: function (value) {
                this._data = value;
                this.resultNodeUI = value;
                this.refreshViewValue();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpPropMeshPanel.prototype, "directLight", {
            get: function () {
                console.log("this.resultNodeUI.directLight", this.resultNodeUI.directLight);
                return this.resultNodeUI.directLight ? 1 : 0;
            },
            set: function (value) {
                this.resultNodeUI.directLight = value == 1 ? true : false;
                this.changeData();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpPropMeshPanel.prototype, "sunDirect", {
            get: function () {
                return new Vector3D(Scene_data.light.sunDirect[0], Scene_data.light.sunDirect[1], Scene_data.light.sunDirect[2]);
            },
            set: function (value) {
                Scene_data.light.sunDirect[0] = value.x;
                Scene_data.light.sunDirect[1] = value.y;
                Scene_data.light.sunDirect[2] = value.z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpPropMeshPanel.prototype, "sunColor", {
            get: function () {
                return new Vector3D(Scene_data.light.sunColor[0], Scene_data.light.sunColor[1], Scene_data.light.sunColor[2]);
            },
            set: function (value) {
                Scene_data.light.sunColor[0] = value.x;
                Scene_data.light.sunColor[1] = value.y;
                Scene_data.light.sunColor[2] = value.z;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(OpPropMeshPanel.prototype, "ambientColor", {
            get: function () {
                return new Vector3D(Scene_data.light.ambientColor[0], Scene_data.light.ambientColor[1], Scene_data.light.ambientColor[2]);
            },
            set: function (value) {
                Scene_data.light.ambientColor[0] = value.x;
                Scene_data.light.ambientColor[1] = value.y;
                Scene_data.light.ambientColor[2] = value.z;
            },
            enumerable: true,
            configurable: true
        });
        OpPropMeshPanel.prototype.changeData = function () {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        };
        return OpPropMeshPanel;
    })(prop.MetaDataView);
    prop.OpPropMeshPanel = OpPropMeshPanel;
})(prop || (prop = {}));
//# sourceMappingURL=OpPropMeshPanel.js.map