
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
                FBO.fw = 1024;
                FBO.fh = 1024;
        
                this.addGridLineSprite();
                this.makeMainChar()
             //  this.addModel();
              //  this.loadScene();
                this.outTextureSprite = new OutTextureSprite()
                TimeUtil.addFrameTick(() => { this.updata() });
            }
        }
    }
    private cartoonCharItem: Array<CartoonChar>
    private makeMainChar(): void {

        this.cartoonCharItem = new Array;
        Scene_data.cam3D.distance = 150;
        for (var i: number = 0; i < 10; i++) {
            var $sc: CartoonChar = new CartoonChar();
            $sc.x = random(200) - 100
            $sc.z = random(200) - 100
            $sc.rotationY=random(360)
            $sc.scale=0.3+Math.random()*0.3
            $sc.setRoleUrl(getRoleUIUrl("5101"));
            SceneManager.getInstance().addMovieDisplay($sc);
            this.cartoonCharItem.push($sc)
        }


    }

    private loadScene(): void {

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
                var itemDisplay: CartoonDisplay3dSprite = this.getBuildSprite(itemObj);
                SceneManager.getInstance().addDisplay(itemDisplay);
            }
        }

    }
    private getBuildSprite(itemObj: any): CartoonDisplay3dSprite {
        var itemDisplay: CartoonDisplay3dSprite = new CartoonDisplay3dSprite();
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

        switch (itemDisplay.id) {
            case 4:
               // itemDisplay.Factor = 0.9
                itemDisplay.Outline = 0.1
                break
            case 6:
            case 7:
                itemDisplay.Factor = 0.9
                itemDisplay.Outline = 2
                break
            default:
                break;
        }


        return itemDisplay;
    }


    private outTextureSprite: OutTextureSprite
    public updata(): void
    {
        //this.mainChar.rotationY++
        SceneManager.getInstance().update();

        for (var j: number = 0; j < SceneManager.getInstance().displayList.length; j++) {
            var $display3d: Display3D = SceneManager.getInstance().displayList[j];
            if ($display3d.sceneVisible) {
                if ($display3d instanceof CartoonDisplay3dSprite) {
                    var $oso: CartoonDisplay3dSprite = <CartoonDisplay3dSprite>$display3d
                    $oso.updateCortoon()
                }
            }
        }
        for (var i: number = 0; i < this.cartoonCharItem.length; i++) {
            this.cartoonCharItem[i].updateCortoon()
        }

    //    OutLineTextureModel.getInstance().renderNrm()
    //    this.outTextureSprite.showTexture(OutLineTextureModel.getInstance().fbo.texture)

     }

    private addModel(): void
    {
        Scene_data.cam3D.distance = 150
        //Scene_data.focus3D.rotationX = 0
        Scene_data.focus3D.rotationY = 0



        var $b: CartoonPerfab = new CartoonPerfab()
        $b.setPerfabName("hptree")
        $b.x = +50
        $b.scale = 0.1
        $b.Factor = 0.9
        $b.Outline = 2
        SceneManager.getInstance().addDisplay($b);

         var $a: CartoonPerfab = new CartoonPerfab()
         $a.setPerfabName("hpball")
         $a.x = -50
         $a.scale = 0.5
        SceneManager.getInstance().addDisplay($a);


        //var $a: CartoonPerfab = new CartoonPerfab()
        //$a.setPerfabName("hpball")
        //$a.x = 40
        //SceneManager.getInstance().addDisplay($a);
        //var $c: CartoonPerfab = new CartoonPerfab()
        //$c.setPerfabName("hpbox")
        //$c.x = -40
        //SceneManager.getInstance().addDisplay($c);

        //$a.rotationY = random(360)
        //$b.rotationY = random(360)
        //$c.rotationY = random(360)
        //$a.rotationX = random(360)
        //$b.rotationX = random(360)
        //$c.rotationX = random(360)

    }
  
   
    private addGridLineSprite(): void
    {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite: GridLineSprite = new GridLineSprite();
        $GridLineSprite.y = 0;
        SceneManager.getInstance().addDisplay($GridLineSprite);
        SceneManager.getInstance().ready = true;
        Scene_data.camFar=2000
    }

    protected listenModuleEvents(): Array<BaseEvent> {
        return [
            new TpSceneEvent(TpSceneEvent.SHOW_TP_SCENE_EVENT),
        ];
    }
}
