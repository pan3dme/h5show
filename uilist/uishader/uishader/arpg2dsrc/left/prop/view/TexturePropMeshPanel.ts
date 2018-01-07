module prop {

    export class TexturePropMeshPanel extends MetaDataView {
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.Texturue2DUI, Label: "纹理:", FunKey: "picurl", target: this, Category: "属性" },
                    { Type: ReflectionData.ComboBox, Label: "warp:", FunKey: "constValue", target: this, Category: "属性" },
                    { Type: ReflectionData.ComboBox, Label: "mipmin:", FunKey: "constValue", target: this, Category: "属性" },
                    { Type: ReflectionData.ComboBox, Label: "filter:", FunKey: "constValue", target: this, Category: "属性" },
                    { Type: ReflectionData.ComboBox, Label: "预乘:", FunKey: "constValue", target: this, Category: "属性" },
              
                ];
            return ary;
        }
        private textureSampleNodeUI: materialui.TextureSampleNodeUI
        public set data(value: any) {
            this._data = value;
            this.textureSampleNodeUI = this._data;
            this.refreshViewValue();
        }
        public get data(): any {
            return this._data
        }
        public get picurl(): string {
            return (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).url
        }
        public set picurl(value: string) {
         
            (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).url = value

        }
    }
}