module materialui {
    export class MaterialEvent extends BaseEvent {
        public static INIT_MATERIA_PANEL: string = "SHOW_MAP_EVENT"; //显示面板
        public static HIDE_MAP_EVENT: string = "HIDE_MAP_EVENT"; //显示面板


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
                if ($materialEvent.type == MaterialEvent.INIT_MATERIA_PANEL) {
                    this.openMaterialPanel()
                }
                if ($materialEvent.type == MaterialEvent.HIDE_MAP_EVENT) {
           
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
                    //this.setConnetLine($mevent_Material_Connect.endNode);
                }


            }
     

        }
        public setConnetLine($line: MaterialNodeLineUI): void {
           // this.lineContainer.removeLine($line);
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
                new MaterialEvent(MaterialEvent.INIT_MATERIA_PANEL),
                
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
            UIManager.getInstance().addUIContainer(new TextureSampleNodeUI());
            UIManager.getInstance().addUIContainer(new MathAddNodeUI());
            UIManager.getInstance().addUIContainer(new ResultNodeUI());

            document.addEventListener(MouseType.MouseWheel, ($evt: MouseWheelEvent) => { this.onMouseWheel($evt) });
            document.addEventListener(MouseType.MouseDown, ($evt: MouseEvent) => { this.onMouse($evt) });
            document.addEventListener(MouseType.MouseMove, ($evt: MouseEvent) => { this.onMouseMove($evt) });
            document.addEventListener(MouseType.MouseUp, ($evt: MouseEvent) => { this.onMouseUp($evt) });



            document.addEventListener(MouseType.KeyDown, ($evt: KeyboardEvent) => { this.onKeyDown($evt) })
            document.addEventListener(MouseType.KeyUp, ($evt: KeyboardEvent) => { this.onKeyUp($evt) })


           
            document.addEventListener("contextmenu", (event: any) => {
                event.preventDefault();
                console.log("右键");

                var menu = document.getElementById("menu");
                menu.style.top = event.clientY + "px";
                menu.style.left = event.clientX + "px";
                menu.style.visibility = "visible";
            });

            GameMouseManager.getInstance().addMouseEvent();

 
        
           
            
        }
       

        public onKeyDown($evt: KeyboardEvent): void {
            Arpg2dGameStart.altKey = $evt.altKey
            switch ($evt.keyCode) {
                case KeyboardType.C:
                    UIManager.getInstance().addUIContainer(new MathAddNodeUI());
                    break
                default:
                    break
            }
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
                Arpg2dGameStart.stagePos.x += $txy.x;
                Arpg2dGameStart.stagePos.y += $txy.y;

                for (var i: number = 0; i < UIManager.getInstance()._containerList.length; i++) {
                    var $uiConatiner: UIConatiner = UIManager.getInstance()._containerList[i];
                    $uiConatiner.left += $txy.x;
                    $uiConatiner.top += $txy.y;


                }
                this.mouseXY = new Vector2D($e.x, $e.y);
                UIManager.getInstance().resize();

            }
        }
        private onMouseUp($e: MouseEvent): void {
            this._isMidelMouse = false
        }
        private mouseXY: Vector2D;





        public onMouseWheel($evt: MouseWheelEvent): void {

            UIData.Scale += ($evt.wheelDelta / 1000)
            UIManager.getInstance().resize();

        }
    }
}