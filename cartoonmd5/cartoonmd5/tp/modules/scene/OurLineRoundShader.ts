
class OurLineRoundShader extends Shader3D {
    static OurLineRoundShader: string = "OurLineRoundShader";
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
            "uniform vec4 datainfo;" +

            "varying vec3 v_nrm3Position;" +


            "void main(void)" +
            "{" +

            "   v_nrm3Position = rotationMatrix3D*nrm3Position;" +

            "   vec4 vt0= vec4(v3Position, 1.0);" +

            "vec3 dir = normalize(vt0.xyz);" +
            "vec3 dir2 = normalize(nrm3Position.xyz);" +
            "float D=dot(dir,dir2);" +
            "dir=dir*sign(D);" +
            "float _Factor=datainfo.x;" +  //0.5;
            "dir=dir*_Factor+dir2*(1.0-_Factor);" +
            "float _Outline=datainfo.y;" + //0.5;
            "vt0.xyz+=dir*_Outline;" +

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


            "void main(void)\n" +
            "{\n" +
            "gl_FragColor =vec4(0.0,0.0,0.0,1.0);" +
            // "gl_FragColor =vec4(v_nrm3Position,1.0);" +
            "}"
        return $str

    }

}
