
class TpSceneModule extends Module {
    public getModuleName(): string {
        return "TpSceneModule";
    }
    protected listProcessors(): Array<Processor> {
        return [new TpSceneProcessor()];
    }
}
class TpSceneEvent extends BaseEvent {
    //展示面板
    public static SHOW_TP_SCENE_EVENT: string = "SHOW_TP_SCENE_EVENT";
    public static ENTER_SCENE_EVENT: string = "ENTER_SCENE_EVENT";

    public mapId: number

}
class TpSceneProcessor extends BaseProcessor {

    public constructor() {
        super();
    }
    public getName(): string {
        return "TpSceneProcessor";
    }
    protected receivedModuleEvent($event: BaseEvent): void {
        if ($event instanceof TpSceneEvent) {
            var $tpMenuEvent: TpSceneEvent = <TpSceneEvent>$event;
            if ($tpMenuEvent.type == TpSceneEvent.SHOW_TP_SCENE_EVENT) {

                Scene_data.cam3D.distance = 200
                Scene_data.focus3D.rotationY =90
                Scene_data.light.setData((new Vector3D(0.5, 0.6, 0.7)), new Vector3D(0.8, 0.8, 0.8), new Vector3D(0.2, 0.2, 0.2));
                this.addGridLineSprite();
                var $modelid: string = getUrlParam("name");
                //$modelid ="frame3d.txt"
                if ($modelid) {
                   
                    this._frame3dRes = new Frame3dRes();
                    this._frame3dRes.load(Scene_data.fileRoot + "pan/frame3dres/" + $modelid + ".txt", () => this.loadFrame3DFinish());
                    TimeUtil.addFrameTick(() => { this.upData() });
                } else {
                    window.location.href = "index.html?name=huowumatou_frame";
                }
            }
        }
    }

    private frameImodelItem: Array<FrameFileNode>
    private loadFrame3DFinish(): void {
        DirectShadowDisplay3DSprite.showWhiteTexture = false
        this.frameImodelItem = new Array();
        for (var i: number = 0; i < this._frame3dRes.frameItem.length; i++) {
            var $base: FrameFileNode = new FrameFileNode();
            $base.setFrameNodeVo(this._frame3dRes.frameItem[i]);
            this.frameImodelItem.push($base);
        }

        if (this._frame3dRes.haveVideo) {
            var $modelid: string = getUrlParam("name");
            this.createVideo($modelid);
        }
    }
    private _frame3dRes: Frame3dRes;
    private skipNum: number = 0;

    private upData(): void {

        if (!Scene_data.fbo) {
            Scene_data.fbo = ShadowModel.getInstance().getFBO();  //512*512
        }
        if (this._frame3dRes.haveVideo&&this.haveVidoe) {
            Frame3dRes.frameNum = Math.floor(LightBmpModel.getInstance().videoElem.currentTime * 36);
        } else {
            this.mathTimeFrame()
        }
        for (var i: number = 0; this.frameImodelItem && i < this.frameImodelItem.length; i++) {
            this.frameImodelItem[i].update()
        }
        if (this._frame3dRes.haveVideo && this.haveVidoe) {
            LightBmpModel.getInstance().upLightTexture(this.frameImodelItem);
        }

        Scene_data.context3D.setDepthTest(true);
        Scene_data.context3D.update();
        ShadowModel.getInstance().updateDepth();
        SceneManager.getInstance().update();
        Scene_data.context3D.setWriteDepth(true);

    }
    private lastTime: number = 0
    private mathTimeFrame(): void
    {
        if (isNaN(Frame3dRes.frameNum)) {
            Frame3dRes.frameNum = 0;
        }
        var dt: number = TimeUtil.getTimer() - this.lastTime;
        Frame3dRes.frameNum += dt / (1000 / Frame3dRes.frameSpeedNum);
        Frame3dRes.frameNum = Frame3dRes.frameNum % (FrameLinePointVo.maxTime-1);
        this.lastTime = TimeUtil.getTimer();
    }
    private haveVidoe:boolean=true
    private createVideo($modelid: string): void {
        LightBmpModel.getInstance().videoElem = document.createElement("video");//创建video
        LightBmpModel.getInstance().videoElem.setAttribute('src', Scene_data.fileRoot + "pan/frame3dres/mp4/" + $modelid + ".mp4");
        LightBmpModel.getInstance().videoElem.autoplay = true;
        LightBmpModel.getInstance().videoElem.loop = true;

        LightBmpModel.getInstance().videoElem.addEventListener("error",()=> {
            console.log("没有视屏");
            this.haveVidoe = false
         
        })
    } 
    private addGridLineSprite(): void {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite: GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
      //  SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;
    }
    protected listenModuleEvents(): Array<BaseEvent> {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    }
}
