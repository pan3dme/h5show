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
var materialui;
(function (materialui) {
    var NodeLineLinkShader = /** @class */ (function (_super) {
        __extends(NodeLineLinkShader, _super);
        function NodeLineLinkShader() {
            return _super.call(this) || this;
        }
        NodeLineLinkShader.prototype.binLocation = function ($context) {
            $context.bindAttribLocation(this.program, 0, "v4Pos");
        };
        NodeLineLinkShader.prototype.getVertexShaderString = function () {
            var $str = "attribute vec4 v4Pos;" +
                "uniform vec4 posMove;" +
                "uniform mat4 viewMatrix3D;" +
                "void main(void)" +
                "{" +
                "vec4 vt0= vec4(v4Pos.x+posMove.x,v4Pos.y+posMove.y,1.0,1.0);\n" +
                "vt0=vt0*viewMatrix3D;\n" +
                "vt0.x=vt0.x-1.0;\n" +
                "vt0.y=vt0.y+1.0;\n" +
                "gl_Position = vt0;\n" +
                "}";
            return $str;
        };
        NodeLineLinkShader.prototype.getFragmentShaderString = function () {
            var $str = "precision mediump float;\n" +
                "void main(void)\n" +
                "{\n" +
                "gl_FragColor = vec4(0.6,0.0,0.0, 1.0);\n" +
                "}";
            return $str;
        };
        NodeLineLinkShader.NodeLineLinkShader = "NodeLineLinkShader";
        return NodeLineLinkShader;
    }(Shader3D));
    materialui.NodeLineLinkShader = NodeLineLinkShader;
    var MapLineUi = /** @class */ (function (_super) {
        __extends(MapLineUi, _super);
        function MapLineUi() {
            var _this = _super.call(this) || this;
            _this.x = UIData.designWidth / 2;
            _this.y = UIData.designHeight / 2;
            _this.width = 20;
            _this.height = 20;
            return _this;
        }
        MapLineUi.prototype.applyRenderSize = function () {
        };
        return MapLineUi;
    }(UICompenent));
    materialui.MapLineUi = MapLineUi;
    var NodeLineLinkComponent = /** @class */ (function (_super) {
        __extends(NodeLineLinkComponent, _super);
        function NodeLineLinkComponent() {
            var _this = _super.call(this) || this;
            ProgrmaManager.getInstance().registe(NodeLineLinkShader.NodeLineLinkShader, new NodeLineLinkShader);
            _this.shader = ProgrmaManager.getInstance().getProgram(NodeLineLinkShader.NodeLineLinkShader);
            _this.program = _this.shader.program;
            return _this;
        }
        NodeLineLinkComponent.prototype.makeLineUiItem = function ($arr) {
            if ($arr && $arr.length > 1) {
                this.mapLineUiList = new Array();
                var lastPos = $arr[0];
                var $gapnum = 1.0;
                for (var i = 0; i < $arr.length; i++) {
                    while (Vector2D.distance(lastPos, $arr[i]) > $gapnum) {
                        lastPos = this.nextPostForTow(lastPos, $arr[i], $gapnum / 2);
                        var $ui = new Vector2D();
                        $ui.x = lastPos.x;
                        $ui.y = lastPos.y;
                        this.mapLineUiList.push($ui);
                    }
                }
                this.makeLineVetlineObjData();
            }
            else {
                this.objData.treNum = 0;
                console.log("路线清除");
            }
        };
        NodeLineLinkComponent.prototype.nextPostForTow = function (a, b, $gapnum) {
            var c = new Vector2D(b.x - a.x, b.y - a.y);
            c.normalize();
            c.x = c.x * $gapnum;
            c.y = c.y * $gapnum;
            c.x += a.x;
            c.y += a.y;
            return c;
        };
        NodeLineLinkComponent.prototype.makeLineVetlineObjData = function () {
            if (!this.objData) {
                this.objData = new ObjData;
            }
            this.objData.vertices = new Array();
            this.objData.indexs = new Array();
            this.getUiDataForItem();
            if (this.objData.vertexBuffer) {
                Scene_data.context3D.uploadBuff3DByBuffer(this.objData.vertexBuffer, this.objData.vertices);
                Scene_data.context3D.uploadIndexBuff3DByBuffer(this.objData.indexBuffer, this.objData.indexs);
            }
            else {
                this.objData.vertexBuffer = Scene_data.context3D.uploadBuff3D(this.objData.vertices);
                this.objData.indexBuffer = Scene_data.context3D.uploadIndexBuff3D(this.objData.indexs);
            }
            this.objData.treNum = this.objData.indexs.length;
        };
        NodeLineLinkComponent.prototype.getUiDataForItem = function () {
            //   this.anglyNum++;
            var $v = new Array;
            var $linesize = 2;
            for (var i = 0; i < this.mapLineUiList.length; i++) {
                var $v2d = this.mapLineUiList[i];
                if (i == 0) {
                    this.objData.vertices.push($v2d.x, $v2d.y, 1, 1);
                    this.objData.vertices.push($v2d.x, $v2d.y, 1, 1);
                }
                else {
                    var lastV2d = this.mapLineUiList[i - 1];
                    var anglyNum = Math.atan2($v2d.y - lastV2d.y, $v2d.x - lastV2d.x);
                    var rotm = new Matrix3D();
                    rotm.appendRotation(anglyNum * 180 / Math.PI, Vector3D.Z_AXIS);
                    rotm.appendTranslation($v2d.x, $v2d.y, 0);
                    var ka = rotm.transformVector(new Vector3D(0, +$linesize, 0));
                    var kb = rotm.transformVector(new Vector3D(0, -$linesize, 0));
                    this.objData.vertices.push(ka.x, ka.y, 1, 1);
                    this.objData.vertices.push(kb.x, kb.y, 1, 1);
                    var $indx = i - 1;
                    this.objData.indexs.push(0 + $indx * 2, 1 + $indx * 2, 3 + $indx * 2);
                    this.objData.indexs.push(0 + $indx * 2, 3 + $indx * 2, 2 + $indx * 2);
                }
            }
        };
        NodeLineLinkComponent.prototype.update = function () {
            if (this.objData && this.objData.treNum > 0) {
                Scene_data.context3D.setProgram(this.program);
                Scene_data.context3D.setVa(0, 4, this.objData.vertexBuffer);
                var $m = new Matrix3D;
                $m.appendScale(2 / Scene_data.stageWidth * UIData.Scale, -2 / Scene_data.stageHeight * UIData.Scale, 1);
                Scene_data.context3D.setVc4fv(this.shader, "posMove", [Arpg2dGameStart.stagePos.x, Arpg2dGameStart.stagePos.y, 0, 0]);
                Scene_data.context3D.setVcMatrix4fv(this.shader, "viewMatrix3D", $m.m);
                Scene_data.context3D.drawCall(this.objData.indexBuffer, this.objData.treNum);
            }
        };
        return NodeLineLinkComponent;
    }(UIRenderComponent));
    materialui.NodeLineLinkComponent = NodeLineLinkComponent;
    var MaterialLineContainer = /** @class */ (function (_super) {
        __extends(MaterialLineContainer, _super);
        function MaterialLineContainer() {
            var _this = _super.call(this) || this;
            _this.layer = 100;
            _this.width = 200;
            _this.height = 200;
            _this._midRender = new NodeLineLinkComponent;
            _this.addRender(_this._midRender);
            // this._midRender.makeLineUiItem(null)
            var $arr = new Array();
            $arr.push(new Vector2D(0, 0));
            $arr.push(new Vector2D(100, 0));
            $arr.push(new Vector2D(100, 100));
            _this._midRender.makeLineUiItem($arr);
            _this._lineList = new Array;
            return _this;
        }
        MaterialLineContainer.prototype.startLine = function ($item) {
            this._currentLine = new materialui.MaterialNodeLineUI;
            this._currentLine.parent = this;
            this.addRender(this._currentLine.lineRender);
            this._currentLine.setFromNode($item);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onMouseUp, this);
        };
        MaterialLineContainer.prototype.removeLine = function ($line) {
            for (var i; i < this._lineList.length; i++) {
                if (this._lineList[i] == $line) {
                    this._lineList.splice(i, 1);
                    break;
                }
            }
            $line.remove();
        };
        MaterialLineContainer.prototype.globalToLocal = function ($v) {
            var p = new Vector2D($v.x - Arpg2dGameStart.stagePos.x, $v.y - Arpg2dGameStart.stagePos.y);
            return p;
        };
        MaterialLineContainer.prototype.getMouse = function ($v) {
            var p = new Vector2D(($v.x / UIData.Scale - Arpg2dGameStart.stagePos.x), $v.y / UIData.Scale - Arpg2dGameStart.stagePos.y);
            return p;
        };
        MaterialLineContainer.prototype.onMouseUp = function (event) {
            var $slectUi = UIManager.getInstance().getObjectsUnderPoint(new Vector2D(event.x, event.y));
            var evt = new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG);
            if ($slectUi && $slectUi.name == "a_point_frame") {
                evt.itemNode = $slectUi.data;
            }
            ModuleEventManager.dispatchEvent(evt);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onMouseUp, this);
        };
        MaterialLineContainer.prototype.addConnentLine = function ($startItem, $endItem) {
            this._currentLine = new materialui.MaterialNodeLineUI;
            this._currentLine.parent = this;
            this.addRender(this._currentLine.lineRender);
            this._currentLine.setFromNode($startItem);
            this._currentLine.setEndNode($endItem);
            this._lineList.push(this._currentLine);
        };
        MaterialLineContainer.prototype.stopLine = function ($item) {
            if ($item) {
                if (this._currentLine.needNodeType == $item.inOut && $item.parent != this._currentLine.currentHasNode.parent && ($item.typets == materialui.MaterialItemType.UNDEFINE || $item.typets == this._currentLine.currentHasNode.typets)) {
                    if ($item.typets == materialui.MaterialItemType.UNDEFINE) {
                        $item.changeType(this._currentLine.currentHasNode.typets);
                    }
                    this._currentLine.setEndNode($item);
                    this._lineList.push(this._currentLine);
                }
                else {
                    this._currentLine.removeStage();
                }
            }
            else {
                this._currentLine.removeStage();
            }
        };
        return MaterialLineContainer;
    }(UIPanel));
    materialui.MaterialLineContainer = MaterialLineContainer;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeLineLinkSprite.js.map