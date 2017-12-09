
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
                Scene_data.fileRoot="res/"
                this.addGridLineSprite();
                this.addModel()
                this.outTextureSprite = new OutTextureSprite()
                TimeUtil.addFrameTick(() => { this.updata() });
            }
        }
    }
    private outTextureSprite: OutTextureSprite
    public updata(): void
    {
       // SceneManager.getInstance().update();
        OutNrmTextureModel.getInstance().renderNrm()
        OutDephtTextureModel.getInstance().renderNrm()
        ExpBakedModel.getInstance().renderBacked();
        //this.outTextureSprite.showTexture(ExpBakedModel.getInstance().fbo.texture)
        ExpNrmAndDephtModel.getInstance().expNrmDepht(OutNrmTextureModel.getInstance().fbo.texture, OutDephtTextureModel.getInstance().fbo.texture, ExpBakedModel.getInstance().fbo.texture)
    }
    private outLinePerfab: OutLinePerfab
    private addModel(): void
    {
        Scene_data.cam3D.distance = 150

        this.outLinePerfab = new OutLinePerfab()
        this.outLinePerfab.setPerfabName("hpplant")
        this.outLinePerfab.scale = 15
        this.outLinePerfab.uvscaleData = [5,   5];
        SceneManager.getInstance().addDisplay(this.outLinePerfab);

        for (var i: number = 0; i < 7; i++) {
            var $A = new OutLinePerfab()
            $A.setPerfabName("hpbox")
            $A.x = 50 - i * 20
            $A.y=5
            $A.rotationY = i * (360 / 5)
            $A.rotationX = random(360)
            $A.rotationZ = random(360)
            $A.rotationY = random(360)
            $A.scale = 0.5
            $A.uvscaleData = [1, 1];
       
            SceneManager.getInstance().addDisplay($A);
        }
        var $B = new OutLinePerfab();

        $B.setPerfabName("hptree")
        $B.y = 0
        $B.z = 30
        $B.scale = 0.1
        $B.uvscaleData = [2, 2];
        SceneManager.getInstance().addDisplay($B);

    }
    private addGridLineSprite(): void
    {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite: GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;
    }

    protected listenModuleEvents(): Array<BaseEvent> {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    }
}
