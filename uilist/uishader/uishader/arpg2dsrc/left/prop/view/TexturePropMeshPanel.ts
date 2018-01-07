module prop {

    export class TexturePropMeshPanel extends MetaDataView {
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.NumberInput, Label: "贴图:", GetFun: this.getValue, SetFun: this.setValue, target: this, Category: "属性" },
              
                ];
            return ary;
        }
    }
}