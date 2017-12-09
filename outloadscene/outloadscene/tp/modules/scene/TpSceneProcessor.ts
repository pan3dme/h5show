
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
                FBO.fw = 1024;
                FBO.fh = 1024;
                this.loadScene();
                TimeUtil.addFrameTick(() => { this.updata() });

                SceneManager.getInstance().ready = true;
            }
        }
    }
    private loadScene(): void
    {
        Scene_data.cam3D.distance = 150
        ResManager.getInstance().loadSceneRes("outlinescene", this.completeFun, this.progressFun, ($str: any) => {
            this.loadSceneConfigCom($str);
        });
    }
    public completeFun(): void {
    }
    public progressFun(obj: any): void {
    }
    public loadSceneConfigCom(obj: any): void {
        var buildAry: Array<any> = obj.buildItem;
        for (var i: number = 0; i < buildAry.length; i++) {
            var itemObj: any = buildAry[i];
            if (itemObj.type == BaseRes.PREFAB_TYPE) {
                var itemDisplay: OutLineSprite = this.getBuildSprite(itemObj);
                SceneManager.getInstance().addDisplay(itemDisplay);
            }
        }

    }
    private getBuildSprite(itemObj: any): OutLineSprite {
        var itemDisplay: OutLineSprite = new OutLineSprite();
        itemDisplay.setObjUrl(itemObj.objsurl);
        itemDisplay.setLightMapUrl(itemObj.lighturl);

    
        itemDisplay.scaleX = itemObj.scaleX;
        itemDisplay.scaleY = itemObj.scaleY;
        itemDisplay.scaleZ = itemObj.scaleZ;

        itemDisplay.x = itemObj.x;
        itemDisplay.y = itemObj.y;
        itemDisplay.z = itemObj.z;

        itemDisplay.rotationX = itemObj.rotationX;
        itemDisplay.rotationY = itemObj.rotationY;
        itemDisplay.rotationZ = itemObj.rotationZ;


        itemDisplay.type = 0;
        itemDisplay.id = itemObj.id;

        console.log(itemDisplay.id)
        switch (itemDisplay.id) {
            case 3:
                itemDisplay.uvscaleData = [6, 6]
                break
            case 4:
                itemDisplay.uvscaleData = [4, 4]
                break
            case 6:
            case 7:
                itemDisplay.uvscaleData = [4, 4]
                break
            default:
                break
        }
    

        return itemDisplay;
    }


    public updata(): void
    {
      
        OutNrmTextureModel.getInstance().renderNrm()
        OutDephtTextureModel.getInstance().renderNrm()
        ExpBakedModel.getInstance().renderBacked();
        ExpNrmAndDephtModel.getInstance().expNrmDepht(OutNrmTextureModel.getInstance().fbo.texture, OutDephtTextureModel.getInstance().fbo.texture, ExpBakedModel.getInstance().fbo.texture)
    }
  



    protected listenModuleEvents(): Array<BaseEvent> {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    }
}
