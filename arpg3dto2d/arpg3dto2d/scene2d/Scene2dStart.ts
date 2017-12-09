module scene2d {
    export class Scene2dStart {

        public init(): void {
            Scene_data.fileRoot = " http://" + document.domain + "/arpg/res/";
            Engine.init(<HTMLCanvasElement>document.getElementById('ArpgStageCanvas'));
            FpsStage.getInstance().init(document.getElementById('FpsTipsCanvas'), document.getElementById('LoadCanvas'));

            Engine2d.init(); //初始2D引擎
            this.initSceneView();
            setInterval(() => { this.upFrameData() }, 1000 / 60);

           
        }
        private initSceneView(): void {




            SceneLinkEventModel.getInstance().addEvets();  //添加事件
            LinkScene2DManager.getInstance().loadMapById(1007)  //加载地图
     
        }
        private upFrameData(): void {
            Engine.update();
            if (AppDataArpg.lockMainChar) {
                AppDataArpg.resetSelfPosCenter();
            }
        }
        public resetSize() {
            Engine.resetSize();
        }
      
    }
}