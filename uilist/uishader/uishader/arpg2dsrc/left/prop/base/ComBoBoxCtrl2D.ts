module prop {

    export class ComBoBoxCtrl2D extends BaseReflComponent {

        private textLabelUI: TextLabelUI;
        private comboBoxUi: ComboBoxUi;

        private _label: string

        protected initView(): void {
            this.textLabelUI = new TextLabelUI();
            this.comboBoxUi = new ComboBoxUi();
            this.comboBoxUi.addEventListener(ReflectionEvet.CHANGE_DATA, this.onChangeInput, this)
            this.height = 20
        }
        public destory(): void {
            this.textLabelUI.destory()
            this.comboBoxUi.destory()
        }
        public set data(value: any) {
            this._data = value;

        }
        public get data(): any {
            return this._data
        }
        private onChangeInput($evt: ReflectionEvet): void {


            this.target[this.FunKey] = this.target[this.FunKey] + Number($evt.data)

            this.refreshViewValue();



        }
        public refreshViewValue(): void {

           // this.inputTextUi.text = String(this.target[this.FunKey])

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