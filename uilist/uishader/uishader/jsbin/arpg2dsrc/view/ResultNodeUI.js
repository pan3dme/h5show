var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var ResultNodeUI = (function (_super) {
        __extends(ResultNodeUI, _super);
        function ResultNodeUI() {
            _super.call(this);
            this._blenderMode = 0;
            this._killNum = 0;
            this._backCull = true;
            this._writeZbuffer = true;
            this._useDynamicIBL = false;
            this._normalScale = 0;
            this._lightProbe = false;
            this._directLight = false;
            this._noLight = false;
            this._fogMode = 0;
            this._scaleLightMap = false;
            this._hdr = false;
            this.name = "ResultNodeUI" + random(9999999);
            this.left = 900;
            this.top = 300;
            this.gap = 30;
            this.width = 162;
            this.height = 310;
            this.nodeTree = new materialui.NodeTreeOP;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.OP;
            this.initItem();
            var $a_resultNodeUItxt = this.addChild(this._midRender.getComponent("a_resultNodeUItxt"));
            $a_resultNodeUItxt.x = 30;
            this.resetBgSize();
        }
        ResultNodeUI.prototype.initItem = function () {
            this.diffuseItem = new materialui.ItemMaterialUI("漫反射(Diffuse)", materialui.MaterialItemType.VEC3);
            this.metallicItem = new materialui.ItemMaterialUI("金属(metallic)", materialui.MaterialItemType.FLOAT);
            this.specularItem = new materialui.ItemMaterialUI("高光(Specular)", materialui.MaterialItemType.FLOAT);
            this.specularPowerItem = new materialui.ItemMaterialUI("粗糙度(Roughness)", materialui.MaterialItemType.FLOAT);
            this.normalItem = new materialui.ItemMaterialUI("法线(Normal)", materialui.MaterialItemType.VEC3);
            this.reflectItem = new materialui.ItemMaterialUI("反射(Reflection)", materialui.MaterialItemType.VEC3);
            this.subsurfaceColorItem = new materialui.ItemMaterialUI("表面散射(subsurface)", materialui.MaterialItemType.VEC3);
            this.alphaItem = new materialui.ItemMaterialUI("透明度(alpha)", materialui.MaterialItemType.FLOAT);
            this.killItem = new materialui.ItemMaterialUI("不透明蒙版(alphaMask)", materialui.MaterialItemType.FLOAT);
            this.emissiveItem = new materialui.ItemMaterialUI("自发光(emissive)", materialui.MaterialItemType.VEC3);
            this.addItems(this.diffuseItem);
            this.addItems(this.metallicItem);
            this.addItems(this.specularItem);
            this.addItems(this.specularPowerItem);
            this.addItems(this.normalItem);
            this.addItems(this.reflectItem);
            this.addItems(this.subsurfaceColorItem);
            this.addItems(this.alphaItem);
            this.addItems(this.killItem);
            this.addItems(this.emissiveItem);
        };
        Object.defineProperty(ResultNodeUI.prototype, "blenderMode", {
            get: function () {
                return this._blenderMode;
            },
            set: function (value) {
                this._blenderMode = value;
                this.nodeTree.blendMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "normalScale", {
            get: function () {
                return this._normalScale;
            },
            set: function (value) {
                this._normalScale = value;
                this.nodeTree.normalScale = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "lightProbe", {
            get: function () {
                return this._lightProbe;
            },
            set: function (value) {
                this._lightProbe = value;
                this.nodeTree.lightProbe = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "directLight", {
            get: function () {
                return this._directLight;
            },
            set: function (value) {
                this._directLight = value;
                this.nodeTree.directLight = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "noLight", {
            get: function () {
                return this._noLight;
            },
            set: function (value) {
                this._noLight = value;
                this.nodeTree.noLight = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "fogMode", {
            get: function () {
                return this._fogMode;
            },
            set: function (value) {
                this._fogMode = value;
                this.nodeTree.fogMode = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "scaleLightMap", {
            get: function () {
                return this._scaleLightMap;
            },
            set: function (value) {
                this._scaleLightMap = value;
                this.nodeTree.scaleLightMap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "writeZbuffer", {
            get: function () {
                return this._writeZbuffer;
            },
            set: function (value) {
                this._writeZbuffer = value;
                this.nodeTree.writeZbuffer = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ResultNodeUI.prototype, "hdr", {
            get: function () {
                return this._hdr;
            },
            set: function (value) {
                this._hdr = value;
                this.nodeTree.hdr = value;
            },
            enumerable: true,
            configurable: true
        });
        ResultNodeUI.prototype.getData = function () {
            var obj = _super.prototype.getData.call(this);
            obj.blenderMode = this.blenderMode;
            obj.killNum = this._killNum;
            obj.backCull = this._backCull;
            obj.useDynamicIBL = this._useDynamicIBL;
            obj.normalScale = this.normalScale;
            obj.lightProbe = this.lightProbe;
            obj.directLight = this.directLight;
            obj.noLight = this.noLight;
            obj.fogMode = this.fogMode;
            obj.scaleLightMap = this.scaleLightMap;
            obj.writeZbuffer = this.writeZbuffer;
            obj.hdr = this.hdr;
            return obj;
        };
        return ResultNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.ResultNodeUI = ResultNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=ResultNodeUI.js.map