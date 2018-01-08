module prop {

    export class FloatPropMeshPanel extends MetaDataView {

        private constFloatNodeUI:materialui.ConstFloatNodeUI;
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.NumberInput, Label: "x:", FunKey: "constValue", target: this,  Step: 0.1 },

                ];
            return ary;
            // ReflectionData.FunKey
        }
        public set data(value: any) {
            this._data = value;
            this.constFloatNodeUI = this._data;
            this.refreshViewValue()
        }
        public get data(): any {
            return this._data
        }

        public get constValue(): number {
            return this.constFloatNodeUI.constValue
        }
        public set constValue(value: number) {
            this.constFloatNodeUI.constValue = value;


        }
    }
}