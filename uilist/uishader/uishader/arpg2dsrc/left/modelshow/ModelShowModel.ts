module left {

    export class ModelShowModel {
        private static _instance: ModelShowModel;
        public static getInstance(): ModelShowModel {
            if (!this._instance) {
                this._instance = new ModelShowModel();
            }
            return this._instance;
        }
        public addBaseModel(): void {
            Scene_data.cam3D.distance = 150
            this.addGridLineSprite();
            TimeUtil.addFrameTick((t: number) => { this.update(t) });

        }
        public _bigPic: UIRenderOnlyPicComponent;
        public update(t): void {

            if (this._bigPic && this._bigPic.textureRes) {
                SceneRenderToTextrue.getInstance().renderToTexture([this.lightSpriteList]);
                if (SceneRenderToTextrue.getInstance().fbo) {
                    this._bigPic.textureRes.texture = SceneRenderToTextrue.getInstance().fbo.texture;
                }
            }
        }
        public lightSpriteList: MaterialModelSprite
        private gridLineSprite: GridLineSprite
        private addGridLineSprite(): void {
            ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
            this.gridLineSprite = new GridLineSprite();
            this.lightSpriteList = new MaterialModelSprite();
        }
        private skipNum: number=0
        public outShaderStr($treeMater: materialui.MaterialTree): void {

            var $str: string = $treeMater.shaderStr;
       
            var $material: Material = this.lightSpriteList.material;
            var $buildMaterialShader: BuildMaterialShader = new BuildMaterialShader();
            $buildMaterialShader.buildParamAry($treeMater);

            $buildMaterialShader.vertex = $buildMaterialShader.getVertexShaderString();
            $buildMaterialShader.fragment = $str;

          //  console.log($buildMaterialShader.vertex);
          //  console.log("-----------")
           // console.log($buildMaterialShader.fragment);
            console.log("+++++++++++++", this.skipNum++)

            $buildMaterialShader.encode();
 
            this.lightSpriteList.material.shader = $buildMaterialShader;
            this.lightSpriteList.material.program = $buildMaterialShader.program;
            this.lightSpriteList.material.fcData = $treeMater.fcData;

            this.lightSpriteList.material.texList = $treeMater.texList;
            this.lightSpriteList.material.usePbr = $treeMater.usePbr;
            this.lightSpriteList.material.hasTime = $treeMater.hasTime;
            this.lightSpriteList.material.hasVertexColor = $treeMater.hasVertexColor;
            this.lightSpriteList.material.usePbr = $treeMater.usePbr;
            this.lightSpriteList.material.useNormal = $treeMater.useNormal;
            this.lightSpriteList.material.roughness = $treeMater.roughness;
            this.lightSpriteList.material.hasFresnel = $treeMater.hasFresnel;
            this.lightSpriteList.material.useDynamicIBL = $treeMater.useDynamicIBL;
            this.lightSpriteList.material.lightProbe = $treeMater.lightProbe;
            this.lightSpriteList.material.useKill = $treeMater.useKill;
            this.lightSpriteList.material.directLight = $treeMater.directLight;
            this.lightSpriteList.material.noLight = $treeMater.noLight;
            this.lightSpriteList.material.fogMode = $treeMater.fogMode;
            this.lightSpriteList.material.scaleLightMap = $treeMater.scaleLightMap;

            console.log($treeMater.fcData)


        }


        public getMaterialProgram(key: String, shaderCls: any, $material: Material, paramAry: any = null, parmaByFragmet: boolean = false): Shader3D {
            var keyStr: string = key + "_" + $material.url;
            if (paramAry) {
                for (var i: number = 0; i < paramAry.length; i++) {
                    keyStr += "_" + paramAry[i];
                }
                if (parmaByFragmet) {
                    keyStr += "true_";
                } else {
                    keyStr += "false_";
                }
            }
            if (parmaByFragmet) {
                paramAry = [$material.usePbr, $material.useNormal, $material.hasFresnel,
                $material.useDynamicIBL, $material.lightProbe, $material.directLight,
                $material.noLight, $material.fogMode];
            }

            var shader: Shader3D = new MaterialShader();
            shader.paramAry = paramAry;
            shader.fragment = $material.shaderStr;
            var encodetf: boolean = shader.encode();
            shader.useNum++;
            return shader;
        }

    }
}