module testScene {
    export class TestDispStart {

        public init(): void {
            Scene_data.fileRoot = " http://" + document.domain + "/arpg/res/";
            Engine.init(<HTMLCanvasElement>document.getElementById('ArpgStageCanvas'));
            FpsStage.getInstance().init(document.getElementById('FpsTipsCanvas'), document.getElementById('LoadCanvas'));


            Scene_data.focus3D.x = 0;
            Scene_data.focus3D.y = 0;
            Scene_data.focus3D.z = 0;
            Scene_data.focus3D.rotationY = 125;
            Scene_data.focus3D.rotationX = -45
            Scene_data.cam3D.distance = 150;

            this.initSceneView();

            setInterval(() => { this.upFrameData() }, 1000 / 60);


        }
        private initSceneView(): void {
            Engine.initPbr();
            GameMouseManager.getInstance().addMouseEvent();
            SceneMouseEventModel.getInstance().initSceneFocueEvent();

            SceneManager.getInstance().ready = true;


            this.addBaseModel(1000, "pan/marmoset/model/1007.jpg", "pan/marmoset/model/1004.jpg", ["pan/marmoset/model/1005.jpg", "pan/marmoset/model/1009.jpg"]);
            this.addBaseModel(1001, "pan/marmoset/model/1003.jpg", "pan/marmoset/model/1006.jpg", ["pan/marmoset/model/1001.jpg", "pan/marmoset/model/1008.jpg"]);

        }
        private addBaseModel($id: number, $baseuv: string, $nrmuv: string, alphajpg: Array<string>): void {
            var $ds: UishaderSprite = new UishaderSprite();
            $ds.loadFileById($id, $baseuv, $nrmuv, alphajpg)
            SceneManager.getInstance().addDisplay($ds);

        }


        private upFrameData(): void {
            TimeUtil.update();
            FpsMc.update();
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