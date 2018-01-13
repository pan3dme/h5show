module prop {

    export class Vec3ColorCtrlUI extends BaseReflComponent {

        private textLabelUI: TextLabelUI;
        private inputTextUiX: InputTextUi;
        private inputTextUiY: InputTextUi;
        private inputTextUiZ: InputTextUi;

        private textX: TextLabelUI;
        private textY: TextLabelUI;
        private textZ: TextLabelUI;

        private colorPickUI: ColorPickUI

        private _label: string

        private _v3d: Vector3D;
        protected initView(): void {
            this.textLabelUI = new TextLabelUI();
            this.textX = new TextLabelUI();
            this.textY = new TextLabelUI();
            this.textZ = new TextLabelUI();
            this.textX.label = "X:";
            this.textY.label = "Y:";
            this.textZ.label = "Z:";

            this.inputTextUiX = new InputTextUi();
            this.inputTextUiX.text = "255";

            this.inputTextUiY = new InputTextUi();
            this.inputTextUiY.text = "0";

            this.inputTextUiZ = new InputTextUi();
            this.inputTextUiZ.text = "255";

            this.colorPickUI = new ColorPickUI();

            this.inputTextUiX.addEventListener(ReflectionEvet.CHANGE_DATA, this.inputTextUiXchange, this)
            this.colorPickUI.addEventListener(ReflectionEvet.CHANGE_DATA, this.colorPickUIchange, this)
            this.height = 50
        }
        public destory(): void {
            this.textLabelUI.destory();
            this.inputTextUiX.destory();
            this.inputTextUiY.destory();
            this.inputTextUiZ.destory();
            this.textX.destory();
            this.textY.destory();
            this.textZ.destory();
            this.colorPickUI.destory();
        }
        public set data(value: any) {
            this._data = value;
            this._v3d = this._data 
       
        }
        public get data(): any {
            return this._data
        }
        private inputTextUiXchange($evt: ReflectionEvet): void {
  
            this.target[this.FunKey] = this._v3d;
            this.refreshViewValue();

        }
        private colorPickUIchange($evt: ReflectionEvet): void {
            var $vec: Vector3D = <Vector3D>($evt.data);
            this.target[this.FunKey] = $vec
            this.refreshViewValue();
        }
        public refreshViewValue(): void {
            this._v3d = this.target[this.FunKey]
            this.colorPickUI.vec3d = this._v3d;
            this.inputTextUiX.text = this.getNumStr(this._v3d.x);
            this.inputTextUiY.text = this.getNumStr(this._v3d.y);
            this.inputTextUiZ.text = this.getNumStr(this._v3d.z);

        }
        public getNumStr(num: number): string {
            var n: number = Math.floor(num * 100) / 100;
            return n.toString();
        }
        public set x(value: number) {
            this._x = value;
            this.textLabelUI.x = this._x -15;

            this.textX.x = this._x + 55;
            this.textY.x = this._x + 125;
            this.textZ.x = this._x + 195;

            this.inputTextUiX.x = this._x + 85;
            this.inputTextUiY.x = this._x + 155;
            this.inputTextUiZ.x = this._x + 225;

            this.colorPickUI.x = this._x + 50;
        }
        public get x(): number {
            return this._x
        }

        public set y(value: number) {
            this._y = value;
            this.textLabelUI.y = this._y
            this.textX.y = this._y
            this.textY.y = this._y
            this.textZ.y = this._y
            this.inputTextUiX.y = this._y
            this.inputTextUiY.y = this._y
            this.inputTextUiZ.y = this._y
            this.colorPickUI.y = this._y + 25;
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