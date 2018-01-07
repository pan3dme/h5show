module prop {

    export class MetaDataView {

        protected _data:any
        public constructor() {
            this.creat(this.getView());
        }
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.NumberInput, Label: "环境光强:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
         
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
            var ty: number = 350
            for (var i: number = 0; i < this.ui.length; i++) {
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
            return null;
        }

        public getValue(): number {
            return 123
        }
        public setValue(value: Object): void {

        }

        public getNumComponent($obj: Object): TextCtrlInput {
            var $textCtrlInput: TextCtrlInput = new TextCtrlInput()
            $textCtrlInput.label = $obj[ReflectionData.Key_Label];
            $textCtrlInput.FunKey = $obj[ReflectionData.FunKey];
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