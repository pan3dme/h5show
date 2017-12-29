module testScene {
    export class TestDispStart {

        public init(): void {
            Scene_data.fileRoot = " http://" + document.domain + "/arpg/res/";
            Engine.init(<HTMLCanvasElement>document.getElementById('ArpgStageCanvas'));
            FpsStage.getInstance().init(document.getElementById('FpsTipsCanvas'), document.getElementById('LoadCanvas'));


            Scene_data.focus3D.x = 0;
            Scene_data.focus3D.y = 0;
            Scene_data.focus3D.z = 0;
            Scene_data.focus3D.rotationY = 0;
            Scene_data.focus3D.rotationX = -45
            Scene_data.cam3D.distance = 250;

            this.initSceneView();

            setInterval(() => { this.upFrameData() }, 1000 / 60);


        }
        private initSceneView(): void {
            Engine.initPbr();
            SkillMouseManager.getInstance().addMouseEvent();
            SkillMouseEventModel.getInstance().initSceneFocueEvent();


            SceneManager.getInstance().addDisplay(new ProdkarenModelSprite());
            SceneManager.getInstance().ready = true;

        }
   

        private upFrameData(): void {
            TimeUtil.update();
          
            var istrue: boolean = false
            if (istrue) {
                SceneManager.getInstance().update();
            } else {
                SceneRenderToTextrue.getInstance().renderToTexture()
                if (SceneRenderToTextrue.getInstance().fbo) {
                    BloomRenderModel.getInstance().showTexture(SceneRenderToTextrue.getInstance().fbo.texture)
                }
            }
       
        }
        public resetSize() {
            Engine.resetSize();
        }

    }
}