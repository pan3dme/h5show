module prop {

    export class ComboBoxUi extends TextLabelUI {


        public constructor() {
            super();
        }
        protected initView(): void {
            this.textLabelUIMeshVo.name = "是否";
            this.addEvets()
        }
        private addEvets(): void {
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
        }
        protected butClik(evt: InteractiveEvent): void {
            this.dispatchEvent(evt);
        }

       


    }
}