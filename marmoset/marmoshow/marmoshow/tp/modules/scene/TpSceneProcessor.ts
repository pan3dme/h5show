
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
                this.addGridLineSprite();
           
                //this.makeUrlParamList();
                this.addBaseModel(1000, "pan/marmoset/model/1007.jpg", "pan/marmoset/model/1004.jpg");
          //      this.addBaseModel(1001, "pan/marmoset/model/1003.jpg");
            //    this.addBaseModel(1002, "pan/marmoset/model/1007.jpg");
        
                Scene_data.cam3D.distance = 150;
            }
        }
    }
    private makeUrlParamList(): void
    {
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + "model/ccav.txt", (groupRes: GroupRes) => {
            this.loadPartRes( groupRes )
        })
      
    }
    private addBaseModel($id: number, $baseuv: string, $nrmuv: string): void {
        var $ds: UishaderSprite = new UishaderSprite();
        $ds.loadFileById($id, $baseuv, $nrmuv)
        SceneManager.getInstance().addDisplay($ds);
        $ds.x = 0
        console.log(Scene_data.cam3D.distance)

  
        //var $prodkarenModelSprite: ProdkarenModelSprite = new ProdkarenModelSprite
        //$prodkarenModelSprite.x=-50
        //SceneManager.getInstance().addDisplay($prodkarenModelSprite);
        

    }
    private loadPartRes( groupRes: GroupRes): void {
        for (var i: number = 0; i < groupRes.dataAry.length; i++) {
            var item: GroupItem = groupRes.dataAry[i];
           if (item.types == BaseRes.PREFAB_TYPE) {
                var display: Display3DSprite = new Display3DSprite();
                display.setObjUrl(item.objUrl);
                display.setMaterialUrl(item.materialUrl, item.materialInfoArr);
                SceneManager.getInstance().addSpriteDisplay(display);

      
            }

        }

    }

    



    private addGridLineSprite(): void
    {
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
