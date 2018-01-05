var materialui;
(function (materialui) {
    var CompileTwo = (function () {
        function CompileTwo() {
            this.timeSpeed = 0;
            this.killNum = 0;
            this.roughness = 0;
            this.normalScale = 0;
            this._killID = 0;
            this._timeID = 0;
            this._fogdataID = 0;
            this._camposID = 0;
            this._fogcolorID = 0;
            this._scalelightmapID = 0;
            this._fcBeginID = 0;
            this.initReg();
            new Vector3D;
            this.defaultUvReg = new materialui.RegisterItem(0);
            this.defaultPtReg = new materialui.RegisterItem(1);
            this.defaultLightUvReg = new materialui.RegisterItem(2);
            this.defaultLutReg = new materialui.RegisterItem(3);
            this.defaultTangent = new materialui.RegisterItem(4);
            this.defatultV5 = new materialui.RegisterItem(5);
            this.defatultV6 = new materialui.RegisterItem(6);
        }
        CompileTwo.prototype.initReg = function () {
            this.fragmentTempList = new Array;
            this.fragmentTexList = new Array;
            this.fragmentConstList = new Array;
            for (var i = 0; i < 8; i++) {
                this.fragmentTempList.push(new materialui.RegisterItem(i));
                this.fragmentTexList.push(new materialui.RegisterItem(i));
            }
            for (i = 0; i < 28; i++) {
                this.fragmentConstList.push(new materialui.RegisterItem(i));
            }
        };
        CompileTwo.prototype.compile = function ($priorityList, $materialTree) {
            materialui.NodeTree.jsMode = true;
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
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    this.processNode(treelist[j]);
                }
            }
            var resultStr = this.getGLSLStr();
            //  console.log(resultStr)
            return resultStr;
        };
        CompileTwo.prototype.getGLSLStr = function () {
            var mainStr = "";
            for (var i = 0; i < this.strVec.length; i++) {
                mainStr += this.strVec[i] + "\n";
            }
            var perStr = "precision mediump float;\n";
            //"uniform sampler2D s_texture;\n" +
            var hasParticleColor = false;
            var texStr = "";
            for (i = 0; i < this.texVec.length; i++) {
                if (this.texVec[i].type == 3) {
                    texStr += "uniform samplerCube fs" + this.texVec[i].id + ";\n";
                }
                else {
                    texStr += "uniform sampler2D fs" + this.texVec[i].id + ";\n";
                }
                if (this.texVec[i].isParticleColor) {
                    hasParticleColor = true;
                }
            }
            var constStr = "";
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
            var maxID = 0;
            if (this.constVec.length) {
                maxID = this.constVec[this.constVec.length - 1].id + 1;
            }
            else {
                if (this._fcBeginID > 0) {
                    maxID = this._fcBeginID;
                }
            }
            this.fcNum = maxID;
            if (this.fcNum > 0) {
                constStr += "uniform vec4 fc[" + (this.fcNum) + "];\n";
            }
            var varyStr = "";
            varyStr += "varying vec2 v0;\n";
            if (this.lightProbe || this.directLight) {
                varyStr += "varying vec3 v2;\n";
            }
            else if (this.useLightMap) {
                varyStr += "varying vec2 v2;\n";
            }
            if (this.hasVertexColor) {
                varyStr += "varying vec4 v2;\n";
            }
            if (this.usePbr) {
                varyStr += "varying vec3 v1;\n";
                if (!this.useNormal) {
                    varyStr += "varying vec3 v4;\n";
                }
                else {
                    varyStr += "varying mat3 v4;\n";
                }
            }
            else if (this.fogMode != 0) {
                varyStr += "varying vec3 v1;\n";
            }
            if (hasParticleColor) {
                varyStr += "varying vec2 v1;\n";
            }
            var beginStr = "void main(void){\n\n";
            var endStr = "\n}";
            var resultStr = perStr + texStr + constStr + varyStr + beginStr + mainStr + endStr;
            return resultStr;
        };
        CompileTwo.prototype.getFragmentTex = function ($nodeTreeTex) {
            if ($nodeTreeTex === void 0) { $nodeTreeTex = null; }
            for (var i = 0; i < this.fragmentTexList.length; i++) {
                if (!this.fragmentTexList[i].inUse) {
                    this.fragmentTexList[i].inUse = true;
                    this.fragmentTexList[i].url = "";
                    return this.fragmentTexList[i];
                }
            }
            return null;
        };
        CompileTwo.prototype.getFragmentTemp = function () {
            for (var i = 0; i < this.fragmentTempList.length; i++) {
                if (!this.fragmentTempList[i].inUse) {
                    this.fragmentTempList[i].inUse = true;
                    return this.fragmentTempList[i];
                }
            }
            return null;
        };
        CompileTwo.prototype.processTexNode = function ($node) {
            var str = "";
            var input = $node.inputVec[0];
            var regtex = this.getFragmentTex($node);
            var regtemp = this.getFragmentTemp();
            //"vec4 infoUv = texture2D(s_texture, v_texCoord.xy);\n" +
            var resultStr;
            if (regtemp.hasInit) {
                resultStr = CompileTwo.FT + regtemp.id;
            }
            else {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id;
                regtemp.hasInit = true;
            }
            if (input.parentNodeItem) {
                var pNode = input.parentNodeItem.node;
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+ pNode.getComponentID(input.parentNodeItem.id) +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + pNode.getComponentID(input.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            else {
                //str = TEX +CompileTwo. SPACE +CompileTwo. FT+ regtemp.id +CompileTwo. COMMA+CompileTwo. VI+ defaultUvReg.id +CompileTwo. COMMA+ FS + regtex.id +CompileTwo. SPACE + getTexType(NodeTreeTex($node).wrap);
                str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtex.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
            }
            if ($node.permul) {
                str += CompileTwo.LN + CompileTwo.FT + regtemp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_EQU_MATH + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.W + CompileTwo.END;
            }
            $node.regResultTemp = regtemp;
            $node.regResultTex = regtex;
            $node.shaderStr = str;
            this.strVec.push(str);
            var texItem = new TexItem;
            texItem.id = regtex.id;
            texItem.url = $node.url;
            texItem.isDynamic = $node.isDynamic;
            texItem.paramName = $node.paramName;
            texItem.isMain = $node.isMain;
            texItem.wrap = $node.wrap;
            texItem.filter = $node.filter;
            texItem.mipmap = $node.mipmap;
            texItem.permul = $node.permul;
            this.texVec.push(texItem);
            input.hasCompiled = true;
            if (pNode) {
                pNode.releaseUse();
            }
        };
        CompileTwo.prototype.processDynamicNode = function ($node, opCode) {
            var str = "";
            var input0 = $node.inputVec[0];
            var input1 = $node.inputVec[1];
            var type0 = input0.type;
            var type1 = input1.type;
            var pNode0 = input0.parentNodeItem.node;
            var pNode1 = input1.parentNodeItem.node;
            var output = $node.outputVec[0];
            var regtemp = this.getFragmentTemp();
            var resultStr = "";
            //"vec4 ft0 = vec4(0,0,0,0);
            if (!regtemp.hasInit && !(input0.type == materialui.MaterialItemType.VEC4 || input1.type == materialui.MaterialItemType.VEC4)) {
                resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END + CompileTwo.LN;
                regtemp.hasInit = true;
            }
            //"vec4 info = infoUv * infoLight;\n" +
            if (input0.type == materialui.MaterialItemType.VEC4 || input1.type == materialui.MaterialItemType.VEC4) {
                //str = opCode + SPACE + FT + regtemp.id + COMMA;
                if (!regtemp.hasInit) {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE;
                    regtemp.hasInit = true;
                }
                str = CompileTwo.FT + regtemp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.FLOAT) {
                //str = opCode + SPACE + FT + regtemp.id + X + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC2) {
                //str = opCode + SPACE + FT + regtemp.id + XY + COMMA;
                str = CompileTwo.FT + regtemp.id + CompileTwo.XY + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE;
            }
            else if (output.type == materialui.MaterialItemType.VEC3) {
                //str = opCode + SPACE + FT + regtemp.id + XYZ + COMMA;
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
        };
        CompileTwo.prototype.processNode = function ($node) {
            switch ($node.type) {
                case materialui.NodeTree.VEC3:
                case materialui.NodeTree.FLOAT:
                case materialui.NodeTree.VEC2:
                    //processVec3Node($node);
                    break;
                case materialui.NodeTree.TEX:
                    this.processTexNode($node);
                    break;
                case materialui.NodeTree.MUL:
                    this.processDynamicNode($node, "*");
                    break;
                case materialui.NodeTree.ADD:
                    this.processDynamicNode($node, "+");
                    break;
                case materialui.NodeTree.SUB:
                    this.processDynamicNode($node, "-");
                    break;
                case materialui.NodeTree.DIV:
                    this.processDynamicNode($node, "/");
                    break;
                case materialui.NodeTree.OP:
                    this.processOpNode($node);
                    break;
                case materialui.NodeTree.TIME:
                    //   processTimeNode($node);
                    break;
                case materialui.NodeTree.SIN:
                    //   processStaticNode($node, SIN);
                    break;
                case materialui.NodeTree.LERP:
                    //  processLerpNode($node);
                    break;
                case materialui.NodeTree.PTCOLOR:
                    //  processParticleColor($node);
                    break;
                case materialui.NodeTree.VERCOLOR:
                    //  hasVertexColor = true;
                    break;
                case materialui.NodeTree.HEIGHTINFO:
                    //  processHeightInfo($node);
                    break;
                case materialui.NodeTree.FRESNEL:
                    // processFresnel($node);
                    break;
                case materialui.NodeTree.REFRACTION:
                    // processRefraction($node);
                    break;
                case materialui.NodeTree.PANNER:
                    // processPanner($node);
                    break;
                case materialui.NodeTree.MIN:
                    //   processMathMinNode($node);
                    break;
            }
        };
        CompileTwo.prototype.traceFt = function () {
            return;
        };
        Object.defineProperty(CompileTwo.prototype, "killStr", {
            get: function () {
                return "fc[" + this._killID + "].x";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "timeStr", {
            get: function () {
                return "fc[" + this._timeID + "].y";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "fogdataXStr", {
            get: function () {
                return "fc[" + this._fogdataID + "].z";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "fogdataYStr", {
            get: function () {
                return "fc[" + this._fogdataID + "].w";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "fogcolorStr", {
            get: function () {
                return "fc[" + this._fogcolorID + "].xyz";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "camposStr", {
            get: function () {
                return "fc[" + this._camposID + "].xyz";
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(CompileTwo.prototype, "scalelightmapStr", {
            get: function () {
                return "fc[" + this._scalelightmapID + "].x";
            },
            enumerable: true,
            configurable: true
        });
        CompileTwo.prototype.processOpNode = function ($node) {
            //diffuse
            this.lightProbe = $node.lightProbe;
            this.directLight = $node.directLight;
            this.noLight = $node.noLight;
            this.fogMode = $node.fogMode;
            this.scaleLightMap = $node.scaleLightMap;
            var str = "";
            var inputDiffuse = $node.inputVec[0];
            var inputEmissive = $node.inputVec[9];
            var inputMetallic = $node.inputVec[1];
            var inputSpecular = $node.inputVec[2];
            var inputRoughness = $node.inputVec[3];
            var inputNormal = $node.inputVec[4];
            if (!inputDiffuse.parentNodeItem && !inputEmissive.parentNodeItem) {
                console.log("can not find diffuse or emissive");
                return;
            }
            if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                this.usePbr = true;
                console.log("use PBR!");
            }
            else {
                this.usePbr = false;
            }
            if (inputNormal.parentNodeItem) {
                this.useNormal = true;
            }
            else {
                this.useNormal = false;
            }
            this.useDynamicIBL = $node.useDynamicIBL;
            var regOp;
            var texItem;
            this.traceFt();
            var hasDiffuse = false;
            if ($node.isUseLightMap && inputDiffuse.parentNodeItem) {
                hasDiffuse = true;
                var pNodeDiffuse = inputDiffuse.parentNodeItem.node; //diffuse输入节点
                var regtempLightMap = this.getFragmentTemp();
                var resultStr;
                if (regtempLightMap.hasInit) {
                    resultStr = CompileTwo.FT + regtempLightMap.id;
                }
                else {
                    resultStr = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id;
                    regtempLightMap.hasInit = true;
                }
                if (this.lightProbe) {
                    //vec4 ft1 = vec4(v0*5.0,1.0);
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VEC4 + CompileTwo.LEFT_PARENTH + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.MUL_MATH + "2.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLightUvReg.id +CompileTwo. LN; 
                    //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + THREE + X;
                    this.strVec.push(str);
                }
                else if (this.directLight) {
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VEC4 + CompileTwo.LEFT_PARENTH + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    //str = resultStr +CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + VEC4 +CompileTwo. LEFT_PARENTH+CompileTwo. VI+ defaultLightUvReg.id +CompileTwo. COMMA+ "1.0" + RIGHT_PARENTH + END;
                    //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. COMMA+CompileTwo. VI+ defaultLightUvReg.id; 
                    //str += MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + THREE + X;
                    this.strVec.push(str);
                }
                else if (this.noLight) {
                }
                else {
                    var regtexLightMap = this.getFragmentTex();
                    // ve4 ft0 = texture2D(fs0,v1);
                    // ft0.xyz = ft0.xyz * 5.0;
                    str = resultStr + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.texture2D + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexLightMap.id + CompileTwo.COMMA + CompileTwo.VI + this.defaultLightUvReg.id + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    if (this.scaleLightMap) {
                        str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.scalelight + CompileTwo.END;
                    }
                    else {
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
                }
                else {
                    str = CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH
                        + CompileTwo.SPACE + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) + CompileTwo.END;
                }
                this.strVec.push(str);
                pNodeDiffuse.releaseUse();
                if (this.usePbr) {
                    var pNodeNormal;
                    var regtempNormal;
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
                        //							str = VEC4 +CompileTwo. SPACE +CompileTwo. FT+ regtempNormalMap.id +CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + DEFAULT_VEC4 + END;
                        //							regtempNormalMap.hasInit = true;
                        //							strVec.push(str);
                        //						}
                        //						str = FT + regtempNormalMap.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. DOT+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defatultV5.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //						strVec.push(str);
                        //						
                        //						str = FT + regtempNormalMap.id +CompileTwo. Y+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. DOT+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defatultV6.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //						strVec.push(str);
                        //						
                        //						str = FT + regtempNormalMap.id + Z +CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. DOT+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultTangent.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //						strVec.push(str);
                        //						
                        //						str = FT + regtempNormal.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. NRM+CompileTwo. LEFT_PARENTH+CompileTwo. FT+ regtempNormalMap.id +CompileTwo. XYZ+ RIGHT_PARENTH + END;
                        //str = M33 +CompileTwo. SPACE +CompileTwo. FT+  regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+  regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultTangent.id +CompileTwo. LN;
                        //str += NRM +CompileTwo. SPACE +CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id + XYZ;
                        //						strVec.push(str);
                        //						regtempNormalMap.inUse = false;
                        inputNormal.hasCompiled = true;
                        pNodeNormal.releaseUse();
                    }
                    else {
                        //ft0.xyz = vi3.xyz
                        str = CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultTangent.id + CompileTwo.XYZ + CompileTwo.END;
                        //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempNormal.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultTangent.id + XYZ;
                        this.strVec.push(str);
                    }
                    //trace(str);
                    //traceFt();
                    var regtempPbr = this.getFragmentTemp();
                    if (!regtempPbr.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempPbr.hasInit = true;
                        this.strVec.push(str);
                    }
                    //SpecularColor = 0.08 * SpecularScale * (1-metallic) + basecolor * metallic
                    // SpecularColor = mix(0.08 * SpecularScale,basecolor,metallic);
                    str = CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.MIX + CompileTwo.LEFT_PARENTH;
                    var pNodeSpecular;
                    if (inputSpecular.parentNodeItem) {
                        pNodeSpecular = inputSpecular.parentNodeItem.node;
                        //vec3(ft0,ft0,ft0) * 0.08
                        str += CompileTwo.VEC3 + CompileTwo.LEFT_PARENTH + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.COMMA
                            + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.COMMA
                            + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "0.08" + CompileTwo.COMMA;
                        //str += "0.08" +CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE + pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id) + COMMA;
                        //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ pNodeSpecular.getComponentID(inputSpecular.parentNodeItem.id);
                        inputSpecular.hasCompiled = true;
                    }
                    else {
                        str += "0.04" + CompileTwo.COMMA;
                    }
                    str += CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.COMMA;
                    var pNodeMetallic;
                    if (inputMetallic.parentNodeItem) {
                        pNodeMetallic = inputMetallic.parentNodeItem.node;
                        str += pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    }
                    else {
                        str += "0.5" + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    }
                    this.strVec.push(str);
                    this.traceFt();
                    var regtempEnvBRDF = this.getFragmentTemp(); //defaultLutReg
                    if (!regtempEnvBRDF.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempEnvBRDF.hasInit = true;
                        this.strVec.push(str);
                    }
                    this.traceFt();
                    // ft0.xyz= fc0.xyz - vi1.xyz;
                    //str = FT + regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + FC + ONE +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE +CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. END+CompileTwo. LN;
                    str = CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.camposStr + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + CompileTwo.END + CompileTwo.LN;
                    str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.Y + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DOT + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                    //"mov vt3.x,vc13.y\n" + //粗糙度
                    //"sub vt1,vc12,vt0\n" + //cos = dot(N,V)
                    //"nrm vt1.xyz,vt1.xyz\n" +
                    //"mov ft1.x,fc7.z\n" + 
                    //"dp3 ft1.y,vi2.xyz,ft3.xyz \n"+
                    //str = SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+ FC + TWO +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. LN;
                    //str += NRM +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. LN;
                    //str += DP3 +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. Y+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempNormal.id + XYZ  +CompileTwo. LN; 
                    var pNodeRoughness;
                    if (inputRoughness.parentNodeItem) {
                        pNodeRoughness = inputRoughness.parentNodeItem.node;
                        if (pNodeRoughness instanceof materialui.NodeTreeFloat) {
                            this.roughness = pNodeRoughness.constValue;
                        }
                        else {
                            this.roughness = 0.5;
                        }
                        str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeRoughness.getComponentID(inputRoughness.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
                        //str += MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempEnvBRDF.id +CompileTwo. X+CompileTwo. COMMA+  pNodeRoughness.getComponentID(inputRoughness.parentNodeItem.id) +CompileTwo. LN;
                        inputRoughness.hasCompiled = true;
                        pNodeRoughness.releaseUse();
                    }
                    else {
                        this.roughness = 0.5;
                        str += CompileTwo.FT + regtempEnvBRDF.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "0.5" + CompileTwo.END + CompileTwo.LN;
                    }
                    // tex envBrdf
                    var regtexEnvBRDF = this.getFragmentTex();
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
                    }
                    else {
                        str += CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "0.5" + CompileTwo.END + CompileTwo.LN;
                    }
                    //trace(str);
                    this.strVec.push(str);
                    //specularIBL prefilteredColor * (SpecularColor * envBrdf.x + envBrdf.y) ;
                    // tex prefilteredColor
                    var regtexIBL = this.getFragmentTex();
                    //reflect(I,N)
                    //"sub vt1,vt0,vc12 \n" + //反射方向  reflect = I - 2 * dot(N,I) * N
                    //"nrm vt1.xyz,vt1.xyz\n" + 
                    //"dp3 ft0.x,vi1.xyz,ft3.xyz \n"+//反射方向  reflect = I - 2 * dot(N,I) * N
                    //	"mul ft0.xyz,ft3.xyz,ft0.x \n" +
                    //	"mul ft0.xyz,ft0.xyz,fc7.y\n" +
                    //	"sub ft0.xyz,vi1.xyz,ft0.xyz\n" +
                    var regtempIBL = this.getFragmentTemp();
                    if (!regtempIBL.hasInit) {
                        str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regtempIBL.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                        regtempIBL.hasInit = true;
                        this.strVec.push(str);
                    }
                    if (this.useDynamicIBL) {
                    }
                    else {
                        //
                        //str = FT + regtempIBL.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. VI+ defaultPtReg.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE + FC + ONE +CompileTwo. XYZ+CompileTwo. END+CompileTwo. LN;
                        str = CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + this.camposStr + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.NRM + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.REFLECT + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.FT + regtempNormal.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                        str += CompileTwo.FT + regtempIBL.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.textureCube + CompileTwo.LEFT_PARENTH + CompileTwo.FS + regtexIBL.id + CompileTwo.COMMA + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                    }
                    //trace(str);
                    //trace(str);
                    this.strVec.push(str);
                    texItem = new TexItem;
                    texItem.id = regtexIBL.id;
                    texItem.type = TexItem.CUBEMAP;
                    this.texVec.push(texItem);
                    //str = FT + regtempIBL.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempIBL.id +CompileTwo. XYZ+CompileTwo. SPACE +  MUL_MATH +CompileTwo. SPACE + FC + ZERO +CompileTwo. X+ END;
                    //strVec.push(str);
                    str = CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempIBL.id + CompileTwo.XYZ + CompileTwo.END;
                    //str = MUL +CompileTwo. SPACE +CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempPbr.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempEnvBRDF.id + XYZ;
                    //trace(str);
                    this.strVec.push(str);
                    regtempIBL.inUse = false;
                    console.log(str);
                }
                regOp = this.getFragmentTemp(); //输出用临时寄存器
                if (!regOp.hasInit) {
                    str = CompileTwo.VEC4 + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.DEFAULT_VEC4 + CompileTwo.END;
                    regOp.hasInit = true;
                    this.strVec.push(str);
                }
                if (this.usePbr) {
                    //diffuseColor = basecolor * (1-metallic) 
                    //f0.xyz = fc0.xyz * 
                    //str = FT + regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. END+CompileTwo. LN;
                    //var regtempMetallic:RegisterItem = getFragmentTemp();
                    //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ FC + ZERO +CompileTwo. X+CompileTwo. LN;
                    if (pNodeMetallic) {
                        str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.LEFT_PARENTH
                            + CompileTwo.ONE_FLOAT + CompileTwo.SUB_MATH + pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id) + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                        //str += SUB +CompileTwo. SPACE +CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+CompileTwo. FT+ regtempMetallic.id +CompileTwo. X+CompileTwo. COMMA+ pNodeMetallic.getComponentID(inputMetallic.parentNodeItem.id);
                        inputMetallic.hasCompiled = true;
                        pNodeMetallic.releaseUse();
                    }
                    else {
                        str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempLightMap.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + "0.5" + CompileTwo.END + CompileTwo.LN;
                    }
                    str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempPbr.id + CompileTwo.XYZ + CompileTwo.END;
                }
                else {
                    //ft2.xyz = ft0.xyz * ft1.xyz
                    //str =  MUL +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeDiffuse.getComponentID(inputDiffuse.parentNodeItem.id) +CompileTwo. COMMA+CompileTwo. FT+ regtempLightMap.id + XYZ;
                    //str = FT + regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempLightMap.id +CompileTwo. XYZ+ END;
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
            if (inputEmissive.parentNodeItem) {
                var pNodeEmissive = inputEmissive.parentNodeItem.node; //emissive输入节点
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
                }
                else {
                    //str =  MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+ pNodeEmissive.getComponentID(inputEmissive.parentNodeItem.id);
                    //op.xyz = ft0.xyz
                    str = CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeEmissive.getComponentID(inputEmissive.parentNodeItem.id) + CompileTwo.END;
                }
                this.strVec.push(str);
                pNodeEmissive.releaseUse();
            }
            //alpha
            str = "";
            var inputAlpha = $node.inputVec[7];
            if (!inputAlpha.parentNodeItem) {
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ FC + ZERO + X;
                //op.w = 1
                str = CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.ONE_FLOAT + CompileTwo.END;
            }
            else {
                var pNodeAlpha = inputAlpha.parentNodeItem.node;
                //str = MOV +CompileTwo. SPACE +CompileTwo. FT+ regOp.id + W +CompileTwo. COMMA+ pNodeAlpha.getComponentID(inputAlpha.parentNodeItem.id);
                //op.w = ft0.w
                str = CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + pNodeAlpha.getComponentID(inputAlpha.parentNodeItem.id) + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.W + CompileTwo.END;
                pNodeAlpha.releaseUse();
            }
            this.strVec.push(str);
            //kill
            str = "";
            var inputKill = $node.inputVec[8];
            if (inputKill.parentNodeItem) {
                var pNodeKill = inputKill.parentNodeItem.node;
                this.killNum = $node.killNum;
                //if(ft0.x < ft1.x){discard;}
                //str = IF +CompileTwo. LEFT_PARENTH+ pNodeKill.getComponentID(inputKill.parentNodeItem.id) + LEFT_BRACKET + FC + ZERO + Z + RIGHT_PARENTH + DISCARD;
                str = CompileTwo.IF + CompileTwo.LEFT_PARENTH + pNodeKill.getComponentID(inputKill.parentNodeItem.id) + CompileTwo.LEFT_BRACKET + this.killStr + CompileTwo.RIGHT_PARENTH + CompileTwo.DISCARD;
                this.strVec.push(str);
                this.useKill = true;
            }
            var regtempFog;
            if (this.fogMode == 1) {
                regtempFog = this.getFragmentTemp();
                // sub ft0.xyz,fc3.xyz,vi4.xyz
                // dp3 ft0.x,ft0.xyz,ft0.xyz;
                // mul ft0.x,ft0.x,fc4.y
                //div ft0.x,fc4.z,ft0.x
                //mul ft0.xyz,fc4.xyz,ft0.x
                //str +=  FT + regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + "distance("  +VI + defaultPtReg.id + XYZ+"*0.01" +CompileTwo. COMMA+ FC + ONE +CompileTwo. XYZ+")*100.0" +CompileTwo. END+CompileTwo. LN;
                str = CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + "distance(" + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.XYZ + "*0.01" + CompileTwo.COMMA + this.camposStr + ")*100.0" + CompileTwo.END + CompileTwo.LN;
                //str += FT + regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE + fogdata +CompileTwo. X+CompileTwo. END+CompileTwo. LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + this.fogdataXStr + CompileTwo.END + CompileTwo.LN;
                //str += FT + regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + fogdata +CompileTwo. Y+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE +CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. END+CompileTwo. LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + this.fogdataYStr + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.TEX_WRAP_CLAMP + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.COMMA + "0.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                //str += FT + regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + MIX + LEFT_PARENTH+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+   fogcolor+CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempFog.id +CompileTwo. X+ RIGHT_PARENTH + END;
                str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.MIX + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.COMMA + this.fogcolorStr + CompileTwo.COMMA + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                this.strVec.push(str);
            }
            else if (this.fogMode == 2) {
                regtempFog = this.getFragmentTemp();
                //				"ft1.x = distance(v1.xyz*0.01, fc2.xyz)*100.0;\n" +
                //				"ft1.x = ft1.x - fogdata.x;\n"+
                //				"ft1.x = fogdata.y * ft1.x;\n" +
                //				"ft1.x = clamp(ft1.x,0.0,1.0);\n"+
                //				"ft2.xyz = mix(ft2.xyz,fogcolor.xyz,ft1.x);\n" +
                //str = FT + regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. VI+ defaultPtReg.id +CompileTwo. Y+CompileTwo. SPACE +CompileTwo. SUB_MATH+CompileTwo. SPACE + fogdata +CompileTwo. X+CompileTwo. END+CompileTwo. LN;
                str = CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.VI + this.defaultPtReg.id + CompileTwo.Y + CompileTwo.SPACE + CompileTwo.SUB_MATH + CompileTwo.SPACE + this.fogdataXStr + CompileTwo.END + CompileTwo.LN;
                //str += FT + regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE +CompileTwo. FT+ regtempFog.id +CompileTwo. X+CompileTwo. SPACE +CompileTwo. MUL_MATH+CompileTwo. SPACE + fogdata +CompileTwo. Y+CompileTwo. END+CompileTwo. LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.MUL_MATH + CompileTwo.SPACE + this.fogdataYStr + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.ADD_MATH + CompileTwo.SPACE + "1.0" + CompileTwo.END + CompileTwo.LN;
                str += CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.TEX_WRAP_CLAMP + CompileTwo.LEFT_PARENTH + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.COMMA + "0.0" + CompileTwo.COMMA + "1.0" + CompileTwo.RIGHT_PARENTH + CompileTwo.END + CompileTwo.LN;
                //str += FT + regOp.id +CompileTwo. XYZ+CompileTwo. SPACE +CompileTwo. EQU+CompileTwo. SPACE + MIX +CompileTwo. LEFT_PARENTH+ fogcolor +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regOp.id +CompileTwo. XYZ+CompileTwo. COMMA+CompileTwo. FT+ regtempFog.id +CompileTwo. X+ RIGHT_PARENTH + END;
                str += CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.MIX + CompileTwo.LEFT_PARENTH + this.fogcolorStr + CompileTwo.COMMA + CompileTwo.FT + regOp.id + CompileTwo.XYZ + CompileTwo.COMMA + CompileTwo.FT + regtempFog.id + CompileTwo.X + CompileTwo.RIGHT_PARENTH + CompileTwo.END;
                this.strVec.push(str);
            }
            str = "";
            //"gl_FragColor = infoUv;\n" +
            str = CompileTwo.FO + CompileTwo.SPACE + CompileTwo.EQU + CompileTwo.SPACE + CompileTwo.FT + regOp.id + CompileTwo.END;
            this.strVec.push(str);
            this.backCull = $node.backCull;
            this.blendMode = $node.blendMode;
            this.writeZbuffer = $node.writeZbuffer;
            this.normalScale = $node.normalScale;
        };
        CompileTwo.prototype.initBaseFc = function () {
            var dataID = 0;
            var $useKill = false;
            var $hasTime = false;
            var $fogMode = 0;
            var $usePbr = false;
            //var $hasFresnel:Boolean = false;
            var $scaleLightMap = false;
            for (var i = this.priorityList.length - 1; i >= 0; i--) {
                var treelist = this.priorityList[i];
                for (var j = 0; j < treelist.length; j++) {
                    var node = treelist[j];
                    if (node.type == materialui.NodeTree.OP) {
                        var opnode = node;
                        $fogMode = opnode.fogMode;
                        $scaleLightMap = opnode.scaleLightMap;
                        if (opnode.inputVec[8].parentNodeItem) {
                            $useKill = true;
                        }
                        var inputMetallic = opnode.inputVec[1];
                        var inputSpecular = opnode.inputVec[2];
                        var inputRoughness = opnode.inputVec[3];
                        if (inputMetallic.parentNodeItem || inputSpecular.parentNodeItem || inputRoughness.parentNodeItem) {
                            $usePbr = true;
                        }
                    }
                    else if (node.type == materialui.NodeTree.TIME || node.type == materialui.NodeTree.PANNER) {
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
        };
        CompileTwo.SPACE = " ";
        CompileTwo.COMMA = ",";
        CompileTwo.END = ";";
        CompileTwo.FC = "fc";
        CompileTwo.FT = "ft";
        CompileTwo.FS = "fs";
        CompileTwo.VI = "v";
        CompileTwo.OP = "op";
        CompileTwo.FO = "gl_FragColor";
        CompileTwo.XYZ = ".xyz";
        CompileTwo.XY = ".xy";
        CompileTwo.X = ".x";
        CompileTwo.Y = ".y";
        CompileTwo.Z = ".z";
        CompileTwo.W = ".w";
        CompileTwo.ZW = ".zw";
        CompileTwo.MOV = "mov";
        //public static ONE:string = "1";
        CompileTwo.ONE_FLOAT = "1.0";
        CompileTwo.ZERO = "[0]";
        CompileTwo.ONE = "[1]";
        CompileTwo.TWO = "[2]";
        CompileTwo.TWO_FLOAT = "2.0";
        CompileTwo.THREE = "3";
        CompileTwo.FOUR = "4";
        CompileTwo.LN = "\n";
        CompileTwo.texType = "<2d,linear,repeat>";
        CompileTwo.TEX_2D = "2d";
        CompileTwo.TEX_CUBE = "cube";
        CompileTwo.TEX_LINEAR = "linear";
        CompileTwo.TEX_NEAREST = "nearest";
        CompileTwo.TEX_WRAP_REPEAT = "repeat";
        CompileTwo.TEX_WRAP_CLAMP = "clamp";
        CompileTwo.LEFT_BRACKET = "<";
        CompileTwo.RIGHT_BRACKET = ">";
        CompileTwo.texCubeType = "<cube,clamp,linear,mipnone>";
        CompileTwo.TEX = "tex";
        CompileTwo.ADD = "add";
        CompileTwo.SUB = "sub";
        CompileTwo.MUL = "mul";
        CompileTwo.DIV = "div";
        CompileTwo.ADD_MATH = "+";
        CompileTwo.SUB_MATH = "-";
        CompileTwo.MUL_MATH = "*";
        CompileTwo.MUL_EQU_MATH = "*=";
        CompileTwo.DIV_MATH = "/";
        CompileTwo.RCP = "rcp";
        CompileTwo.MIN = "min";
        CompileTwo.MAX = "max";
        CompileTwo.FRC = "frc";
        CompileTwo.SQT = "sqt";
        CompileTwo.RSQ = "rsq";
        CompileTwo.POW = "pow";
        CompileTwo.LOG = "log";
        CompileTwo.EXP = "exp";
        CompileTwo.NRM = "normalize";
        CompileTwo.SIN = "sin";
        CompileTwo.COS = "cos";
        CompileTwo.CRS = "crs";
        CompileTwo.DP3 = "dp3";
        CompileTwo.DOT = "dot";
        CompileTwo.DP4 = "dp4";
        CompileTwo.ABS = "abs";
        CompileTwo.NEG = "neg";
        CompileTwo.SAT = "sat";
        CompileTwo.LERP = "lerp";
        CompileTwo.KIL = "kil";
        CompileTwo.M33 = "m33";
        CompileTwo.VEC4 = "vec4";
        CompileTwo.VEC3 = "vec3";
        CompileTwo.VEC2 = "vec2";
        CompileTwo.EQU = "=";
        CompileTwo.texture2D = "texture2D";
        CompileTwo.textureCube = "textureCube";
        CompileTwo.LEFT_PARENTH = "(";
        CompileTwo.RIGHT_PARENTH = ")";
        CompileTwo.DEFAULT_VEC4 = "vec4(0,0,0,1)";
        CompileTwo.MIX = "mix";
        CompileTwo.REFLECT = "reflect";
        CompileTwo.IF = "if";
        CompileTwo.DISCARD = "{discard;}";
        CompileTwo.scalelight = "scalelight";
        return CompileTwo;
    })();
    materialui.CompileTwo = CompileTwo;
})(materialui || (materialui = {}));
//# sourceMappingURL=CompileTwo.js.map