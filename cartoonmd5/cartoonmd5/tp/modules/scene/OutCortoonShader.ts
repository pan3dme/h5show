
class OutCortoonShader extends Shader3D {
    static OutCortoonShader: string = "OutCortoonShader";
    constructor() {
        super();
    }
    binLocation($context: WebGLRenderingContext): void {
        $context.bindAttribLocation(this.program, 0, "v3Position");
        $context.bindAttribLocation(this.program, 1, "nrm3Position");
    }
    getVertexShaderString(): string {
        var $str: string =
            "attribute vec3 v3Position;" +
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
            "}"
        return $str


    }
    getFragmentShaderString(): string {
        var $str: string =
            "precision mediump float;\n" +
            "varying vec3 v_nrm3Position;\n" +
            "varying vec3 v_lightNrm;" +

            "float lerp(float diff ,float toon,float vnum ){" +
            "return  toon/10.0;\n" +
            " }\n" +

            "void main(void)\n" +
            "{\n" +

            "float diff=max(dot(v_nrm3Position,v_lightNrm),0.0);\n" +

            "diff=(diff + 1.0) / 2.0;" +         //做亮化处理
            "diff = smoothstep(0.0, 1.0, diff);" +      //使颜色平滑的在[0,1]范围之内
            "float toon= floor(diff * 10.0);" +    // _Steps;//把颜色做离散化处理，把diffuse颜色限制在_Steps种（_Steps阶颜色），简化颜色，这样的处理使色阶间能平滑的显示
            "diff = lerp(diff, toon, 1.0);" +    //根据外部我们可控的卡通化程度值_ToonEffect，调节卡通

            "gl_FragColor =vec4(diff,diff,diff,1.0);\n" +
            // "gl_FragColor =vec4(1.0,0.0,0.0,1.0);\n" +
            "}"
        return $str

    }


}
