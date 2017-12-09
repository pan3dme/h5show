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
var DirectShadowDisplay3DShader = /** @class */ (function (_super) {
    __extends(DirectShadowDisplay3DShader, _super);
    function DirectShadowDisplay3DShader() {
        return _super.call(this) || this;
    }
    DirectShadowDisplay3DShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "v2CubeTexST");
        $context.bindAttribLocation(this.program, 2, "v3Normal");
    };
    DirectShadowDisplay3DShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec2 v2CubeTexST;" +
            "varying vec2 v0;" +
            "varying vec3 v_PositionFromLight;" +
            "varying vec3 v2;" +
            "varying float cosTheta;" +
            "varying float onsunFace;" +
            "varying vec3 ambientColorF;" +
            "attribute vec3 v3Normal;" +
            "uniform vec3 sunDirect;" +
            "uniform vec3 sunColor;" +
            "uniform vec3 ambientColor;" +
            "uniform mat4 vpMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat4 shadowViewMatx3D;" +
            "uniform mat3 rotationMatrix3D;" +
            "void main(void){;" +
            "ambientColorF =ambientColor;" +
            "v0 = vec2(v2CubeTexST.x, v2CubeTexST.y); " +
            "vec4 vt0= vec4(v3Position, 1.0);" +
            "vt0 = posMatrix3D * vt0;" +
            "vt0 = vpMatrix3D * vt0;" +
            "   vec4 vt1= vec4(v3Position, 1.0);" +
            "   vt1 = posMatrix3D * vt1;" +
            "   vt1 = shadowViewMatx3D * vt1;" +
            "   v_PositionFromLight = vec3(vt1.x, vt1.y,vt1.z);" +
            "vec3 n = rotationMatrix3D * v3Normal;" +
            "float suncos = dot(n.xyz,sunDirect.xyz);" +
            "onsunFace = suncos;" +
            "cosTheta =1.0-abs(suncos);" +
            "suncos = clamp(suncos,0.0,1.0);" +
            "v2 = sunColor * suncos ;" +
            "gl_Position = vt0;" +
            "}";
        return $str;
    };
    /*
          private toNum(vect: Vector3D): number
      {
          var $a: number = vect.x * 256;
          var $b: number = vect.y * 256;
          var $bnum:number=($a * 256 + $b) / 65536
          console.log("$bnum",$bnum)
          return ($a * 256 + $b) / 65536
      }
      */
    DirectShadowDisplay3DShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "uniform sampler2D fs1;\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v_PositionFromLight;\n" +
            "varying vec3 v2;" +
            "varying float cosTheta;" +
            "varying float onsunFace;" +
            "varying vec3 ambientColorF;" +
            "float toNum(vec4 vect){\n" +
            "float a= vect.x * 255.0;\n" +
            "float b= vect.y * 255.0;\n" +
            "return  (a * 255.0 + b) / (255.0*255.0);\n" +
            " }\n" +
            "float getuvvisible(vec2 uvpos,float uvbias){\n" +
            "vec4 uvft5 = texture2D(fs1, uvpos.xy); " + //深度图采样
            "float uvdephz  =toNum(uvft5); " +
            "float uvvisibility = (v_PositionFromLight.z > uvdephz + uvbias) ? 0.9 : 1.0;\n" + //深度判断
            "return  uvvisibility;\n" +
            " }\n" +
            "float getDistens(vec2 dppos){\n" +
            "float tempz=sqrt(dppos.x*dppos.x+dppos.y*dppos.y) ;\n" +
            "return clamp(tempz*1.0, 0.0, 1.0);\n" +
            " }\n" +
            "void main(void)\n" +
            "{\n" +
            "float  bias  = 0.001*cosTheta; " +
            "bias = clamp(bias, 0.001, 0.01); " +
            "float thxy  = 1.0/1024.0; " +
            "vec2 dphuvpos  = vec2(v_PositionFromLight.x, v_PositionFromLight.y); " +
            "float totalnum =getuvvisible(vec2(dphuvpos.x, dphuvpos.y),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x+thxy, dphuvpos.y),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x-thxy, dphuvpos.y),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x, dphuvpos.y+thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x, dphuvpos.y-thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x+thxy, dphuvpos.y+thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x+thxy, dphuvpos.y-thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x-thxy, dphuvpos.y+thxy),bias) ; " +
            "totalnum =totalnum*getuvvisible(vec2(dphuvpos.x-thxy, dphuvpos.y-thxy),bias) ; " +
            "float disnum =getDistens(vec2(dphuvpos.x-0.5, dphuvpos.y-0.5)*2.0); " +
            "float visibility =onsunFace<0.0?1.0:totalnum ; " +
            "if (disnum > 0.0) {\n" +
            "     float bbc=clamp((disnum-0.8),0.0,0.2)*5.0;\n" +
            "      bbc=(1.0-visibility)*(1.0-bbc);\n" +
            "     visibility=1.0-bbc;\n" +
            "}\n" +
            "vec4 ft0 = texture2D(fs0, v0); " + //正常纹理采样
            "vec4 ft1 = vec4(v2.xyz, 1.0); " + //法线值
            "gl_FragColor = vec4((ft1.xyz*visibility+ambientColorF.xyz)*ft0.xyz , 1.0); " +
            "if (disnum >= 1.0) {\n" +
            //    "gl_FragColor = vec4(1.0,0.0,0.0 , 1.0); " +
            "}\n" +
            "}";
        return $str;
    };
    DirectShadowDisplay3DShader.DirectShadowDisplay3DShader = "DirectShadowDisplay3DShader";
    return DirectShadowDisplay3DShader;
}(Shader3D));
var DirectShadowDisplay3DSprite = /** @class */ (function (_super) {
    __extends(DirectShadowDisplay3DSprite, _super);
    function DirectShadowDisplay3DSprite() {
        var _this = _super.call(this) || this;
        _this.nrmFlag = 0;
        _this.initData();
        _this.makeDefaulWith();
        return _this;
    }
    DirectShadowDisplay3DSprite.prototype.initData = function () {
        ProgrmaManager.getInstance().registe(DirectShadowDisplay3DShader.DirectShadowDisplay3DShader, new DirectShadowDisplay3DShader);
        this.modelShder = ProgrmaManager.getInstance().getProgram(DirectShadowDisplay3DShader.DirectShadowDisplay3DShader);
    };
    DirectShadowDisplay3DSprite.prototype.setObjUrl = function (value) {
        var _this = this;
        ObjDataManager.getInstance().getObjData(Scene_data.fileRoot + value, function ($obj) {
            _this.objData = $obj;
        });
    };
    DirectShadowDisplay3DSprite.prototype.update = function () {
        for (var i = 0; this.groupItem && i < this.groupItem.length; i++) {
            if (this.groupItem[i]) {
                this.drawTemp(this.groupItem[i]);
            }
        }
    };
    DirectShadowDisplay3DSprite.prototype.drawTemp = function ($dis) {
        if (!Scene_data.fbo || !ShadowModel.shadowViewMatx3D) {
            return;
        }
        var $objdata = $dis.objData;
        var $shader = this.modelShder;
        if ($objdata && $objdata.indexBuffer && $dis.baseTexture) {
            Scene_data.context3D.setProgram($shader.program);
            Scene_data.context3D.setVc3fv($shader, "sunDirect", Scene_data.light.sunDirect);
            Scene_data.context3D.setVc3fv($shader, "sunColor", Scene_data.light.sunColor);
            Scene_data.context3D.setVc3fv($shader, "ambientColor", Scene_data.light.ambientColor);
            Scene_data.context3D.setVcMatrix4fv($shader, "shadowViewMatx3D", ShadowModel.shadowViewMatx3D.m);
            Scene_data.context3D.setVcMatrix3fv($shader, "rotationMatrix3D", $dis._rotationData);
            Scene_data.context3D.setVcMatrix4fv($shader, "vpMatrix3D", Scene_data.vpMatrix.m);
            Scene_data.context3D.setVcMatrix4fv($shader, "posMatrix3D", this.posMatrix.m);
            Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $objdata.vertexBuffer);
            Scene_data.context3D.setVaOffset(0, 3, $objdata.stride, 0);
            Scene_data.context3D.setVaOffset(1, 2, $objdata.stride, $objdata.uvsOffsets);
            Scene_data.context3D.setVaOffset(2, 3, $objdata.stride, $objdata.normalsOffsets);
            if (DirectShadowDisplay3DSprite.showWhiteTexture) {
                Scene_data.context3D.setRenderTexture($shader, "fs0", this.defaulWhiteTexture.texture, 0);
            }
            else {
                Scene_data.context3D.setRenderTexture($shader, "fs0", $dis.baseTexture.texture, 0);
            }
            Scene_data.context3D.setRenderTexture($shader, "fs1", Scene_data.fbo.texture, 1);
            Scene_data.context3D.drawCall($objdata.indexBuffer, $objdata.treNum);
        }
    };
    DirectShadowDisplay3DSprite.prototype.makeDefaulWith = function () {
        var $ctx = UIManager.getInstance().getContext2D(128, 128, false);
        $ctx.fillStyle = "rgb(255,255,255)";
        $ctx.fillRect(0, 0, 128, 128);
        this.defaulWhiteTexture = TextureManager.getInstance().getCanvasTexture($ctx);
    };
    DirectShadowDisplay3DSprite.prototype.updateRotationMatrix = function () {
        this._rotationMatrix.identity();
        this._rotationMatrix.appendRotation(this._rotationX, Vector3D.X_AXIS);
        this._rotationMatrix.appendRotation(this._rotationY, Vector3D.Y_AXIS);
        this._rotationMatrix.appendRotation(this._rotationZ, Vector3D.Z_AXIS);
        if (this.offsetDis) {
            var $m = new Matrix3D;
            $m.appendRotation(this.offsetDis.rotationX, Vector3D.X_AXIS);
            $m.appendRotation(this.offsetDis.rotationY, Vector3D.Y_AXIS);
            $m.appendRotation(this.offsetDis.rotationZ, Vector3D.Z_AXIS);
            this._rotationMatrix.prepend($m);
        }
        if (this._rotationData) {
            this._rotationMatrix.getRotaion(this._rotationData);
        }
        for (var i = 0; this.groupItem && i < this.groupItem.length; i++) {
            var $dis = this.groupItem[i];
            if ($dis && $dis._rotationData) {
                if ($dis._rotationData) {
                    this._rotationMatrix.getRotaion($dis._rotationData);
                }
            }
        }
    };
    DirectShadowDisplay3DSprite.prototype.setModelById = function ($str) {
        var _this = this;
        this.groupItem = new Array();
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + getModelUrl($str), function (groupRes) {
            for (var i = 0; i < groupRes.dataAry.length; i++) {
                var item = groupRes.dataAry[i];
                if (item.types == BaseRes.PREFAB_TYPE) {
                    var $dis = new Display3DSprite();
                    $dis.setObjUrl(item.objUrl);
                    $dis._rotationData = new Float32Array(9);
                    _this.groupItem.push($dis);
                    if (item.materialInfoArr && item.materialInfoArr.length) {
                        $dis.setPicUrl(item.materialInfoArr[0].url);
                    }
                    else {
                        console.log("没有指定贴图");
                    }
                }
            }
            _this.updateRotationMatrix();
        });
    };
    DirectShadowDisplay3DSprite.showWhiteTexture = true;
    return DirectShadowDisplay3DSprite;
}(Display3DSprite));
//# sourceMappingURL=DirectShadowDisplay3DSprite.js.map