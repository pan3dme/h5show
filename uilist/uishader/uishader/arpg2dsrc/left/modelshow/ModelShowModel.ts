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
     
    }
}