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
var OutCortoonShader = /** @class */ (function (_super) {
    __extends(OutCortoonShader, _super);
    function OutCortoonShader() {
        return _super.call(this) || this;
    }
    OutCortoonShader.prototype.binLocation = function ($context) {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "nrm3Position");
    };
    OutCortoonShader.prototype.getVertexShaderString = function () {
        var $str = "attribute vec3 v3Position;" +
            "attribute vec3 nrm3Position;" +
            "uniform mat4 viewMatrix3D;" +
            "uniform mat4 camMatrix3D;" +
            "uniform mat4 posMatrix3D;" +
            "uniform mat3 rotationMatrix3D;" +
            "uniform vec3 lightNrm;\n" +
            "varying vec3 v_nrm3Position;" +
            "varying vec3 v_lightNrm;" +
            "void main(void)" +
            "{" +
            "   v_nrm3Position = normalize( rotationMatrix3D * nrm3Position);" +
            "   v_lightNrm = normalize(lightNrm);" +
            "   vec4 vt0= vec4(v3Position, 1.0);" +
            "   vt0 = posMatrix3D * vt0;" +
            "   vt0 = camMatrix3D * vt0;" +
            "   vt0 = viewMatrix3D * vt0;" +
            "   gl_Position = vt0;" +
            "}";
        return $str;
    };
    OutCortoonShader.prototype.getFragmentShaderString = function () {
        var $str = "precision mediump float;\n" +
            "varying vec3 v_nrm3Position;\n" +
            "varying vec3 v_lightNrm;" +
            "float lerp(float diff ,float toon,float vnum ){" +
            "return  toon/10.0;\n" +
            " }\n" +
            "void main(void)\n" +
            "{\n" +
            "float diff=max(dot(v_nrm3Position,v_lightNrm),0.0);\n" +
            "diff=(diff + 1.0) / 2.0;" + //做亮化处理
            "diff = smoothstep(0.0, 1.0, diff);" + //使颜色平滑的在[0,1]范围之内
            "float toon= floor(diff * 10.0);" + // _Steps;//把颜色做离散化处理，把diffuse颜色限制在_Steps种（_Steps阶颜色），简化颜色，这样的处理使色阶间能平滑的显示
            "diff = lerp(diff, toon, 1.0);" + //根据外部我们可控的卡通化程度值_ToonEffect，调节卡通
            "gl_FragColor =vec4(diff,diff,diff,1.0);\n" +
            // "gl_FragColor =vec4(1.0,0.0,0.0,1.0);\n" +
            "}";
        return $str;
    };
    OutCortoonShader.OutCortoonShader = "OutCortoonShader";
    return OutCortoonShader;
}(Shader3D));
//# sourceMappingURL=OutCortoonShader.js.map