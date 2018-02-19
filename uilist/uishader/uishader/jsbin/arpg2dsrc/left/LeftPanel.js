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
var left;
(function (left) {
    var modelShowRender = /** @class */ (function (_super) {
        __extends(modelShowRender, _super);
        function modelShowRender() {
            return _super.call(this) || this;
        }
        modelShowRender.prototype.makeRenderDataVc = function ($vcId) {
            _super.prototype.makeRenderDataVc.call(this, $vcId);
            for (var i = 0; i < this.renderData2.length / 4; i++) {
                this.renderData2[i * 4 + 0] = 1;
                this.renderData2[i * 4 + 1] = -1;
                this.renderData2[i * 4 + 2] = 0;
                this.renderData2[i * 4 + 3] = 0;
            }
        };
        return modelShowRender;
    }(UIRenderOnlyPicComponent));
    left.modelShowRender = modelShowRender;
    var LeftPanel = /** @class */ (function (_super) {
        __extends(LeftPanel, _super);
        function LeftPanel() {
            var _this = _super.call(this) || this;
            _this.left = 0;
            _this.top = 0;
            _this.width = 600;
            _this._bottomRender = new UIRenderComponent;
            _this.addRender(_this._bottomRender);
            _this._midRender = new UIRenderComponent;
            _this.addRender(_this._midRender);
            _this._topRender = new UIRenderComponent;
            _this.addRender(_this._topRender);
            _this.modelPic = new modelShowRender();
            _this.addRender(_this.modelPic);
            _this._topRender.uiAtlas = new UIAtlas();
            _this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/left/left.xml", "pan/marmoset/uilist/left/left.png", function () { _this.loadConfigCom(); });
            return _this;
        }
        LeftPanel.prototype.initView = function () {
            var $ui = this.addChild(this.modelPic.getComponent("a_model_show"));
            this.modelPic.setImgUrl("pan/marmoset/uilist/1024.jpg");
            $ui.top = 10;
            $ui.left = 10;
            left.ModelShowModel.getInstance()._bigPic = this.modelPic;
            $ui.name = "modelPic";
            $ui.addEventListener(InteractiveEvent.Down, this.addStageMoveEvets, this);
            this.showModelPic = $ui;
        };
        LeftPanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            this.height = Scene_data.stageHeight;
            if (this.a_panel_bg) {
                this.a_panel_bg.width = this.width;
                this.a_panel_bg.height = this.height;
                this.a_left_line.x = this.width - 10;
                this.a_left_line.y = 0;
                this.a_left_line.height = this.height;
                this.showModelPic.width = this.width - 20;
                this.showModelPic.height = this.width - 20;
                this.a_compile_but.y = this.showModelPic.height + 20;
                this.a_input_dae.y = this.a_compile_but.y;
            }
        };
        LeftPanel.prototype.a_left_lineDown = function ($e) {
            this.a_left_line.data = new Vector2D($e.x, $e.y);
            this.lastWidth = this.width;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        };
        LeftPanel.prototype.a_left_lineUp = function ($e) {
            this.a_left_line.data = null;
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.a_left_lineUp, this);
        };
        LeftPanel.prototype.onMoveLine = function ($e) {
            var $select = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($e.x, $e.y));
            if ($select == this.a_left_line) {
                Scene_data.canvas3D.style.cursor = "e-resize";
            }
            else {
                Scene_data.canvas3D.style.cursor = "auto";
            }
            if (this.a_left_line.data) {
                var $lastV2d = this.a_left_line.data;
                var Tx = ($e.x - $lastV2d.x);
                var $lastW = this.width;
                this.width = this.lastWidth + Tx;
                this.resize();
                prop.PropModel.getInstance().moveTop(this.width + 60);
                var $materialEvent = new materialui.MaterialEvent(materialui.MaterialEvent.SCENE_UI_TRUE_MOVE);
                $materialEvent.v2d = new Vector2D((this.width - $lastW) / materialui.MtlUiData.Scale, 0);
                ModuleEventManager.dispatchEvent($materialEvent);
            }
        };
        LeftPanel.prototype.addStageMoveEvets = function ($e) {
            this.lastCameRotation = new Vector2D(Scene_data.focus3D.rotationX, Scene_data.focus3D.rotationY);
            this.mouseXY = new Vector2D($e.x, $e.y);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        LeftPanel.prototype.onMove = function ($e) {
            var $n = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y);
            Scene_data.focus3D.rotationX = this.lastCameRotation.x - $n.y;
            Scene_data.focus3D.rotationY = this.lastCameRotation.y - $n.x;
        };
        LeftPanel.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        LeftPanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas;
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.modelPic.uiAtlas = this._topRender.uiAtlas;
            this.a_input_dae = this.addEvntBut("a_input_dae", this._topRender);
            this.a_compile_but = this.addEvntBut("a_compile_but", this._topRender);
            this.a_panel_bg = this.addChild(this._bottomRender.getComponent("a_panel_bg"));
            this.a_panel_bg.left = 0;
            this.a_panel_bg.top = 0;
            this.a_left_line = this.addChild(this._topRender.getComponent("a_left_line"));
            this.a_left_line.addEventListener(InteractiveEvent.Down, this.a_left_lineDown, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMoveLine, this);
            this.initView();
            this.resize();
        };
        LeftPanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.a_compile_but:
                    ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
                    break;
                case this.a_input_dae:
                    console.log("inputdae");
                    this.selectInputDae(evt);
                    break;
                default:
                    break;
            }
        };
        LeftPanel.prototype.selectInputDae = function (evt) {
            var _this = this;
            this._inputHtmlSprite = document.createElement('input');
            this._inputHtmlSprite.setAttribute('id', '_ef');
            this._inputHtmlSprite.setAttribute('type', 'file');
            this._inputHtmlSprite.setAttribute("style", 'visibility:hidden');
            this._inputHtmlSprite.click();
            this._inputHtmlSprite.value;
            this._inputHtmlSprite.addEventListener("change", function (cevt) { _this.changeFile(cevt); });
        };
        LeftPanel.prototype.changeFile = function (evt) {
            var _this = this;
            for (var i = 0; i < this._inputHtmlSprite.files.length && i < 1; i++) {
                var simpleFile = this._inputHtmlSprite.files[i];
                if (!/image\/\w+/.test(simpleFile.type)) {
                    var $reader = new FileReader();
                    $reader.readAsArrayBuffer(simpleFile);
                    $reader.onload = function ($temp) { _this.readOnLod($temp); };
                }
                else {
                    alert("请确保文件类型为图像类型");
                }
            }
            this._inputHtmlSprite = null;
        };
        LeftPanel.prototype.readOnLod = function ($temp) {
            var $reader = ($temp.target);
            var newByte = new ByteArray($reader.result);
            var $objdata = new ObjData();
            var $objurl = newByte.readUTF();
            console.log($objurl);
            $objdata.vertices = this.readVecFloat(newByte);
            $objdata.normals = this.readVecFloat(newByte);
            $objdata.uvs = this.readVecFloat(newByte);
            $objdata.lightuvs = this.readVecFloat(newByte);
            $objdata.indexs = this.readVecInt(newByte);
            $objdata.treNum = $objdata.indexs.length;
            TBNUtils.processTBN($objdata);
            $objdata.vertexBuffer = Scene_data.context3D.uploadBuff3D($objdata.vertices);
            $objdata.uvBuffer = Scene_data.context3D.uploadBuff3D($objdata.uvs);
            $objdata.lightUvBuffer = Scene_data.context3D.uploadBuff3D($objdata.lightuvs);
            $objdata.tangentBuffer = Scene_data.context3D.uploadBuff3D($objdata.tangents);
            $objdata.bitangentBuffer = Scene_data.context3D.uploadBuff3D($objdata.bitangents);
            $objdata.normalsBuffer = Scene_data.context3D.uploadBuff3D($objdata.normals);
            $objdata.indexBuffer = Scene_data.context3D.uploadIndexBuff3D($objdata.indexs);
            console.log($objdata);
            left.ModelShowModel.getInstance().lightSpriteList.inputObjdata = $objdata;
            left.ModelShowModel.getInstance().lightSpriteList.objData = $objdata;
        };
        LeftPanel.prototype.readVecFloat = function ($byte) {
            var $arr = new Array();
            var $len = $byte.readInt();
            for (var i = 0; i < $len; i++) {
                $arr.push($byte.readFloat());
            }
            return $arr;
        };
        LeftPanel.prototype.readVecInt = function ($byte) {
            var $arr = new Array();
            var $len = $byte.readInt();
            for (var i = 0; i < $len; i++) {
                $arr.push($byte.readInt());
            }
            return $arr;
        };
        return LeftPanel;
    }(UIPanel));
    left.LeftPanel = LeftPanel;
})(left || (left = {}));
//# sourceMappingURL=LeftPanel.js.map