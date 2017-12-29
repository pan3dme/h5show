class ProgrmaManager extends ResGC {
    //private _dic: Object
    private static _instance: ProgrmaManager;
    constructor() {
        //this._dic = new Object();
        super();
    }
    public static getInstance(): ProgrmaManager {
        if (!this._instance) {
            this._instance = new ProgrmaManager();
        }
        return this._instance;
    }
    public getProgram($str: string): Shader3D {
        if (this._dic[$str]) {
            return this._dic[$str]; 
        } else {
            alert("please registe Program=>" + $str);
            return null
        }
    }
    public registe($str, $shader3D: Shader3D): void {
        if (!this._dic[$str]) {
            $shader3D.encode();
            $shader3D.useNum = 1;
            $shader3D.name = $str;
            this._dic[$str] = $shader3D;
        }

    }
    
    public getMaterialProgram(key: String, shaderCls: any, $material: Material, paramAry: any = null, parmaByFragmet: boolean = false): Shader3D {
        var keyStr: string = key + "_" + $material.url;
        //"ft1.xyz = mix(vec3(0.04,0.04,0.04),ft2.xyz,fc[1].x);\n" +
   
        if (keyStr.search("ormals") != -1 &&true) { //FIXME
            console.log(keyStr)
            this.outShader($material.shaderStr)

            $material.shaderStr =
            "precision mediump float;\n"+
            "uniform sampler2D fs0;\n"+
            "uniform sampler2D fs1;\n"+
            "uniform sampler2D fs2;\n"+
            "uniform samplerCube fs3;\n"+
            "uniform vec4 fc[2];\n"+
            "varying vec2 v0;\n"+
            "varying vec3 v1;\n"+
            "varying mat3 v4;\n"+
            "void main(void){\n"+
            "\n"+
                "vec4 ft0 = texture2D(fs0,v0);\n"+
                "vec4 ft1 = texture2D(fs1,v0);\n"+
                "vec4 ft2 = vec4(0,0,0,1);\n"+
                "ft2.xyz = ft0.xyz * fc[1].x;\n"+
                "ft0 = vec4(ft2.xyz,1.0);\n"+
                "vec4 ft3 = vec4(0,0,0,1);\n"+
                "ft3.xyz = ft1.xyz * 2.0 - 1.0;\n"+
                "ft3.xyz = v4 * ft3.xyz;\n"+
                "ft3.xyz = normalize(ft3.xyz);\n"+
                "ft1.xyz = mix(vec3(fc[1].z,fc[1].z,fc[1].z) * 0.08,ft0.xyz,fc[1].y);\n" +

               "vec4 ft4 = vec4(0,0,0,1);\n" +
                "ft4.xyz = fc[0].xyz - v1.xyz;\n"+ //镜头-位置
                "ft4.xyz = normalize(ft4.xyz);\n"+
            "ft4.y= dot(ft4.xyz,ft3.xyz);\n" +  //镜头-
                "ft4.x = 0.5;\n"+
                "ft4 = texture2D(fs2,ft4.xy);\n"+
                "ft1.xyz = ft1.xyz * ft4.x + ft4.y;\n"+
                "ft1.xyz = ft1.xyz * 2.1;\n"+
         
            
                "gl_FragColor = ft1;\n"+
            "\n"+
            "}"
      

        
        }
        if (paramAry) {
            for (var i: number=0; i < paramAry.length; i++) {
                keyStr += "_" + paramAry[i];
            }
            if (parmaByFragmet) {
                keyStr += "true_";
            } else {
                keyStr += "false_";

            }
            
        }
        
        if (this._dic[keyStr]) {
            this._dic[keyStr].useNum++;
            return this._dic[keyStr];
        } 

        if (parmaByFragmet) {
            paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight,$material.fogMode];
        }

        var shader: Shader3D = new shaderCls();
        shader.paramAry = paramAry;
        shader.fragment = $material.shaderStr;
        
        var encodetf: boolean = shader.encode(); 
        shader.useNum++;

        if (!encodetf ){ 
            console.log("**********错误" + keyStr);
            console.log(shader.vertex);
            console.log(shader.fragment);
        }
       // console.log(keyStr)
        if (keyStr.search("reflectivty") != -1 && true) {
            
            console.log("---------------------")
            this.outShader(shader.vertex)
            console.log("---------------------")
            this.outShader(shader.fragment)
            console.log(shader.vertex);
            console.log(shader.fragment);

            
        }

        this._dic[keyStr] = shader;
        
        return shader;
    }
    public outShader($str:string): void
    {
        var $item:Array<string>=$str.split("\n")

        console.log("----")

        for (var i: number = 0; i < $item.length; i++)
        {
            var str: string = "\"";
            str += $item[i];
       
            if (i < ($item.length - 1)) {
                str += "\\n"
                str += "\""
                str += "\+"
            } else {
                str += "\""
            }
  
            console.log(str)
        }
        console.log("----")
    }

    public gc(): void {
        super.gc();
    }


}