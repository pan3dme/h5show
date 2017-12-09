
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
                Scene_data.focus3D.rotationY=0
                Scene_data.light.setData((new Vector3D(0.5, 0.6, 0.7)), new Vector3D(0.8, 0.8, 0.8), new Vector3D(0.2, 0.2, 0.2));
                this.addGridLineSprite();
                var $modelid: string = getUrlParam("modelid")
                if ($modelid) {
                   this.addDirectShadowDisplay3DSprite($modelid);
                } else {
                    window.location.href = "index.html?modelid=40407";
                }
                if (!Scene_data.fbo) {
                    Scene_data.fbo = ShadowModel.getInstance().getFBO();  //512*512
                }
                TimeUtil.addFrameTick(() => { this.upData() });
            }
        }
    }
    private skipNum: number = 0
    private upData(): void {
        ShadowModel.getInstance().sunRotationY++
        ShadowModel.getInstance().updateDepth();
    }

    private addDirectShadowDisplay3DSprite($str:string): void
    {
        var $base: DirectShadowDisplay3DSprite = new DirectShadowDisplay3DSprite()
        $base.setModelById("football");
        $base.y = 40;
        $base.x = 0;
        $base.scaleX = 2
        $base.scaleY =2.01
        $base.scaleZ = 2
        SceneManager.getInstance().addDisplay($base);

        this.addRandom("whitebox")
       // this.addWoodBox("whitebox")
        this.addWhitedrum("whitedrum")
        this.addGroundplant("groundplant")
    }
    private addWoodBox($str: string): void {
        var $base: DirectShadowDisplay3DSprite = new DirectShadowDisplay3DSprite()
        $base.setModelById($str);
        $base.y = 10;
        $base.z = 0
        $base.x = -50;
        $base.scaleX = 2
        $base.scaleY = 2
        $base.scaleZ = 2
        SceneManager.getInstance().addDisplay($base);

    }
    private addWhitedrum($str: string): void {
        var $base: DirectShadowDisplay3DSprite = new DirectShadowDisplay3DSprite()
        $base.setModelById($str);
        $base.y = 10;
        $base.z = -25;
        $base.x = 12;
        $base.scaleX = 1
        $base.scaleY = 3
        $base.scaleZ = 1
        SceneManager.getInstance().addDisplay($base);

    }
    private addRandom($str: string): void
    {
        for (var i: number = 0; i < 10; i++) {
            var $base: DirectShadowDisplay3DSprite = new DirectShadowDisplay3DSprite()
            $base.setModelById($str);
        
            var $pos: Vector3D = new Vector3D(50, 0, 0);
            var $m: Matrix3D = new Matrix3D();
            $m.appendRotation(360 / 10 * i, Vector3D.Y_AXIS);
            $pos=$m.transformVector($pos);

            $base.x = $pos.x
            $base.z = $pos.z
            $base.rotationY = 360 / 10 * i
            $base.rotationX = 0
            $base.rotationZ = 360 / 10 * i

            $base.scaleX =2
            $base.scaleY = $base.scaleX
            $base.scaleZ = $base.scaleX

            $base.y = 10
            SceneManager.getInstance().addDisplay($base);
        }
    }
    private addGroundplant($str: string): void {
        var $base: DirectShadowDisplay3DSprite = new DirectShadowDisplay3DSprite()
        $base.setModelById($str);
        $base.y = 1;
        $base.x = 0;
        $base.scaleX = 10;
        $base.scaleY = 1;
        $base.scaleZ = 10;
        SceneManager.getInstance().addDisplay($base);
    }


    private addGridLineSprite(): void
    {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite: GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
       // SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;



    }

    protected listenModuleEvents(): Array<BaseEvent> {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    }
}
