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
var CartoonCharShader = /** @class */ (function (_super) {
    __extends(CartoonCharShader, _super);
    function CartoonCharShader() {
        return _super.call(this) || this;
    }
    CartoonCharShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "pos");
        $context.bindAttribLocation(this.program, 1, "v2Uv");
        $context.bindAttribLocation(this.program, 2, "boneID");
        $context.bindAttribLocation(this.program, 3, "boneWeight");
        $context.bindAttribLocation(this.program, 4, "normal");
    };
    CartoonCharShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec4 pos;\n" +
            "attribute vec2 v2Uv;\n" +
            "attribute vec4 boneID;\n" +
            "attribute vec4 boneWeight;\n" +
            "attribute vec4 normal;\n" +
            "uniform vec4 boneQ[54];\n" +
            "uniform vec3 boneD[54];\n" +
            "uniform mat4 vpMatrix3D;\n" +
            "uniform mat4 posMatrix3D;\n" +
            "uniform mat4 camMatrix3D;\n" +
            "uniform mat4 rotationMatrix3D;\n" +
            "uniform vec3 sunDirect;\n" +
            "uniform vec3 sunColor;\n" +
            "uniform vec3 ambientColor;\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v1;\n" +
            "varying vec3 v2;\n" +
            "varying vec3 v3;\n" +
            "varying vec3 v4;\n" +
            "vec4 qdv(vec4 q,vec3 d, vec3 v ){\n" +
            "vec3 t = 2.0 * cross(q.xyz, v);\n" +
            "vec3 f = v + q.w * t + cross(q.xyz, t);\n" +
            "return  vec4(f.x+d.x,f.y+d.y,f.z+d.z,1.0);\n" +
            " }\n" +
            "vec4 getQDdata(vec3 vdata){\n" +
            "vec4 tempnum = qdv(boneQ[int(boneID.x)],boneD[int(boneID.x)],vdata) * boneWeight.x;\n" +
            "tempnum += qdv(boneQ[int(boneID.y)],boneD[int(boneID.y)],vdata) * boneWeight.y;\n" +
            "tempnum += qdv(boneQ[int(boneID.z)],boneD[int(boneID.z)],vdata)* boneWeight.z;\n" +
            "tempnum += qdv(boneQ[int(boneID.w)],boneD[int(boneID.w)],vdata) * boneWeight.w;\n" +
            "tempnum.x = tempnum.x*-1.0;\n" +
            "return  tempnum;\n" +
            " }\n" +
            "vec4 qdvNrm(vec4 q, vec3 v ){\n" +
            "vec3 t = 2.0 * cross(q.xyz, v);\n" +
            "vec3 f = v + q.w * t + cross(q.xyz, t);\n" +
            "return  vec4(f.x,f.y,f.z,1.0);\n" +
            " }\n" +
            "vec4 getQDdataNrm(vec3 vdata){\n" +
            "vec4 tempnum = qdvNrm(boneQ[int(boneID.x)],vdata) * boneWeight.x;\n" +
            "tempnum += qdvNrm(boneQ[int(boneID.y)],vdata) * boneWeight.y;\n" +
            "tempnum += qdvNrm(boneQ[int(boneID.z)],vdata)* boneWeight.z;\n" +
            "tempnum += qdvNrm(boneQ[int(boneID.w)],vdata) * boneWeight.w;\n" +
            "tempnum.x = tempnum.x*-1.0;\n" +
            "tempnum.xyz = normalize(tempnum.xyz);\n" +
            "return  tempnum;\n" +
            " }\n" +
            "void main(void){\n" +
            "v0 = v2Uv;\n" +
            "vec4 vt0 = getQDdata(vec3(pos.x,pos.y,pos.z));\n" +
            "vt0.xyz = vt0.xyz*1.0;\n" +
            "vt0 = posMatrix3D * vt0;\n" +
            "v1 = vec3(vt0.x,vt0.y,vt0.z);\n" +
            "vt0 = camMatrix3D * vt0;\n" +
            "vt0 = vpMatrix3D * vt0;\n" +
            "gl_Position = vt0;\n" +
            "vt0 = getQDdataNrm(vec3(normal.x,normal.y,normal.z));\n" +
            "vt0 = rotationMatrix3D * vt0;\n" +
            "vt0.xyz = normalize(vt0.xyz);\n" +
            "v4 = vec3(vt0.x,vt0.y,vt0.z);\n" +
            "float suncos = dot(vt0.xyz,sunDirect.xyz);\n" +
            "suncos = clamp(suncos,0.0,1.0);\n" +
            "v2 = sunColor * suncos + ambientColor;\n" +
            "v3 = normalize(sunDirect.xyz);\n" +
            "}";
        return $str;
    };
    CartoonCharShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "uniform sampler2D fs1;\n" +
            "uniform sampler2D fs2;\n" +
            "uniform samplerCube fs3;\n" +
            "uniform vec4 fc[4];\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v1;\n" +
            "varying vec3 v2;\n" +
            "varying vec3 v3;\n" +
            "varying vec3 v4;\n" +
            "float lerp(float diff ,float toon,float vnum ){" +
            "return  toon/10.0;\n" +
            " }\n" +
            "void main(void){\n" +
            "vec4 ft1 = texture2D(fs0,v0);\n" +
            "ft1.xyz *= ft1.w;\n" +
            "float diff=max(dot(v4,v3),0.0);\n" +
            "diff=(diff + 1.0) / 2.0;" + //做亮化处理
            "diff = smoothstep(0.0, 1.0, diff);" + //使颜色平滑的在[0,1]范围之内
            "float toon= floor(diff * 10.0);" + // _Steps;//把颜色做离散化处理，把diffuse颜色限制在_Steps种（_Steps阶颜色），简化颜色，这样的处理使色阶间能平滑的显示
            "diff = lerp(diff, toon, 1.0);" + //根据外部我们可控的卡通化程度值_ToonEffect，调节卡通
            "if(ft1.w<0.5){discard;}\n" +
            "gl_FragColor =vec4(diff,diff,diff,1.0);\n" +
            //   "gl_FragColor = vec4(ft1.x,ft1.y,ft1.z,1.0);\n" +
            "}";
        return $str;
    };
    CartoonCharShader.CartoonCharShader = "CartoonCharShader";
    return CartoonCharShader;
}(Shader3D));
var OutLineCharShader = /** @class */ (function (_super) {
    __extends(OutLineCharShader, _super);
    function OutLineCharShader() {
        return _super.call(this) || this;
    }
    OutLineCharShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "pos");
        $context.bindAttribLocation(this.program, 1, "v2Uv");
        $context.bindAttribLocation(this.program, 2, "boneID");
        $context.bindAttribLocation(this.program, 3, "boneWeight");
        $context.bindAttribLocation(this.program, 4, "normal");
    };
    OutLineCharShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec4 pos;\n" +
            "attribute vec2 v2Uv;\n" +
            "attribute vec4 boneID;\n" +
            "attribute vec4 boneWeight;\n" +
            "attribute vec4 normal;\n" +
            "uniform vec4 boneQ[54];\n" +
            "uniform vec3 boneD[54];\n" +
            "uniform mat4 vpMatrix3D;\n" +
            "uniform mat4 posMatrix3D;\n" +
            "uniform mat4 camMatrix3D;\n" +
            "uniform mat4 rotationMatrix3D;\n" +
            "uniform mat4 outlineMatrix3D;\n" +
            "uniform vec3 sunDirect;\n" +
            "uniform vec3 sunColor;\n" +
            "uniform vec3 ambientColor;\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v1;\n" +
            "varying vec3 v2;\n" +
            "varying vec3 v3;\n" +
            "varying vec3 v4;\n" +
            "vec4 qdv(vec4 q,vec3 d, vec3 v ){\n" +
            "vec3 t = 2.0 * cross(q.xyz, v);\n" +
            "vec3 f = v + q.w * t + cross(q.xyz, t);\n" +
            "return  vec4(f.x+d.x,f.y+d.y,f.z+d.z,1.0);\n" +
            " }\n" +
            "vec4 getQDdata(vec3 vdata){\n" +
            "vec4 tempnum = qdv(boneQ[int(boneID.x)],boneD[int(boneID.x)],vdata) * boneWeight.x;\n" +
            "tempnum += qdv(boneQ[int(boneID.y)],boneD[int(boneID.y)],vdata) * boneWeight.y;\n" +
            "tempnum += qdv(boneQ[int(boneID.z)],boneD[int(boneID.z)],vdata)* boneWeight.z;\n" +
            "tempnum += qdv(boneQ[int(boneID.w)],boneD[int(boneID.w)],vdata) * boneWeight.w;\n" +
            "tempnum.x = tempnum.x*-1.0;\n" +
            "return  tempnum;\n" +
            " }\n" +
            "vec4 qdvNrm(vec4 q, vec3 v ){\n" +
            "vec3 t = 2.0 * cross(q.xyz, v);\n" +
            "vec3 f = v + q.w * t + cross(q.xyz, t);\n" +
            "return  vec4(f.x,f.y,f.z,1.0);\n" +
            " }\n" +
            "vec4 getQDdataNrm(vec3 vdata){\n" +
            "vec4 tempnum = qdvNrm(boneQ[int(boneID.x)],vdata) * boneWeight.x;\n" +
            "tempnum += qdvNrm(boneQ[int(boneID.y)],vdata) * boneWeight.y;\n" +
            "tempnum += qdvNrm(boneQ[int(boneID.z)],vdata)* boneWeight.z;\n" +
            "tempnum += qdvNrm(boneQ[int(boneID.w)],vdata) * boneWeight.w;\n" +
            "tempnum.x = tempnum.x*-1.0;\n" +
            "tempnum.xyz = normalize(tempnum.xyz);\n" +
            "return  tempnum;\n" +
            " }\n" +
            "void main(void){\n" +
            "v0 = v2Uv;\n" +
            "vec4 vt0;\n" +
            "vt0 = getQDdataNrm(vec3(normal.x,normal.y,normal.z));\n" +
            "vec4 tempnorm = vt0*outlineMatrix3D;\n" +
            "v4 = normalize(vec3(tempnorm.x,tempnorm.y,tempnorm.z));\n" +
            "vt0 = rotationMatrix3D * vt0;\n" +
            "vt0.xyz = normalize(vt0.xyz);\n" +
            "float suncos = dot(vt0.xyz,sunDirect.xyz);\n" +
            "suncos = clamp(suncos,0.0,1.0);\n" +
            "v2 = sunColor * suncos + ambientColor;\n" +
            "v3 = normalize(sunDirect.xyz);\n" +
            "vt0 = getQDdata(vec3(pos.x,pos.y,pos.z));\n" +
            "vt0.xyz = vt0.xyz*1.0;\n" +
            "vt0 = posMatrix3D * vt0;\n" +
            "v1 = vec3(vt0.x,vt0.y,vt0.z);\n" +
            "vt0 = camMatrix3D * vt0;\n" +
            "vt0 = vpMatrix3D * vt0;\n" +
            "vec3 dir = normalize(vt0.xyz);" +
            "vec3 dir2 = normalize(v4.xyz);" +
            "float D=dot(dir,dir2);" +
            "dir=dir*sign(D);" +
            "float _Factor=0.5;" + //0.5;
            "dir=dir*_Factor+dir2*(1.0-_Factor);" +
            "float _Outline=1.0;" + //0.5;
            "vt0.xyz+=dir*_Outline;" +
            "vt0.z+=1.1;" +
            "gl_Position = vt0;\n" +
            "}";
        return $str;
    };
    OutLineCharShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "uniform sampler2D fs0;\n" +
            "uniform sampler2D fs1;\n" +
            "uniform sampler2D fs2;\n" +
            "uniform samplerCube fs3;\n" +
            "uniform vec4 fc[4];\n" +
            "varying vec2 v0;\n" +
            "varying vec3 v1;\n" +
            "varying vec3 v2;\n" +
            "varying vec3 v3;\n" +
            "varying vec3 v4;\n" +
            "void main(void){\n" +
            "vec4 ft1 = texture2D(fs0,v0);\n" +
            "if(ft1.w<0.5){discard;}\n" +
            "gl_FragColor =vec4(0.1,0.1,0.1,1.0);\n" +
            //   "gl_FragColor = vec4(ft1.x,ft1.y,ft1.z,1.0);\n" +
            "}";
        return $str;
    };
    OutLineCharShader.OutLineCharShader = "OutLineCharShader";
    return OutLineCharShader;
}(Shader3D));
var CartoonChar = /** @class */ (function (_super) {
    __extends(CartoonChar, _super);
    function CartoonChar() {
        var _this = _super.call(this) || this;
        _this.skipRotation = 0;
        ProgrmaManager.getInstance().registe(OutLineCharShader.OutLineCharShader, new OutLineCharShader);
        ProgrmaManager.getInstance().registe(CartoonCharShader.CartoonCharShader, new CartoonCharShader);
        return _this;
    }
    CartoonChar.prototype.updateMaterialMesh = function ($mesh) {
        $mesh.material.program = this.shader.program;
        $mesh.material.shader = this.shader;
        _super.prototype.updateMaterialMesh.call(this, $mesh);
    };
    CartoonChar.prototype.update = function () {
        this.updateOutLine();
        //  this.updateCortoon()
    };
    CartoonChar.prototype.setVcMatrix = function ($mesh) {
        Scene_data.context3D.setVcMatrix4fv($mesh.material.shader, "vpMatrix3D", Scene_data.viewMatrx3D.m);
        Scene_data.context3D.setVcMatrix4fv($mesh.material.shader, "camMatrix3D", Scene_data.cam3D.cameraMatrix.m);
        // Scene_data.context3D.setVpMatrix($mesh.material.shader, Scene_data.vpMatrix.m);
        Scene_data.context3D.setVcMatrix4fv($mesh.material.shader, "posMatrix3D", this.posMatrix.m);
        var $m = new Matrix3D();
        $m.appendRotation(-Scene_data.focus3D.rotationY, Vector3D.Y_AXIS);
        $m.appendRotation(-Scene_data.focus3D.rotationX, Vector3D.X_AXIS);
        Scene_data.context3D.setVcMatrix4fv($mesh.material.shader, "outlineMatrix3D", $m.m);
    };
    CartoonChar.prototype.updateOutLine = function () {
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.cullFaceBack(true);
        Scene_data.context3D.renderContext.frontFace(Scene_data.context3D.renderContext.CCW);
        this.shader = ProgrmaManager.getInstance().getProgram(OutLineCharShader.OutLineCharShader);
        _super.prototype.update.call(this);
    };
    CartoonChar.prototype.updateCortoon = function () {
        Scene_data.context3D.setWriteDepth(true);
        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.cullFaceBack(false);
        Scene_data.context3D.renderContext.frontFace(Scene_data.context3D.renderContext.CW);
        this.shader = ProgrmaManager.getInstance().getProgram(CartoonCharShader.CartoonCharShader);
        _super.prototype.update.call(this);
    };
    return CartoonChar;
}(SceneChar));
//# sourceMappingURL=CartoonChar.js.map