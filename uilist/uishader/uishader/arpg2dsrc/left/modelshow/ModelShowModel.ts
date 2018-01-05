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
            Scene_data.cam3D.distance=150
            this.addGridLineSprite();
            TimeUtil.addFrameTick((t: number) => { this.update(t) });

        }
        public _bigPic: UIRenderOnlyPicComponent;
        public update(t): void {

            if (this._bigPic && this._bigPic.textureRes) {
                SceneRenderToTextrue.getInstance().renderToTexture([this.gridLineSprite, this.lightSpriteList]);
                if (SceneRenderToTextrue.getInstance().fbo) {
                    this._bigPic.textureRes.texture = SceneRenderToTextrue.getInstance().fbo.texture;
                }
            }
        }
        private lightSpriteList: MaterialModelSprite
        private gridLineSprite: GridLineSprite
        private addGridLineSprite(): void {
            ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
            this.gridLineSprite = new GridLineSprite();


            this.lightSpriteList = new MaterialModelSprite();
      
        }
        public outShaderStr($str: string): void {
            var $material: Material = this.lightSpriteList.material
    
 
            this.lightSpriteList.material.shader.fragment=  this.lightSpriteList.material.shader.fragment.replace("gl_FragColor = ft2","gl_FragColor =vec4(1.0,1.0,0.0,1.0)")

            this.lightSpriteList.material.shader.encode();
            Scene_data.context3D._contextSetTest.clear()
  
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