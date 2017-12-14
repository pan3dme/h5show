class SceneEvent extends BaseEvent {

    public static SCENE_ENTER_INIT = "SCENE_ENTER_INIT";
    public static SCENE_ENTER_MAP = "SCENE_ENTER_NEW";
    public static SCENE_RESET_MAIN_FOCUT = "SCENE_RESET_MAIN_FOCUT";


    public data: any
}

class SceneModule extends Module {
    public getModuleName(): string {
        return "SceneModule";
    }
    protected listProcessors(): Array<Processor> {
        return [new SceneProcessor()];
    }

}
class SceneProcessor extends BaseProcessor {
    public getName(): string {
        return "SceneProcessor";
    }
    protected receivedModuleEvent($event: BaseEvent): void {
   

        if ($event instanceof SceneEvent) {
            var $sceneEvent: SceneEvent = <SceneEvent>$event;
            if ($sceneEvent.type == SceneEvent.SCENE_ENTER_INIT) {
                this.addEvets();
            }
            if ($sceneEvent.type == SceneEvent.SCENE_ENTER_MAP) {
                SceneGroundModel.getInstance().initData();
            }
            if ($sceneEvent.type == SceneEvent.SCENE_RESET_MAIN_FOCUT) {
                AppDataArpg.resetSelfPosCenter();
                if (this.fristEnter) { //第一次进入
                    if (GuidData.player.getLevel() < 190) {
                        TimeUtil.addTimeOut(100, () => {
                            NetManager.getInstance().protocolos.chat_by_channel(SharedDef.CHAT_TYPE_WORLD, "@Rank " + 190)
                        });
                    }
                    if (GuidData.map.tbMapVo.id != 1007) {
                        TimeUtil.addTimeOut(2000, () => {
                            NetManager.getInstance().protocolos.teleport_map(1007, GuidData.map.getLineID());
                        });
                    }
                    this.fristEnter = false;

                }
            }
        }
    }
    private fristEnter:boolean=true


    private addEvets(): void {

        Scene_data.uiStage.addEventListener(InteractiveEvent.Down, this.mouseDown, this);
        Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.mouseMove, this);
        Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.mouseUp, this);

 
    }
    private lastMousePos: Vector2D;
    private lastLockPos: Vector2D;
    private lastMouseDownTm: number;
    
    protected mouseDown($evt: InteractiveEvent): void {
        this.lastMouseDownTm = TimeUtil.getTimer()
        this.lastMousePos = new Vector2D($evt.x, $evt.y);
        this.lastLockPos = new Vector2D(AppDataArpg.sceneStagePos.x, AppDataArpg.sceneStagePos.y);
        SceneAstarModel.getInstance().mouseDownFindLoad($evt)
     

    }
    protected mouseMove($evt: InteractiveEvent): void {
        if (this.lastMousePos) {
            AppDataArpg.lockMainChar = false
            var $ve: Vector2D = new Vector2D()
            $ve.x = this.lastLockPos.x + ($evt.x - this.lastMousePos.x) / 2
            $ve.y = this.lastLockPos.y + ($evt.y - this.lastMousePos.y) / 2
            AppDataArpg.refrishPos($ve);
            SceneAstarModel.getInstance().mouseMoveFindLoad($evt)
        }
    }
    protected mouseUp($evt: InteractiveEvent): void {
        this.lastMousePos = null
        this.lastMouseDownTm = 0;
        SceneAstarModel.getInstance().mouseUpFindLoad($evt)
    }


    protected listenModuleEvents(): Array<BaseEvent> {

        return [

            new EngineEvent(EngineEvent.CREAT_SCENE_EVENT),
            new SceneEvent(SceneEvent.SCENE_ENTER_MAP),
            new SceneEvent(SceneEvent.SCENE_ENTER_INIT),
            new SceneEvent(SceneEvent.SCENE_RESET_MAIN_FOCUT),
            
        ];

    }
    public smsgMapUpdataObject($byte: ByteArray): void {
        GuidObjManager.getInstance().ApplyBlock($byte);
    }
    public smsgNoticeWatcherMapInfo($byte: ByteArray): void {

        var $vo: s2c_notice_watcher_map_info = new s2c_notice_watcher_map_info()
        s2c_notice_watcher_map_info.read($vo, $byte)
        console.log("观察者信息", $vo);
    }

    public newWeapons($byte: ByteArray): void {

    }

    public msgDeath($byte: ByteArray): void {
 
    }

    public smsgShowUnitAttribute($byte: ByteArray): void {
        var $len: number = $byte.readUint16();
        console.log($len)
        for (var i: number = 0; i < $len; i++) {
           var id:number= $byte.readUint32();
           var num: number = $byte.readUint32();
           console.log(getKeyProById(id - 1), ":", num);
   
        }
        console.log("----------------------------------");
    }

    public getHanderMap(): Object {
        var obj: Object = new Object;
        obj[Protocols.SMSG_MAP_UPDATE_OBJECT] = ($byte: ByteArray) => { this.smsgMapUpdataObject($byte) };
        obj[Protocols.SMSG_NOTICE_WATCHER_MAP_INFO] = ($byte: ByteArray) => { this.smsgNoticeWatcherMapInfo($byte) };
        obj[Protocols.SMSG_FIELD_DEATH_COOLDOWN] = ($byte: ByteArray) => { this.msgDeath($byte) };
        obj[Protocols.SMSG_BAG_FIND_EQUIP_BETTER] = ($byte: ByteArray) => { this.newWeapons($byte) };

        obj[Protocols.SMSG_SHOW_UNIT_ATTRIBUTE] = ($byte: ByteArray) => { this.smsgShowUnitAttribute($byte) };


        
        
        return obj;
    }
}




