module prop {
   
    export class InputTextUi extends TextLabelUI{

        
        public constructor() {
            super();
        }
        protected initView(): void {
            this.textLabelUIMeshVo.name = "3.599";
            this.addEvets()
        }
        private addEvets(): void
        {
            var $ui: UICompenent = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.addEventListener(InteractiveEvent.Down, this.butClik, this);
        }
        public destory(): void {
            var $ui: UICompenent = this.textLabelUIMeshVo.textLabelUIDisp2D.ui;
            $ui.removeEventListener(InteractiveEvent.Down, this.butClik, this);
            super.destory()
        }
        public set text(value: string) {
            this.textLabelUIMeshVo.name = value;
           // console.log("valuevaluevalue", value)
        }
        protected butClik(evt: InteractiveEvent): void {

    
            this.addStageMoveEvets(evt)
        }

        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {

            var $reflectionEvet: ReflectionEvet = new ReflectionEvet(ReflectionEvet.CHANGE_DATA)
            $reflectionEvet.data = $e.x - this.mouseXY.x
            this.dispatchEvent($reflectionEvet);
            this.mouseXY = new Vector2D($e.x, $e.y)
        }
        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }
   

    }
}