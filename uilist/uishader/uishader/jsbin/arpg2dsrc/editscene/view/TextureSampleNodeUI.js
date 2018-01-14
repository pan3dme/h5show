var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var TextureSampleNodeUI = (function (_super) {
        __extends(TextureSampleNodeUI, _super);
        function TextureSampleNodeUI() {
            _super.call(this);
            this.name = "TextureSampleNodeUI" + random(9999999);
            this.left = 400;
            this.top = 100;
            this._wrap = 0;
            this._mipmap = 0;
            this._filter = 0;
            this._permul = false;
            this.nodeTree = new materialui.NodeTreeTex;
            this.nodeTree.ui = this;
            this.nodeTree.type = materialui.NodeTree.TEX;
            this.width = 162;
            this.height = 140;
            this.initItem();
            this.resetBgSize();
            this.drawTitleToFrame("纹理采样");
            this.a_texture_pic_frame = this.getTexturePicUi();
            this.a_texture_pic_frame.x = 20;
            this.a_texture_pic_frame.y = 55;
        }
        TextureSampleNodeUI.prototype.drawTextureUrlToFrame = function ($ui, $img) {
            var $toRect = $ui.getSkinCtxRect();
            var $ctx = UIManager.getInstance().getContext2D($toRect.width, $toRect.height, false);
            $ctx.drawImage($img, 0, 0, $toRect.width, $toRect.height);
            $ui.drawToCtx(this._topRender.uiAtlas, $ctx);
        };
        TextureSampleNodeUI.prototype.getTexturePicUi = function () {
            var $ui = this.addEvntBut("a_texture_pic_frame", this._topRender);
            $ui.goToAndStop(TextureSampleNodeUI.texture_pic_frame_ID++);
            return $ui;
        };
        TextureSampleNodeUI.prototype.initItem = function () {
            this.uvItem = new materialui.ItemMaterialUI("UV", materialui.MaterialItemType.VEC2);
            this.rgbItem = new materialui.ItemMaterialUI("rgb", materialui.MaterialItemType.VEC3, false);
            this.rItem = new materialui.ItemMaterialUI("r", materialui.MaterialItemType.FLOAT, false);
            this.gItem = new materialui.ItemMaterialUI("g", materialui.MaterialItemType.FLOAT, false);
            this.bItem = new materialui.ItemMaterialUI("b", materialui.MaterialItemType.FLOAT, false);
            this.aItem = new materialui.ItemMaterialUI("a", materialui.MaterialItemType.FLOAT, false);
            this.rgbaItem = new materialui.ItemMaterialUI("rgba", materialui.MaterialItemType.VEC4, false);
            this.addItems(this.uvItem);
            this.addItems(this.rgbItem);
            this.addItems(this.rItem);
            this.addItems(this.gItem);
            this.addItems(this.bItem);
            this.addItems(this.aItem);
            this.addItems(this.rgbaItem);
        };
        TextureSampleNodeUI.prototype.creatBase = function ($url) {
            var vo = this.nodeTree;
            vo.url = $url;
            vo.wrap = this._wrap;
            vo.mipmap = this._mipmap;
            vo.filter = this._filter;
            vo.permul = this._permul;
            this.drawPicBmp();
        };
        TextureSampleNodeUI.prototype.drawPicBmp = function () {
            var _this = this;
            var $url = this.nodeTree.url;
            var $img = TextureManager.getInstance().getImgResByurl(Scene_data.fileRoot + $url);
            if ($img) {
                this.drawTextureUrlToFrame(this.a_texture_pic_frame, $img);
            }
            else {
                LoadManager.getInstance().load(Scene_data.fileRoot + $url, LoadManager.IMG_TYPE, function ($img) {
                    _this.drawTextureUrlToFrame(_this.a_texture_pic_frame, $img);
                });
            }
        };
        TextureSampleNodeUI.prototype.setData = function (obj) {
            _super.prototype.setData.call(this, obj);
            obj.url = String(obj.url).replace(Scene_data.fileRoot, ""); //兼容原来相对路径
            this.nodeTree.url = obj.url;
            this.isMain = obj.isMain;
            this.wrap = obj.wrap;
            this.mipmap = obj.mipmap;
            this.filter = obj.filter;
            this.permul = obj.permul;
            this.drawPicBmp();
            this.showDynamic();
        };
        Object.defineProperty(TextureSampleNodeUI.prototype, "wrap", {
            get: function () {
                return this._wrap;
            },
            set: function (value) {
                this._wrap = value;
                this.nodeTree.wrap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureSampleNodeUI.prototype, "mipmap", {
            get: function () {
                return this._mipmap;
            },
            set: function (value) {
                this._mipmap = value;
                this.nodeTree.mipmap = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureSampleNodeUI.prototype, "filter", {
            get: function () {
                return this._filter;
            },
            set: function (value) {
                this._filter = value;
                this.nodeTree.filter = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureSampleNodeUI.prototype, "permul", {
            get: function () {
                return this._permul;
            },
            set: function (value) {
                this._permul = value;
                this.nodeTree.permul = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(TextureSampleNodeUI.prototype, "isMain", {
            set: function (value) {
                this.nodeTree.isMain = value;
                if (value) {
                }
                else {
                }
            },
            enumerable: true,
            configurable: true
        });
        TextureSampleNodeUI.prototype.showDynamic = function () {
            if (this.nodeTree.isDynamic) {
                this.drawTitleToFrame("纹理采样<" + this.nodeTree.paramName + ">");
            }
            else {
                this.drawTitleToFrame("纹理采样");
            }
        };
        TextureSampleNodeUI.texture_pic_frame_ID = 0;
        return TextureSampleNodeUI;
    })(materialui.BaseMaterialNodeUI);
    materialui.TextureSampleNodeUI = TextureSampleNodeUI;
})(materialui || (materialui = {}));
//# sourceMappingURL=TextureSampleNodeUI.js.map