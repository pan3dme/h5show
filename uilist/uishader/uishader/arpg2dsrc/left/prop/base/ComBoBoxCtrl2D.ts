module prop {

    export class ComBoBoxCtrl2D extends BaseReflComponent {

        private textLabelUI: TextLabelUI;
        private comboBoxUi: ComboBoxUi;

        private _label: string

        protected initView(): void {
            this.textLabelUI = new TextLabelUI();
            this.comboBoxUi = new ComboBoxUi();
            this.comboBoxUi.addEventListener(InteractiveEvent.Down, this.comboBoxUiDown, this)
            this.height = 20
        }
        public destory(): void {
            this.textLabelUI.destory()
            this.comboBoxUi.destory()
        }
        public set data(value: any) {
            this._data = value;
            this.comboxListTxt = this._data

        }
        public get data(): any {
            return this._data
        }
        private comboxListTxt: Array<any>;
        private comboBoxUiDown($evt: InteractiveEvent): void {
            var $rightMenuEvet: materialui.RightMenuEvent = new materialui.RightMenuEvent(materialui.RightMenuEvent.SHOW_COMBOX_MENU);
            $rightMenuEvet.posv2d = new Vector2D(this.comboBoxUi.x, this.comboBoxUi.y+20);
            $rightMenuEvet.comboxData = this.data;
            $rightMenuEvet.comboxFun = (value: number) => { this.selectFun(value)}
            ModuleEventManager.dispatchEvent($rightMenuEvet);

            console.log(this.data);
          
          //  this.target[this.FunKey] = this.target[this.FunKey] + Number($evt.data)
            //this.refreshViewValue();
        }
        private selectFun(value: number): void {
            console.log("selectFun", value)
            this.target[this.FunKey] = value;
            this.refreshViewValue();
        }
        public refreshViewValue(): void {

            if (this.FunKey) {
                var $i: number = this.target[this.FunKey]
                console.log(this.comboxListTxt[$i].name);

                this.comboBoxUi.text = this.comboxListTxt[$i].name
            }
          
            

        }
        public set x(value: number) {
            this._x = value;
            this.textLabelUI.x = this._x + 0;
            this.comboBoxUi.x = this._x + 75;
        }
        public get x(): number {
            return this._x
        }

        public set y(value: number) {
            this._y = value;
            this.textLabelUI.y = this._y
            this.comboBoxUi.y = this._y
        }
        public get y(): number {
            return this._y
        }
        public get label(): string {
            return this._label;
        }
        public set label(value: string) {
            this._label = value
            this.textLabelUI.label = value;
        }
    }

}