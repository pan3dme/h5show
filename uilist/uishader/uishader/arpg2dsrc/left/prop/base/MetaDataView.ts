module prop {

    export class MetaDataView {

        protected _data: any;
        protected _top: number=350
        public set top(value: number) {
            this._top = value;
            this.resize()
   
        }
        public get top(): number {
            return this._top
        }

        public constructor() {
            this.creat(this.getView());
        }
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                   
         
                ];
            return ary;
        }
        public set data(value: any) {
            this._data = value;
            this.refreshViewValue()
        }
        public get data(): any {
            return this._data
        }

        private ui: Array<BaseReflComponent>
        public creat(data: Array<any>): void {
            this.ui = new Array;
            for (var i: number = 0; i < data.length; i++) {
                this.ui.push(this.creatComponent(data[i]));
            }
            this.addComponentView();
        }
        private addComponentView(): void {

            this.resize();

        }
        private resize(): void {
            var ty: number = this._top
            for (var i: number = 0; this.ui&& i < this.ui.length; i++) {
                this.ui[i].y = ty;
                this.ui[i].x = 20;
                ty += this.ui[i].height;
            }
        }
        public creatComponent(obj: any): BaseReflComponent {
            var type: String = obj[ReflectionData.Key_Type];
            if (type == ReflectionData.NumberInput) {
                return this.getNumComponent(obj);
            }
            if (type == ReflectionData.Texturue2DUI) {
                return this.getTexturue2DUI(obj);
            }
            if (type == ReflectionData.ComboBox) {
                return this.getComboBox(obj);
            }

            
            return null;
        }
        public getComboBox($obj: Object): ComBoBoxCtrl2D {
            var $ComBoBoxCtrl2D: ComBoBoxCtrl2D = new ComBoBoxCtrl2D()
            $ComBoBoxCtrl2D.label = $obj[ReflectionData.Key_Label];
            $ComBoBoxCtrl2D.FunKey = $obj[ReflectionData.FunKey];
            $ComBoBoxCtrl2D.data = $obj[ReflectionData.Key_Data];
            $ComBoBoxCtrl2D.target = this
            return $ComBoBoxCtrl2D;
        }
        public getTexturue2DUI($obj: Object): Texturue2DUI {
            var $texturue2DUI: Texturue2DUI = new Texturue2DUI()
            $texturue2DUI.label = $obj[ReflectionData.Key_Label];
            $texturue2DUI.FunKey = $obj[ReflectionData.FunKey];
            $texturue2DUI.target = this
            return $texturue2DUI;
        }
        public getNumComponent($obj: Object): TextCtrlInput {
            var $textCtrlInput: TextCtrlInput = new TextCtrlInput()
            $textCtrlInput.label = $obj[ReflectionData.Key_Label];
            $textCtrlInput.FunKey = $obj[ReflectionData.FunKey];
            $textCtrlInput.KeyStep = $obj[ReflectionData.Key_Step];
            $textCtrlInput.target = this
            return $textCtrlInput;
        }

        public refreshViewValue(): void {
            for (var i: number = 0; i < this.ui.length; i++) {
                this.ui[i].refreshViewValue()
            }
        }
        public destory(): void
        {
            while (this.ui.length) {
                var $ui: BaseReflComponent = this.ui.pop();
                $ui.destory()
            }

        }

    }
}