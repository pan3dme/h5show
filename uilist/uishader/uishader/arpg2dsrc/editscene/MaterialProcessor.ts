module materialui {
    export class MaterialEvent extends BaseEvent {
        public static SHOW_MATERIA_PANEL: string = "INIT_MATERIA_PANEL"; //
        public static SAVE_MATERIA_PANEL: string = "SAVE_MATERIA_PANEL"; //
        public static SELECT_MATERIAL_NODE_UI: string = "SELECT_MATERIAL_NODE_UI"; //
        public static COMPILE_MATERIAL: string = "COMPILE_MATERIAL"; //
        public static SCENE_UI_TRUE_MOVE: string = "SCENE_UI_TRUE_MOVE"; //
        public static INUPT_NEW_MATERIAL_FILE: string = "CLEAR_MATERIAL_ALL_UI"; //
        public nodeUi: BaseMaterialNodeUI
        public v2d: Vector2D
        public materailTree: MaterialTree

    }
    export class MaterialModule extends Module {
        public getModuleName(): string {
            return "MaterialModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new MaterialProcessor()];
        }
    }

    export class MaterialProcessor extends BaseProcessor {
        public getName(): string {
            return "MaterialProcessor";
        }

        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof MaterialEvent) {
                var $materialEvent: MaterialEvent = <MaterialEvent>$event;
                if ($materialEvent.type == MaterialEvent.SHOW_MATERIA_PANEL) {
                    this.openMaterialPanel()
                }
                if ($materialEvent.type == MaterialEvent.SAVE_MATERIA_PANEL) {
                    this.saveMateriaPanel()
                }
                
                if ($materialEvent.type == MaterialEvent.SELECT_MATERIAL_NODE_UI) {
                    this.selectNodeUi($materialEvent.nodeUi)
                }
                if ($materialEvent.type == MaterialEvent.COMPILE_MATERIAL) {
                    MaterialCompile.getInstance().compile(MaterialCtrl.getInstance().nodeList, this.baseMaterialTree)
                }
                if ($materialEvent.type == MaterialEvent.SCENE_UI_TRUE_MOVE) {
                    this.stageMoveTx($materialEvent.v2d)
                }
                if ($materialEvent.type == MaterialEvent.INUPT_NEW_MATERIAL_FILE) {
                    this.clearAllMaterialUi($materialEvent.materailTree);
                }

                
            }
            if ($event instanceof MEvent_Material_Connect) {

                var $mevent_Material_Connect: MEvent_Material_Connect = <MEvent_Material_Connect>$event;
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG) {
                    this.startDragLine($mevent_Material_Connect.itemNode);
                }
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG) {
                    this.stopDragLine($mevent_Material_Connect.itemNode);
                }
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE) {
                    this.removeLine($mevent_Material_Connect.line);
                }
                if ($mevent_Material_Connect.type == MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE) {
        
                    this.setConnetLine($mevent_Material_Connect.startNode, $mevent_Material_Connect.endNode);
                }


            }
     

        }
        private clearAllMaterialUi($materailTree: MaterialTree): void {
            var $len: number = UIManager.getInstance()._containerList.length
            for (var i: number = ($len-1); i >=0; i--) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($temp.name) {
                    this.delUI($temp);
                }
            }
            MaterialCtrl.getInstance().initData();
            this.baseMaterialTree = $materailTree;
            MaterialViewBuildUtils.getInstance().setData($materailTree.data);
     
        }
        public  setConnetLine($startItem: ItemMaterialUI, $endItem: ItemMaterialUI):void {
            this.lineContainer.addConnentLine($startItem, $endItem);

        }
        private  _materialTree: MaterialTree;
        private saveMateriaPanel(): void {
            this._materialTree = new MaterialTree()
            this._materialTree.data= MaterialCtrl.getInstance().getObj()
            console.log(this._materialTree.data)
        }
      
        private selectNodeUi($nodeUi: BaseMaterialNodeUI): void {
       
            for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($temp) {
                    $temp.select = Boolean($nodeUi == $temp);
                }
            
            }
        }
  
        public  removeLine($line:MaterialNodeLineUI):void{
            this.lineContainer.removeLine($line);
        }
        public  startDragLine($node:ItemMaterialUI):void{
            this.lineContainer.startLine($node);
        }

        public  stopDragLine($node: ItemMaterialUI): void {
            this.lineContainer.stopLine($node);
        }


        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new MaterialEvent(MaterialEvent.SHOW_MATERIA_PANEL),
                new MaterialEvent(MaterialEvent.SELECT_MATERIAL_NODE_UI),
                new MaterialEvent(MaterialEvent.SAVE_MATERIA_PANEL),
                new MaterialEvent(MaterialEvent.COMPILE_MATERIAL),
                new MaterialEvent(MaterialEvent.SCENE_UI_TRUE_MOVE),
                new MaterialEvent(MaterialEvent.INUPT_NEW_MATERIAL_FILE),
                
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG),
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG),
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE),
                new MEvent_Material_Connect(MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE),

            ];
        }
        private openMaterialPanel(): void
        {
            Arpg2dGameStart.stagePos = new Vector2D()
            BaseMaterialNodeUI.baseUIAtlas = new UIAtlas()
            BaseMaterialNodeUI.baseUIAtlas.setInfo("pan/marmoset/uilist/baseui.xml", "pan/marmoset/uilist/baseui.png", () => { this.loadConfigCom() });
    

        }
        private lineContainer: MaterialLineContainer
        private loadConfigCom(): void {

            this.lineContainer = new MaterialLineContainer()
            UIManager.getInstance().addUIContainer(this.lineContainer);

            this.readMaterialTree()

            document.addEventListener(MouseType.MouseWheel, ($evt: MouseWheelEvent) => { this.onMouseWheel($evt) });
            document.addEventListener(MouseType.MouseDown, ($evt: MouseEvent) => { this.onMouse($evt) });
            document.addEventListener(MouseType.MouseMove, ($evt: MouseEvent) => { this.onMouseMove($evt) });
            document.addEventListener(MouseType.MouseUp, ($evt: MouseEvent) => { this.onMouseUp($evt) });

            document.addEventListener(MouseType.KeyDown, ($evt: KeyboardEvent) => { this.onKeyDown($evt) })
            document.addEventListener(MouseType.KeyUp, ($evt: KeyboardEvent) => { this.onKeyUp($evt) })
           
            document.addEventListener("contextmenu", (event: any) => {
                event.preventDefault();
                var $rightMenuEvet: RightMenuEvent = new RightMenuEvent(RightMenuEvent.SHOW_RIGHT_MENU);
                $rightMenuEvet.posv2d = new Vector2D(event.clientX, event.clientY)
                ModuleEventManager.dispatchEvent($rightMenuEvet);

            });

          
        }
        private baseMaterialTree: MaterialTree
        private readMaterialTree(): void {
            var $url: string = "pan/marmoset/uilist/feijinrm.txt";
            MaterialTreeManager.getInstance().getMaterial($url, ($materialTree: MaterialTree) => {
                this.baseMaterialTree = $materialTree
                MaterialViewBuildUtils.getInstance().addFun = (ui: BaseMaterialNodeUI) => { MaterialCtrl.getInstance().addNodeUI(ui)};
                MaterialViewBuildUtils.getInstance().setData($materialTree.data)
                ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
            });

        }
       


        public onKeyDown($evt: KeyboardEvent): void {
            Arpg2dGameStart.altKey = $evt.altKey
            switch ($evt.keyCode) {
                case KeyboardType.C:
                    break
                case KeyboardType.Delete:
                    var $selectUi: BaseMaterialNodeUI = this.getSelUI();
                    if ($selectUi ) {
                        if ( !($selectUi instanceof ResultNodeUI)) {
                            this.delUI($selectUi);
                        }
                    }
                    break
                case KeyboardType.S:
                    if ($evt.altKey) {
                        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SAVE_MATERIA_PANEL));
                    }
                case KeyboardType.O:
                    ModuleEventManager.dispatchEvent(new left.LeftEvent(left.LeftEvent.SHOW_LEFT_PANEL));
                    break
                case KeyboardType.Z:

                    MtlUiData.Scale += 0.1
                    UIManager.getInstance().resize();

                    break
                default:
                    break
            }
          
        }
        private delUI($ui: BaseMaterialNodeUI): void {
           
       
            $ui.removeAllNodeLine();
            UIManager.getInstance().removeUIContainer($ui)
        }
        private getSelUI(): BaseMaterialNodeUI {
            for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $temp: BaseMaterialNodeUI = <BaseMaterialNodeUI>UIManager.getInstance()._containerList[i]
                if ($temp && $temp.select) {
                    return $temp
                }
            }
            return null;
        }
   
        public onKeyUp($evt: KeyboardEvent): void {
            Arpg2dGameStart.altKey = $evt.altKey
        }
        private _isMidelMouse: boolean
        private onMouse($e: MouseEvent): void {
            if ($e.type == MouseType.MouseDown) {
                if ($e.button == 1) {
                    this._isMidelMouse = true
                    this.mouseXY = new Vector2D($e.x, $e.y)
                }
            }


        }
        private onMouseMove($e: MouseEvent): void {
            if (this._isMidelMouse) {
                var $txy: Vector2D = new Vector2D($e.x - this.mouseXY.x, $e.y - this.mouseXY.y)
                $txy.x/= MtlUiData.Scale;
                $txy.y /= MtlUiData.Scale;

                this.stageMoveTx($txy)

          
                this.mouseXY = new Vector2D($e.x, $e.y);
        

            }
        }
        private onMouseUp($e: MouseEvent): void {
            this._isMidelMouse = false
        }
        private mouseXY: Vector2D;
        public onMouseWheel($evt: MouseWheelEvent): void {

            var $slectUi: UICompenent = UIManager.getInstance().getObjectsUnderPoint(new Vector2D($evt.x, $evt.y))
            if ($slectUi && $slectUi.name == "modelPic") {
                Scene_data.cam3D.distance += ($evt.wheelDelta * Scene_data.cam3D.distance)/1000;
            } else {
       
                var $addScale: number = $evt.wheelDelta > 0 ? +0.1 : -0.1;
                MtlUiData.Scale += $addScale;

                MtlUiData.Scale = Math.max(0.7, MtlUiData.Scale);
                MtlUiData.Scale = Math.min(MtlUiData.Scale, 1);

            }
        }
        private stageMoveTx($txy: Vector2D): void {
            Arpg2dGameStart.stagePos.x += $txy.x;
            Arpg2dGameStart.stagePos.y += $txy.y;
   
            for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                var $uiConatiner: UIConatiner = UIManager.getInstance()._containerList[i];
                if ($uiConatiner instanceof MtUiPanel) {
                    $uiConatiner.left += $txy.x;
                    $uiConatiner.top += $txy.y;
                }
            
            }
            UIManager.getInstance().resize();
        }
    }
}