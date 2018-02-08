module materialui {

    export class CompileTwo {

        public static SPACE: string = " ";
        public static COMMA: string = ",";
        public static END: string = ";";
        public static FC: string = "fc";
        public static FT: string = "ft";
        public static FS: string = "fs";
        public static VI: string = "v";
        public static OP: string = "op";
        public static FO: string = "gl_FragColor";
        public static XYZ: string = ".xyz";
        public static XY: string = ".xy";
        public static X: string = ".x";
        public static Y: string = ".y";
        public static Z: string = ".z";
        public static W: string = ".w";
        public static ZW: string = ".zw";
        public static MOV: string = "mov";
        //public static ONE:string = "1";
        public static ONE_FLOAT: string = "1.0";
        public static ZERO: string = "[0]";
        public static ONE: string = "[1]";
        public static TWO: string = "[2]";
        public static TWO_FLOAT: string = "2.0";
        public static THREE: string = "3";
        public static FOUR: string = "4";
        public static LN: string = "\n";
        public static texType: string = "<2d,linear,repeat>";
        public static TEX_2D: string = "2d";
        public static TEX_CUBE: string = "cube";
        public static TEX_LINEAR: string = "linear";
        public static TEX_NEAREST: string = "nearest";
        public static TEX_WRAP_REPEAT: string = "repeat";
        public static TEX_WRAP_CLAMP: string = "clamp";
        public static LEFT_BRACKET: string = "<";
        public static RIGHT_BRACKET: string = ">";
        public static texCubeType: string = "<cube,clamp,linear,mipnone>";

        public static TEX: string = "tex";
        public static ADD: string = "add";
        public static SUB: string = "sub";
        public static MUL: string = "mul";
        public static DIV: string = "div";
        public static ADD_MATH: string = "+";
        public static SUB_MATH: string = "-";
        public static MUL_MATH: string = "*";
        public static MUL_EQU_MATH: string = "*=";
        public static DIV_MATH: string = "/";
        public static RCP: string = "rcp";
        public static MIN: string = "min";
        public static MAX: string = "max";
        public static FRC: string = "frc";
        public static SQT: string = "sqt";
        public static RSQ: string = "rsq";
        public static POW: string = "pow";
        public static LOG: string = "log";
        public static EXP: string = "exp";
        public static NRM: string = "normalize";
        public static SIN: string = "sin";
        public static COS: string = "cos";
        public static CRS: string = "crs";
        public static DP3: string = "dp3";
        public static DOT: string = "dot";
        public static DP4: string = "dp4";
        public static ABS: string = "abs";
        public static NEG: string = "neg";
        public static SAT: string = "sat";
        public static LERP: string = "lerp";
        public static KIL: string = "kil";
        public static M33: string = "m33";

        public static VEC4: string = "vec4";
        public static VEC3: string = "vec3";
        public static VEC2: string = "vec2";
        public static EQU: string = "=";
        public static texture2D: string = "texture2D";
        public static textureCube: string = "textureCube";
        public static LEFT_PARENTH: string = "(";
        public static RIGHT_PARENTH: string = ")";
        public static DEFAULT_VEC4: string = "vec4(0,0,0,1)";
        public static MIX: string = "mix";
        public static REFLECT: string = "reflect";
        public static IF: string = "if";
        public static DISCARD: string = "{discard;}";
        public static scalelight: string = "scalelight";
        //public static fogdata:string = "fogdata";
        //public static fogcolor:string = "fogcolor";





        public priorityList: Array<Array<NodeTree>>;

        private fragmentTempList: Array<RegisterItem>;
        private fragmentTexList: Array<RegisterItem>;
        private fragmentConstList: Array<RegisterItem>;

        private defaultUvReg: RegisterItem;
        private defaultLightUvReg: RegisterItem;
        private defaultPtReg: RegisterItem;
        private defaultLutReg: RegisterItem;
        private defaultTangent: RegisterItem;
        private defatultV5: RegisterItem;
        private defatultV6: RegisterItem;
        //private defaultBinormal:RegisterItem;

        private strVec: Array<string>;
        private texVec: Array<TexItem>;
        private constVec: Array<ConstItem>;
        private hasTime: boolean;
        private timeSpeed: number = 0;
        private blendMode: number;
        private writeZbuffer: boolean;
        private backCull: boolean;
        private killNum: number = 0;
        private hasVertexColor: boolean;
        private usePbr: boolean;
        private useNormal: boolean;
        private roughness: number = 0;
        private hasFresnel: boolean;
        private useDynamicIBL: boolean;
        private normalScale: number = 0;
        private lightProbe: boolean;
        private useLightMap: boolean;
        private directLight: boolean;
        private noLight: boolean;
        private fogMode: number;
        private scaleLightMap: boolean;
        private useKill: boolean;
        private fcNum: number;


        private _killID: number = 0;
        private _timeID: number = 0;
        private _fogdataID: number = 0;

        private _camposID: number = 0;

        private _fogcolorID: number = 0;
        private _scalelightmapID: number = 0;

        private _fcBeginID: number = 0;
        public constructor() {
            this.initReg();
            new Vector3D
            this.defaultUvReg = new RegisterItem(0);
            this.defaultPtReg = new RegisterItem(1);
            this.defaultLightUvReg = new RegisterItem(2);
            this.defaultLutReg = new RegisterItem(3);
            this.defaultTangent = new RegisterItem(4);

            this.defatultV5 = new RegisterItem(5);
            this.defatultV6 = new RegisterItem(6);
        }
        private initReg(): void {
            this.fragmentTempList = new Array
            this.fragmentTexList = new Array
            this.fragmentConstList = new Array
            for (var i: number = 0; i < 8; i++) {
                this.fragmentTempList.push(new RegisterItem(i));
                this.fragmentTexList.push(new RegisterItem(i));
            }

            for (i = 0; i < 28; i++) {
                this.fragmentConstList.push(new RegisterItem(i));
            }

        }

        public compile($priorityList: Array<Array<NodeTree>>, $materialTree: MaterialTree): string {

            NodeTree.jsMode = true;
            this.priorityList = $priorityList;
            this.strVec = new Array;
            this.texVec = new Array;
            this.constVec = new Array;
            this.hasTime = false;
            this.hasVertexColor = false;
            this.usePbr = false;
            this.useNormal = false;
            this.roughness = 0;
            this.hasFresnel = false;
            this.useDynamicIBL = false;
            this.lightProbe = false;
            this.useLightMap = false;
            this.useKill = false;
            this.directLight = false;
            this.noLight = false;
            this.fogMode = 0;
            this.scaleLightMap = false;

            this.initBaseFc();

            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {
                    this.processNode(treelist[j]);
                }
            }
            var resultStr: string = this.getGLSLStr();
            $materialTree.shaderStr = resultStr;
            $materialTree.constList = this.constVec;
            $materialTree.texList = this.texVec;
            var $materialBaseParam: MaterialBaseParam = new MaterialBaseParam()
            $materialBaseParam.setData($materialTree, []);

            $materialTree.fcNum = this.getMaxFc();
            $materialTree.fcData = this.makeFc($materialTree.fcNum);


            $materialTree.hasTime = this.hasTime;;
            $materialTree.hasVertexColor = this.hasVertexColor;;
            $materialTree.usePbr = this.usePbr;;
            $materialTree.useNormal = this.useNormal;;
            $materialTree.roughness = 0;
            $materialTree.hasFresnel = this.hasFresnel;;
            $materialTree.useDynamicIBL = this.useDynamicIBL;;
            $materialTree.lightProbe = this.lightProbe;;
            $materialTree.useKill = this.useKill;;
            $materialTree.directLight = this.directLight;;
            $materialTree.noLight = this.noLight;;
            $materialTree.fogMode = this.fogMode;;
            $materialTree.scaleLightMap = this.scaleLightMap;;

            return resultStr

        }
        private getMaxFc():number
        {
            var maxID: number = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            } else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }
            return maxID
        }
        private makeFc(fcNum: number): Float32Array {

            var fcIDAry:Array<number> = [this._camposID, this._fogcolorID, this._scalelightmapID];
            var fcData: Float32Array = new Float32Array(fcNum * 4);

            if (this.hasTime || this.useKill || this.fogMode != 0) {//fc0
                if (this.useKill) {
                    fcData[0] = this.killNum;
                }
                if (this.fogMode != 0) {
                    fcData[2] = Scene_data.fogData[0];
                    fcData[3] = Scene_data.fogData[1];
                }
            }
            if (this.usePbr || this.fogMode == 1) {
                var idx: number = fcIDAry[0] * 4;
                fcData[0 + idx] = Scene_data.cam3D.x ;
                fcData[1 + idx] = Scene_data.cam3D.y ;
                fcData[2 + idx] = Scene_data.cam3D.z;
            }

            if (this.fogMode != 0) {
                var idx: number = fcIDAry[1] * 4;
                fcData[0 + idx] = Scene_data.fogColor[0];
                fcData[1 + idx] = Scene_data.fogColor[1];
                fcData[2 + idx] = Scene_data.fogColor[2];
            }
            for (var i: number = 0; i < this.constVec.length; i++) {
                this.constVec[i].creat(fcData);
            }
            return fcData
         
        }
        private getGLSLStr(): string {


            var mainStr: string = "";
            for (var i: number = 0; i < this.strVec.length; i++) {
                mainStr += this.strVec[i] + "\n";
            }

            var perStr: string = "precision mediump float;\n";
            //"uniform sampler2D s_texture;\n" +
            var hasParticleColor: boolean = false;
            var texStr: string = "";
            for (i = 0; i < this.texVec.length; i++) {
                if (this.texVec[i].type == 3) {
                    texStr += "uniform samplerCube fs" + this.texVec[i].id + ";\n";
                } else {
                    texStr += "uniform sampler2D fs" + this.texVec[i].id + ";\n";
                }

                if (this.texVec[i].isParticleColor) {
                    hasParticleColor = true;
                }
            }


            var constStr: string = "";

            //			if(hasTime || this.usePbr || this.useKill){
            //				constStr += "uniform vec4 fc" + 0 + ";\n";
            //			}
            //			
            //			if(this.usePbr || this.fogMode == 1){
            //				constStr += "uniform vec4 fc" + 2 + ";\n";
            //			}
            //			
            //			if(this.scaleLightMap){
            //				constStr += "uniform float " + scalelight + ";\n";
            //			}
            //			
            //			if(this.fogMode != 0){
            //				constStr += "uniform vec2 " + fogdata + ";\n";
            //				constStr += "uniform vec3 " + fogcolor + ";\n";
            //			}
            //			
            //			for(i = 0;i < this.constVec.length;i++){
            //				constStr += "uniform vec4 fc" + this.constVec[i].id + ";\n";
            //			}

            var maxID: number = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            } else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }

            this.fcNum = maxID;

            if (this.fcNum > 0) {
                constStr += "uniform vec4 fc[" + (this.fcNum) + "];\n";
            }




            var varyStr: string = "";
            varyStr += "varying vec2 v0;\n";
            if (this.lightProbe || this.directLight) {
                varyStr += "varying vec3 v2;\n";
            } else if (this.useLightMap) {
                varyStr += "varying vec2 v2;\n";
            }

            if (this.hasVertexColor) {
                varyStr += "varying vec4 v2;\n";
            }
            
            if (this.usePbr ) {
                varyStr += "varying vec3 v1;\n";
                if (!this.useNormal) {
                    varyStr += "varying vec3 v4;\n";
                } else {
                    varyStr += "varying mat3 v4;\n";
                }

            } else if (this.fogMode != 0) {
                varyStr += "varying vec3 v1;\n";
            }
            if (this.useNormal) {
                varyStr += "varying vec3 v7;\n";
            }
            if (hasParticleColor) {
                varyStr += "varying vec2 v1;\n";
            }

            var beginStr: string = "void main(void){\n\n";
            var endStr: string = "\n}";



            var resultStr: string = perStr + texStr + constStr + varyStr + beginStr + mainStr + endStr;

            return resultStr;
        }
        public getFragmentTex($nodeTreeTex: NodeTreeTex = null): RegisterItem {
            for (var i: number = 0; i < this.fragmentTexList.length; i++) {
                if (!this.fragmentTexList[i].inUse) {
                    this.fragmentTexList[i].inUse = true;
                    this.fragmentTexList[i].url = "";
                    return this.fragmentTexList[i];
                }
            }
            return null;
        }
        public getFragmentTemp(): RegisterItem {
            for (var i: number = 0; i < this.fragmentTempList.length; i++) {
                if (!this.fragmentTempList[i].inUse) {
                    this.fragmentTempList[i].inUse = true;
                    return this.fragmentTempList[i];
                }
            }
            return null;
        }
        public processTexNode($node: NodeTree): void {
            var str: string = ""
            var input: NodeTreeInputItem = $node.inputVec[0];
            var regtex: RegisterItem = this.getFragmentTex(<NodeTreeTex>$node);
            var regtemp: RegisterItem = this.getFragmentTemp();

            //"vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +

            var resultStr: string;

            if (regtemp.hasInit) {
                resultStr = CompileTwo.FT + regtemp.id;
            } else {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode: NodeTree = input.parentNodeItem.node;
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+ pNode.getComponentID(input.parentNodeItem.id) +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            } else {
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+CompileTwo. VI+ defaultUvReg.id +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);

                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            if ((<NodeTreeTex>$node).permul) {
                str += CompileTwo.LN + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_EQU_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.W + CompileTwo.END;
            }

            $node.regResultTemp = regtemp;
            $node.regResultTex = regtex;
            $node.shaderStr = str;

            this.strVec.push(str);

            var texItem: TexItem = new TexItem;
            texItem.id = regtex.id;
            texItem.url = (<NodeTreeTex>$node).url;
            texItem.isDynamic = (<NodeTreeTex>$node).isDynamic;
            texItem.paramName = (<NodeTreeTex>$node).paramName;
            texItem.isMain = (<NodeTreeTex>$node).isMain;
            texItem.wrap = (<NodeTreeTex>$node).wrap;
            texItem.filter = (<NodeTreeTex>$node).filter;
            texItem.mipmap = (<NodeTreeTex>$node).mipmap;
            texItem.permul = (<NodeTreeTex>$node).permul;

            TextureManager.getInstance().getTexture(Scene_data.fileRoot + texItem.url, ($texture: TextureRes) => {
                texItem.textureRes = $texture;
            });
            this.texVec.push(texItem);

            input.hasCompiled = true;
            if (pNode) {
                pNode.releaseUse();
            }

        }
        public processDynamicNode($node: NodeTree, opCode: string): void {
            var str: string = ""
            var input0: NodeTreeInputItem = $node.inputVec[0];
            var input1: NodeTreeInputItem = $node.inputVec[1];
            var type0: string = input0.type;
            var type1: string = input1.type;

            var pNode0: NodeTree = input0.parentNodeItem.node;
            var pNode1: NodeTree = input1.parentNodeItem.node;

            var output: NodeTreeOutoutItem = $node.outputVec[0];

            var regtemp: RegisterItem = this.getFragmentTemp();

            var resultStr: string = "";

            //"vec4 ft0 = vec4(0,0,0,0);
            if (!regtemp.hasInit && !(input0.type == MaterialItemType.VEC4 || input1.type == MaterialItemType.VEC4)) {//vec4(0,0,0,0)
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }

            //"vec4 info = infoUv * infoLight;\n" +

            if (input0.type == MaterialItemType.VEC4 || input1.type == MaterialItemType.VEC4) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + COMMA;
                if (!regtemp.hasInit) {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE;
                    regtemp.hasInit = true;
                }
                str = CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.FLOAT) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.VEC2) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + XY + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            } else if (output.type == MaterialItemType.VEC3) {
                //str = opCode +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo.XYZ+ COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }

            str += pNode0.getComponentID(input0.parentNodeItem.id);

            str += CompileTwo.SPACE + opCode + CompileTwo.SPACE;

            str += pNode1.getComponentID(input1.parentNodeItem.id);

            str = resultStr + str + CompileTwo.END;


            input0.hasCompiled = true;
            input1.hasCompiled = true;
            pNode0.releaseUse();
            pNode1.releaseUse();

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
        }

        public processNode($node: NodeTree): void {
            switch ($node.type) {
                case NodeTree.VEC3:
                case NodeTree.FLOAT:
                case NodeTree.VEC2:
                    this.processVec3Node($node);
                    break;
                case NodeTree.TEX:
                    this.processTexNode($node);
                    break;
                case NodeTree.MUL:
                    this.processDynamicNode($node, "*");
                    break;
                case NodeTree.ADD:
                    this.processDynamicNode($node, "+");
                    break;
                case NodeTree.SUB:
                    this.processDynamicNode($node, "-");
                    break;
                case NodeTree.DIV:
                    this.processDynamicNode($node, "/");
                    break;
                case NodeTree.OP:
                    this.processOpNode($node);
                    break;
                case NodeTree.TIME:
                    //   processTimeNode($node);
                    break;
                case NodeTree.SIN:
                    //   processStaticNode($node, SIN);
                    break;
                case NodeTree.LERP:
                    //  processLerpNode($node);
                    break;
                case NodeTree.PTCOLOR:
                    //  processParticleColor($node);
                    break;
                case NodeTree.VERCOLOR:
                    //  hasVertexColor = true;
                    break;
                case NodeTree.HEIGHTINFO:
                    //  processHeightInfo($node);
                    break;
                case NodeTree.FRESNEL:
                    this.processFresnel($node);
                    break;
                case NodeTree.REFRACTION:
                    // processRefraction($node);
                    break;
                case NodeTree.PANNER:
                    // processPanner($node);
                    break;
                case NodeTree.MIN:
                    //   processMathMinNode($node);
                    break;
            }

        }
        private preSetNormal(): void {
            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> =this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {
                    if (treelist[j].type == NodeTree.OP) {

                        var inputMetallic: NodeTreeInputItem = treelist[j].inputVec[1];
                        var inputSpecular: NodeTreeInputItem = treelist[j].inputVec[2];
                        var inputRoughness: NodeTreeInputItem = treelist[j].inputVec[3];
                        var inputNormal: NodeTreeInputItem = treelist[j].inputVec[4];

                        if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                            this.usePbr = true;
                        } else {
                            this.usePbr = false;
                        }
                        if (inputNormal.parentNodeItem) {
                           this. useNormal = true;
                        } else {
                            this.useNormal = false;
                        }
                        return;
                    }
                }
            }
        }


        public  processFresnel($node: NodeTree):void {


            this.preSetNormal();
			
			var str:string = ""
            //var input0:NodeTreeInputItem = $node.inputVec[0];
            var input1: NodeTreeInputItem = $node.inputVec[0];
            var input2: NodeTreeInputItem = $node.inputVec[1];


            //var pNode0:NodeTree = input0.parentNodeItem.node;
            var pNode1: NodeTree = input1.parentNodeItem.node;
            var pNode2: NodeTree = input2.parentNodeItem.node;

            //			var output:NodeTreeOutoutItem = $node.outputVec[0];

            var regtemp: RegisterItem = this.getFragmentTemp();

            if(!regtemp.hasInit) {
                str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo. END;
                regtemp.hasInit = true;
                this.strVec.push(str);
            }

            var normalID: number;
            if(this.usePbr) {
                if (this.useNormal) {
                    normalID = 7;
                } else {
                    normalID = this.defaultTangent.id;
                }
            }else{
                normalID =this. defaultTangent.id;
            }

			//sub ft0.xyz,fc2.xyz,v1.xyz
			//normalize ft0.xyz,ft0.xyz
			//dp3 ft0.x,ft0.xyz,v4.xyz

			//str =CompileTwo. FT+ regtemp.id +CompileTwo.XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + FC + ONE +CompileTwo.XYZ+CompileTwo. SPACE +CompileTwo.SUB_MATH+CompileTwo. SPACE + VI + defaultPtReg.id +CompileTwo.XYZ+ END + LN;
            str = CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.camposStr + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DOT + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.VI + normalID + CompileTwo.XYZ + CompileTwo. RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;


            //sub ft0.x,fc0.x,ft0.x
            //add ft0.x,ft0.x,fc5.y
            //sat ft0.x,ft0.x
            //mul ft0.x,ft0.x,fc5.x

            //			str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA + FC + ZERO + X + COMMA +CompileTwo. FT+ regtemp.id + X + LN;
            //			str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + COMMA + pNode2.getComponentID(input2.parentNodeItem.id) + LN;
            //			str += SAT +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + LN;
            //			str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id + X + COMMA +CompileTwo. FT+ regtemp.id + X + COMMA + pNode1.getComponentID(input1.parentNodeItem.id);

            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "1.0" + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + pNode2.getComponentID(input2.parentNodeItem.id) + CompileTwo.END + CompileTwo. LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.TEX_WRAP_CLAMP + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.COMMA + "0.0" + CompileTwo. COMMA + "1.0" + CompileTwo. RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
            str += CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNode1.getComponentID(input1.parentNodeItem.id) + CompileTwo. END;

            input2.hasCompiled = true;
            input1.hasCompiled = true;

            pNode2.releaseUse();
            pNode1.releaseUse();

            $node.regResultTemp = regtemp;
            $node.shaderStr = str;
            this.strVec.push(str);
            this.hasFresnel = true;
        }
        private traceFt(): void {
            return;
        }
        private get killStr(): string {
            return "fc[" + this._killID + "].x";
        }

        private get timeStr(): string {
            return "fc[" + this._timeID + "].y";
        }

        private get fogdataXStr(): string {
            return "fc[" + this._fogdataID + "].z";
        }

        private get fogdataYStr(): string {
            return "fc[" + this._fogdataID + "].w";
        }

        private get fogcolorStr(): string {
            return "fc[" + this._fogcolorID + "].xyz";
        }

        private get camposStr(): string {
            return "fc[" + this._camposID + "].xyz";
        }
        private get scalelightmapStr(): string {
            return "fc[" + this._scalelightmapID + "].x";
        }
        public processVec3Node($node: NodeTree): void {
            var str: string = "";
            this.setFragmentConst($node);
            this.addConstItem($node);
        }
        public addConstItem($node: NodeTree): void {
            if ($node.isDynamic) {
                console.log($node.paramName);
            }
            var constItem: ConstItem;

            var id: number = $node.regResultConst.id;

            for (var i: number = 0; i < this.constVec.length; i++) {
                if (this.constVec[i].id == id) {
                    constItem = this.constVec[i];
                }
            }

            if (!constItem) {
                constItem = new ConstItem;
                constItem.id = $node.regResultConst.id;
                this.constVec.push(constItem);
            }


            if ($node.type == NodeTree.VEC3) {
                if ($node.regConstIndex == 0) {
                    var v3d: Vector3D = (<NodeTreeVec3>$node).constVec3;
                    constItem.value.setTo(v3d.x, v3d.y, v3d.z);
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 4;
                        constItem.param0Index = 0;
                    }
                }
            } else if ($node.type == NodeTree.FLOAT) {
                var num: number = (<NodeTreeFloat>$node).constValue;
                if ($node.regConstIndex == 0) {
                    constItem.value.x = num;
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 1;
                        constItem.param0Index = 0;
                    }
                } else if ($node.regConstIndex == 1) {
                    constItem.value.y = num;
                    if ($node.isDynamic) {
                        constItem.paramName1 = $node.paramName;
                        constItem.param1Type = 1;
                        constItem.param1Index = 1;
                    }
                } else if ($node.regConstIndex == 2) {
                    constItem.value.z = num;
                    if ($node.isDynamic) {
                        constItem.paramName2 = $node.paramName;
                        constItem.param2Type = 1;
                        constItem.param2Index = 2;
                    }
                } else if ($node.regConstIndex == 3) {
                    constItem.value.w = num;
                    if ($node.isDynamic) {
                        constItem.paramName3 = $node.paramName;
                        constItem.param3Type = 1;
                        constItem.param3Index = 3;
                    }
                }
            } else if ($node.type == NodeTree.VEC2) {
                var vec2: Vector2D = (<NodeTreeVec2>$node).constValue;
                if ($node.regConstIndex == 0) {
                    constItem.value.x = vec2.x;
                    constItem.value.y = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName0 = $node.paramName;
                        constItem.param0Type = 2;
                        constItem.param0Index = 0;
                    }
                } else if ($node.regConstIndex == 1) {
                    constItem.value.y = vec2.x;
                    constItem.value.z = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName1 = $node.paramName;
                        constItem.param1Type = 2;
                        constItem.param1Index = 1;
                    }
                } else if ($node.regConstIndex == 2) {
                    constItem.value.z = vec2.x;
                    constItem.value.w = vec2.y;
                    if ($node.isDynamic) {
                        constItem.paramName2 = $node.paramName;
                        constItem.param2Type = 2;
                        constItem.param2Index = 2;
                    }
                }
            }



        }
        public setFragmentConst($nodeTree: NodeTree): void {
            for (var i: number = this._fcBeginID; i < this.fragmentConstList.length; i++) {
                var tf: boolean = this.fragmentConstList[i].getUse($nodeTree);
                if (tf) {
                    break;
                }
            }
        }

        public processOpNode($node: NodeTree): void {
            //diffuse

            this.lightProbe = (<NodeTreeOP>$node).lightProbe;
            this.directLight = (<NodeTreeOP>$node).directLight;
            this.noLight = (<NodeTreeOP>$node).noLight;
            this.fogMode = (<NodeTreeOP>$node).fogMode;
            this.scaleLightMap = (<NodeTreeOP>$node).scaleLightMap;

            var str: string = "";
            var inputDiffuse: NodeTreeInputItem = $node.inputVec[0];
            var inputEmissive: NodeTreeInputItem = $node.inputVec[9];
            var inputMetallic: NodeTreeInputItem = $node.inputVec[1];
            var inputSpecular: NodeTreeInputItem = $node.inputVec[2];
            var inputRoughness: NodeTreeInputItem = $node.inputVec[3];
            var inputNormal: NodeTreeInputItem = $node.inputVec[4];

            if (!inputDiffuse.parentNodeItem && !inputEmissive.parentNodeItem) {
                console.log("can not find diffuse or emissive");
                return;
            }

            if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                this.usePbr = true;
                console.log("use PBR!");
            } else {
                this.usePbr = false;
            }

            if (inputNormal.parentNodeItem) {
                this.useNormal = true;
            } else {
                this.useNormal = false;
            }

            this.useDynamicIBL = (<NodeTreeOP>$node).useDynamicIBL;

            var regOp: RegisterItem;
            var texItem: TexItem;

            this.traceFt();

            var hasDiffuse: boolean = false;
            if ((<NodeTreeOP>$node).isUseLightMap && inputDiffuse.parentNodeItem) {//漫反射部分

                hasDiffuse = true;

                var pNodeDiffuse: NodeTree = inputDiffuse.parentNodeItem.node;//diffuse输入节点

                var regtempLightMap: RegisterItem = this.getFragmentTemp();
                var resultStr: string;
                if (regtempLightMap.hasInit) {
                    resultStr = CompileTwo.FT + regtempLightMap.id;
                } else {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id;
                    regtempLightMap.hasInit = true;
                }

                if (this.lightProbe) {
                    //vec4 ft1 = vec4(v0*5.0,1.0);
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VEC4 + CompileTwo.LEFT_PARENTH + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.MUL_MATH + "2.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLightUvReg.id +CompileTwo. LN; 
                    //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + THREE + X;
                    this.strVec.push(str);
                } else if (this.directLight) {
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VEC4 + CompileTwo.LEFT_PARENTH + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    //str = resultStr +CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo.VEC4 +CompileTwo. LEFT_PARENTH+CompileTwo. VI+ defaultLightUvReg.id +CompileTwo. COMMA+ "1.0" + RIGHT_PARENTH + END;
                    //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLightUvReg.id; 
                    //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + THREE + X;
                    this.strVec.push(str);
                } else if (this.noLight) {

                } else {
                    var regtexLightMap: RegisterItem = this.getFragmentTex();
                    // ve4 ft0 = texture2D(fs0,v1);
                    // ft0.xyz = ft0.xyz * 5.0;
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexLightMap.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    if (this.scaleLightMap) {
                        str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.scalelight + CompileTwo.END;
                    } else {
                        str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "2.0" + CompileTwo.END;
                    }

                    //					str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLightUvReg.id +CompileTwo. COMMA+ FS + regtexLightMap.id +CompileTwo. SPACE + texType +CompileTwo. LN;
                    //					str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + THREE + X;
                    this.strVec.push(str);
                    texItem = new TexItem;
                    texItem.id = regtexLightMap.id;
                    texItem.type = TexItem.LIGHTMAP;
                    this.texVec.push(texItem);
                    this.useLightMap = true;
                }

                if (this.noLight && !this.directLight) {
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VEC4 + CompileTwo.LEFT_PARENTH + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                } else {
                    str = CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH
                        + CompileTwo.SPACE + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) + CompileTwo.END;
                }
                this.strVec.push(str);

                pNodeDiffuse.releaseUse();

                if (this.usePbr) {

                    var pNodeNormal: NodeTree;
                    var regtempNormal: RegisterItem;
                    regtempNormal = this.getFragmentTemp();
                    if (!regtempNormal.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempNormal.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempNormal.hasInit = true;
                        this.strVec.push(str);
                    }


                    if (this.useNormal) {
                        pNodeNormal = inputNormal.parentNodeItem.node; // normal * 2 - 1
                        // ft0.xyz = n.xyz * 2.0 - 1.0
                        str = CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeNormal.getComponentID(inputNormal.parentNodeItem.id) + CompileTwo.SPACE +
                            CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.TWO_FLOAT + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.ONE_FLOAT + CompileTwo.END;
                        //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeNormal.getComponentID(inputNormal.parentNodeItem.id) +CompileTwo. COMMA+ FC + ZERO +CompileTwo. Y+CompileTwo. LN;
                        //str += SUB +CompileTwo. SPACE +CompileTwo. FT+  regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + ZERO + X;
                        this.strVec.push(str);

                        str = CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultTangent.id + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                        this.strVec.push(str);

                        //						var regtempNormalMap:RegisterItem;
                        //						regtempNormalMap = getFragmentTemp();
                        //						if(!regtempNormalMap.hasInit){
                        //							str =CompileTwo.VEC4 +CompileTwo. SPACE +CompileTwo. FT+ regtempNormalMap.id +CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + CompileTwo.DEFAULT_VEC4 + END;
                        //							regtempNormalMap.hasInit = true;
                        //							strVec.push(str);
                        //						}
                        //						str =CompileTwo. FT+ regtempNormalMap.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. DOT+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defatultV5.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //						strVec.push(str);
                        //						
                        //						str =CompileTwo. FT+ regtempNormalMap.id +CompileTwo. Y+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. DOT+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defatultV6.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //						strVec.push(str);
                        //						
                        //						str =CompileTwo. FT+ regtempNormalMap.id + Z +CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. DOT+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultTangent.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //						strVec.push(str);
                        //						
                        //						str =CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. NRM+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormalMap.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;

                        //str = M33 +CompileTwo. SPACE +CompileTwo. FT+  regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+  regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultTangent.id +CompileTwo. LN;
                        //str +=CompileTwo.NRM+CompileTwo. SPACE +CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id + XYZ;
                        //						strVec.push(str);
                        //						regtempNormalMap.inUse = false;

                        inputNormal.hasCompiled = true;
                        pNodeNormal.releaseUse();
                    } else {
                        //ft0.xyz = vi3.xyz
                        str = CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultTangent.id + CompileTwo.XYZ + CompileTwo.END;
                        //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultTangent.id + XYZ;
                        this.strVec.push(str);
                    }
                    //trace(str);
                    //traceFt();

                    var regtempPbr: RegisterItem = this.getFragmentTemp();

                    if (!regtempPbr.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempPbr.hasInit = true;
                        this.strVec.push(str);
                    }
                    //SpecularColor = 0.08 * SpecularScale * (1-metallic) + basecolor * metallic
                    // SpecularColor = mix(0.08 * SpecularScale,basecolor,metallic);
                    str = CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.MIX + CompileTwo.LEFT_PARENTH;

                    var pNodeSpecular: NodeTree;
                    if (inputSpecular.parentNodeItem) {
                        pNodeSpecular = inputSpecular.parentNodeItem.node;
                        //vec3(ft0,ft0,ft0) * 0.08
                        str += CompileTwo.VEC3 + CompileTwo.LEFT_PARENTH + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.COMMA
                            + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.COMMA
                            + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "0.08" + CompileTwo.COMMA;
                        //str += "0.08" +CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + COMMA;
                        //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id);
                        inputSpecular.hasCompiled = true;
                    } else {
                        str += "0.04" + CompileTwo.COMMA;
                        //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ FC + ONE + Y;
                    }

                    str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.COMMA;

                    var pNodeMetallic: NodeTree;
                    if (inputMetallic.parentNodeItem) {//basecolor * metallic
                        pNodeMetallic = inputMetallic.parentNodeItem.node;
                        str += pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                        //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. COMMA+ pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id);
                    } else {
                        str += "0.5" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                        //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. XYZ+CompileTwo. COMMA+ FC + ONE + Y;
                    }
                    this.strVec.push(str);

                    this.traceFt();

                    var regtempEnvBRDF: RegisterItem = this.getFragmentTemp();//defaultLutReg
                    if (!regtempEnvBRDF.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempEnvBRDF.hasInit = true;
                        this.strVec.push(str);
                    }
                    this.traceFt();
                    // ft0.xyz= fc0.xyz - vi1.xyz;
                    //str =CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + FC + ONE +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE +CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. END+CompileTwo. LN;
                    str = CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.camposStr + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + CompileTwo.END + CompileTwo.LN;
                    str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.Y + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DOT + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;

                    //"mov vt3.x,vc13.y\n" + //粗糙度
                    //"sub vt1,vc12,vt0\n" + //cos = dot(N,V)
                    //"nrm vt1.xyz,vt1.xyz\n" +
                    //"mov ft1.x,fc7.z\n" + 
                    //"dp3 ft1.y,vi2.xyz,ft3.xyz \n"+

                    //str = SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + TWO +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. LN;
                    //str +=CompileTwo.NRM+CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. LN;
                    //str += DP3 +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. Y+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id +CompileTwo.XYZ +CompileTwo. LN; 

                    var pNodeRoughness: NodeTree;
                    if (inputRoughness.parentNodeItem) {
                        pNodeRoughness = inputRoughness.parentNodeItem.node;
                        if (pNodeRoughness instanceof NodeTreeFloat) {
                            this.roughness = (<NodeTreeFloat>pNodeRoughness).constValue;
                        } else {
                            this.roughness = 0.5;
                        }
                        str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeRoughness.getComponentID(inputRoughness.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
                        //str += MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. COMMA+  pNodeRoughness.getComponentID(inputRoughness.parentNodeItem.id) +CompileTwo. LN;
                        inputRoughness.hasCompiled = true;
                        pNodeRoughness.releaseUse();
                    } else {
                        this.roughness = 0.5;
                        str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "0.5" + CompileTwo.END + CompileTwo.LN;
                        //str += MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. COMMA+ FC + TWO + W +CompileTwo. LN;
                    }

                    // tex envBrdf
                    var regtexEnvBRDF: RegisterItem = this.getFragmentTex();

                    str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexEnvBRDF.id + CompileTwo.COMMA + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XY + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    //str += TEX +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+ FS + regtexEnvBRDF.id +CompileTwo. SPACE + texType;

                    this.strVec.push(str);
                    texItem = new TexItem;
                    texItem.id = regtexEnvBRDF.id;
                    texItem.type = TexItem.LTUMAP;
                    this.texVec.push(texItem);

                    //SpecularColor * envBrdf.x + envBrdf.y
                    str = CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.X + CompileTwo.SPACE;
                    str += CompileTwo.ADD_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.Y + CompileTwo.END + CompileTwo.LN;
                    //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. LN;
                    //str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. Y+CompileTwo. LN;

                    if (regtempEnvBRDF) {
                        regtempEnvBRDF.inUse = false;
                    }

                    if (pNodeSpecular) {
                        //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id);
                        str += CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.END;
                        pNodeSpecular.releaseUse();
                    } else {
                        str += CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "0.5" + CompileTwo.END + CompileTwo.LN;
                        //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + ONE + Y;
                    }

                    //trace(str);
                    this.strVec.push(str);

                    //specularIBL prefilteredColor * (SpecularColor * envBrdf.x + envBrdf.y) ;
                    // tex prefilteredColor
                    var regtexIBL: RegisterItem = this.getFragmentTex();

                    //reflect(I,N)

                    //"sub vt1,vt0,vc12 \n" + //反射方向  reflect = I - 2 * dot(N,I) * N
                    //"nrm vt1.xyz,vt1.xyz\n" + 
                    //"dp3 ft0.x,vi1.xyz,ft3.xyz \n"+//反射方向  reflect = I - 2 * dot(N,I) * N
                    //	"mul ft0.xyz,ft3.xyz,ft0.x \n" +
                    //	"mul ft0.xyz,ft0.xyz,fc7.y\n" +
                    //	"sub ft0.xyz,vi1.xyz,ft0.xyz\n" +
                    var regtempIBL: RegisterItem = this.getFragmentTemp();

                    if (!regtempIBL.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempIBL.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempIBL.hasInit = true;
                        this.strVec.push(str);
                    }

                    if (this.useDynamicIBL) {
                        /**
                        str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLutReg.id +CompileTwo. LN;
                        str += DIV +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + Z +CompileTwo. LN;
                        str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+ FC + FOUR + XY +CompileTwo. LN;
                        str += DIV +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+ FC + FOUR + ZW +CompileTwo. LN;
                    	
                        str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + ONE + W +CompileTwo. LN;
                    	
                        str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempIBL.id +CompileTwo. X+CompileTwo. LN;
                        str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. Y+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. Y+CompileTwo. COMMA+CompileTwo. FT+ regtempIBL.id + Z +CompileTwo. LN;
                    	
                        str += TEX +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XY +CompileTwo. COMMA+ FS + regtexIBL.id +CompileTwo. SPACE + getTexType(1,0);
                        */
                    } else {
                        //
                        //str =CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE + FC + ONE +CompileTwo. XYZ+CompileTwo. END+CompileTwo. LN;
                        str = CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + this.camposStr + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.REFLECT + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempIBL.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.textureCube + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexIBL.id + CompileTwo.COMMA + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                        //str = SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + TWO +CompileTwo. XYZ+CompileTwo. LN;
                        //str +=CompileTwo.NRM+CompileTwo. SPACE +CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. LN;
                        //str += DP3 +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id +CompileTwo.XYZ +CompileTwo. LN;
                        //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. LN;
                        //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + ZERO +CompileTwo. Y+CompileTwo. LN;
                        //str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. LN;
                        //str += TEX +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+ FS + regtexIBL.id +CompileTwo. SPACE + texCubeType;
                    }

                    //trace(str);

                    //trace(str);
                    this.strVec.push(str);
                    texItem = new TexItem;
                    texItem.id = regtexIBL.id;
                    texItem.type = TexItem.CUBEMAP;
                    this.texVec.push(texItem);

                    //str =CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. SPACE +  MUL_MATH +CompileTwo. SPACE + FC + ZERO +CompileTwo. X+ END;
                    //strVec.push(str);

                    str = CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.END;

                    //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XYZ;
                    //trace(str);
                    this.strVec.push(str);

                    regtempIBL.inUse = false;

                    console.log(str)

                    //regtempEnvBRDF.inUse = false;
                }



                regOp = this.getFragmentTemp();//输出用临时寄存器

                if (!regOp.hasInit) {
                    str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                    regOp.hasInit = true;
                    this.strVec.push(str);
                }

                if (this.usePbr) {
                    //diffuseColor = basecolor * (1-metallic) 
                    //f0.xyz = fc0.xyz * 
                    //str =CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. END+CompileTwo. LN;


                    //var regtempMetallic:RegisterItem = getFragmentTemp();
                    //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ FC + ZERO +CompileTwo. X+CompileTwo. LN;
                    if (pNodeMetallic) {
                        str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.LEFT_PARENTH
                            + CompileTwo.ONE_FLOAT + CompileTwo.SUB_MATH + pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                        //str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id);
                        inputMetallic.hasCompiled = true;
                        pNodeMetallic.releaseUse();
                    } else {
                        str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "0.5" + CompileTwo.END + CompileTwo.LN;
                        //str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ FC + ONE + Y;
                    }
                    str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.END;

                    //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. LN;
                    //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo.XYZ +CompileTwo. LN;
                    //str += ADD +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ CompileTwo. FT+ regtempPbr.id + XYZ;

                    //regtempMetallic.inUse = false;
                } else {
                    //ft2.xyz = ft0.xyz * ft1.xyz
                    //str =  MUL +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    //str =CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+ END;
                    //str =  MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.END;
                }

                inputDiffuse.hasCompiled = true;
                //pNodeDiffuse.releaseUse();

                this.strVec.push(str);

                regtempLightMap.inUse = false;
                if (regtempPbr) {
                    regtempPbr.inUse = false;
                }


            }

            if (inputEmissive.parentNodeItem) {//自发光部分
                var pNodeEmissive: NodeTree = inputEmissive.parentNodeItem.node;//emissive输入节点

                if (!regOp) {
                    regOp = this.getFragmentTemp();

                    if (!regOp.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regOp.hasInit = true;
                        this.strVec.push(str);
                    }
                }

                if (hasDiffuse) {
                    //op.xyz = op.xyz + ft0.xyz
                    //str =  ADD +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeEmissive.getComponentID(inputEmissive.parentNodeItem.id);
                    //op.xyz = op.xyz + ft0.xyz
                    str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + pNodeEmissive.getComponentID(inputEmissive.parentNodeItem.id) + CompileTwo.END;
                } else {
                    //str =  MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeEmissive.getComponentID(inputEmissive.parentNodeItem.id);
                    //op.xyz = ft0.xyz
                    str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeEmissive.getComponentID(inputEmissive.parentNodeItem.id) + CompileTwo.END;
                }
                this.strVec.push(str);

                pNodeEmissive.releaseUse();
            }

            //alpha
            str = "";
            var inputAlpha: NodeTreeInputItem = $node.inputVec[7];
            if (!inputAlpha.parentNodeItem) {
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ FC + ZERO + X;
                //op.w = 1
                str = CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.ONE_FLOAT + CompileTwo.END;
            } else {
                var pNodeAlpha: NodeTree = inputAlpha.parentNodeItem.node;
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ pNodeAlpha.getComponentID(inputAlpha.parentNodeItem.id);
                //op.w = ft0.w
                str = CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeAlpha.getComponentID(inputAlpha.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.END;
                pNodeAlpha.releaseUse();
            }
            this.strVec.push(str);

            //kill
            str = "";
            var inputKill: NodeTreeInputItem = $node.inputVec[8];
            if (inputKill.parentNodeItem) {
                var pNodeKill: NodeTree = inputKill.parentNodeItem.node;
                this.killNum = (<NodeTreeOP>$node).killNum;

                //if(ft0.x < ft1.x){discard;}
                //str = IF +CompileTwo. LEFT_PARENTH+ pNodeKill.getComponentID(inputKill.parentNodeItem.id) + LEFT_BRACKET + FC + ZERO + Z + RIGHT_PARENTH + DISCARD;

                str = CompileTwo.IF + CompileTwo.LEFT_PARENTH + pNodeKill.getComponentID(inputKill.parentNodeItem.id) + CompileTwo.LEFT_BRACKET + this.killStr + CompileTwo.RIGHT_PARENTH + CompileTwo.DISCARD;

                this.strVec.push(str);

                this.useKill = true;
            }

            var regtempFog: RegisterItem;
            if (this.fogMode == 1) {
                regtempFog = this.getFragmentTemp();
                // sub ft0.xyz,fc3.xyz,vi4.xyz
                // dp3 ft0.x,ft0.xyz,ft0.xyz;
                // mul ft0.x,ft0.x,fc4.y
                //div ft0.x,fc4.z,ft0.x
                //mul ft0.xyz,fc4.xyz,ft0.x


                //str += CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + "distance("  +VI + defaultPtReg.id + XYZ+"*0.01" +CompileTwo. COMMA+ FC + ONE +CompileTwo. XYZ+")*100.0" +CompileTwo. END+CompileTwo. LN;
                str = CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "distance(" + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + "*0.01" + CompileTwo.COMMA + this.camposStr + ")*100.0" + CompileTwo.END + CompileTwo.LN;


                //str +=CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE + fogdata +CompileTwo. X+CompileTwo. END+CompileTwo. LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + this.fogdataXStr + CompileTwo.END + CompileTwo.LN;
                //str +=CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + fogdata +CompileTwo. Y+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. END+CompileTwo. LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.fogdataYStr + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.TEX_WRAP_CLAMP + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.COMMA + "0.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                //str +=CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + MIX + LEFT_PARENTH+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+   fogcolor+CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempFog.id +CompileTwo. X+ RIGHT_PARENTH + END;
                str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.MIX + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.COMMA + this.fogcolorStr + CompileTwo.COMMA + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.RIGHT_PARENTH + CompileTwo.END;

                this.strVec.push(str);
            } else if (this.fogMode == 2) {
                regtempFog = this.getFragmentTemp();
                //				"ft1.x = distance(v1.xyz*0.01, fc2.xyz)*100.0;\n" +
                //				"ft1.x = ft1.x - fogdata.x;\n"+
                //				"ft1.x = fogdata.y * ft1.x;\n" +
                //				"ft1.x = clamp(ft1.x,0.0,1.0);\n"+
                //				"ft2.xyz = mix(ft2.xyz,fogcolor.xyz,ft1.x);\n" +

                //str =CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. VI+ defaultPtReg.id +CompileTwo. Y+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE + fogdata +CompileTwo. X+CompileTwo. END+CompileTwo. LN;
                str = CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.Y + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + this.fogdataXStr + CompileTwo.END + CompileTwo.LN;
                //str +=CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE + fogdata +CompileTwo. Y+CompileTwo. END+CompileTwo. LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + this.fogdataYStr + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + "1.0" + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.TEX_WRAP_CLAMP + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.COMMA + "0.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;

                //str +=CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + MIX +CompileTwo. LEFT_PARENTH+ fogcolor +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempFog.id +CompileTwo. X+ RIGHT_PARENTH + END;
                str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.MIX + CompileTwo.LEFT_PARENTH + this.fogcolorStr + CompileTwo.COMMA + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                this.strVec.push(str);

            }

            str = "";
            //"gl_FragColor = infoUv;\n" +
            str = CompileTwo.FO + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.END;
            this.strVec.push(str);



            this.backCull = (<NodeTreeOP>$node).backCull;
            this.blendMode = (<NodeTreeOP>$node).blendMode;
            this.writeZbuffer = (<NodeTreeOP>$node).writeZbuffer;
            this.normalScale = (<NodeTreeOP>$node).normalScale;
        }
        private initBaseFc(): void {
            var dataID: number = 0;


            var $useKill: Boolean = false;
            var $hasTime: Boolean = false;
            var $fogMode: number = 0;
            var $usePbr: Boolean = false;
            //var $hasFresnel:Boolean = false;
            var $scaleLightMap: Boolean = false;


            for (var i: number = this.priorityList.length - 1; i >= 0; i--) {
                var treelist: Array<NodeTree> = this.priorityList[i];
                for (var j: number = 0; j < treelist.length; j++) {

                    var node: NodeTree = treelist[j];
                    if (node.type == NodeTree.OP) {
                        var opnode: NodeTreeOP = node as NodeTreeOP;

                        $fogMode = opnode.fogMode;
                        $scaleLightMap = opnode.scaleLightMap;
                        if (opnode.inputVec[8].parentNodeItem) {
                            $useKill = true;
                        }

                        var inputMetallic: NodeTreeInputItem = opnode.inputVec[1];
                        var inputSpecular: NodeTreeInputItem = opnode.inputVec[2];
                        var inputRoughness: NodeTreeInputItem = opnode.inputVec[3];

                        if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                            $usePbr = true;
                        }

                    } else if (node.type == NodeTree.TIME || node.type == NodeTree.PANNER) {
                        $hasTime = true;
                    }


                }
            }

            if ($useKill || $hasTime || $fogMode != 0) {
                dataID++;
            }
            if ($usePbr || $fogMode == 1) {
                this._camposID = dataID;
                dataID++;
            }
            if ($fogMode != 0) {
                this._fogcolorID = dataID;
                dataID++;
            }
            if ($scaleLightMap) {
                this._scalelightmapID = dataID;
                dataID++;
            }
            this._fcBeginID = dataID;

        }

    }
}