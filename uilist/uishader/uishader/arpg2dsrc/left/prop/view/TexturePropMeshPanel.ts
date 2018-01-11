module prop {

    export class TexturePropMeshPanel extends MetaDataView {
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.Texturue2DUI, Label: "纹理:", FunKey: "picurl", target: this, Category: "属性" },
                    { Type: ReflectionData.ComboBox, Label: "Wrap:", FunKey: "wrapValue", target: this, Data: [{ name: "repeat", type: 0 }, { name: "clamp", type: 1 }] },
                    { Type: ReflectionData.ComboBox, Label: "Mipmap:", FunKey: "mipmapValue", target: this, Data: [{ name: "no", type: 0 }, { name: "mipnearest", type: 1 }, { name: "miplinear", type: 2 }] },
                    { Type: ReflectionData.ComboBox, Label: "filter:", FunKey: "filterValue", target: this, Data: [{ name: "linear", type: 0 }, { name: "nearest", type: 1 }] },
                    { Type: ReflectionData.ComboBox, Label: "预乘:", FunKey: "permulValue", target: this, Data: [{ name: "false", type: 0 }, { name: "true", type: 1 }] },
              
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
  
        public set picurl(value: string) {
            
            (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).url = value
            this.textureSampleNodeUI.drawPicBmp();
            this.changeData();
        }
        public get picurl(): string {
            return (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).url
        }
        public set constValue(value: number) {
            
        }
        public get constValue(): number {
            return 1
        }

        public set wrapValue(value: number) {
            (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).wrap = value;
        }
        public get wrapValue(): number {
            return (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).wrap
        }
        public set mipmapValue(value: number) {
            (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).mipmap = value;
        }
        public get mipmapValue(): number {
            return (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).mipmap
        }

        public set filterValue(value: number) {
            (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).filter = value;
        }
        public get filterValue(): number {
            return (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).filter
        }


        public set permulValue(value: number) {
            (<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).permul = Boolean(value);
        }
        public get permulValue(): number {
            if ((<materialui.NodeTreeTex>this.textureSampleNodeUI.nodeTree).permul) {
                return 1;
            } else {
                return 0;
            }
        }

        private changeData(): void {
            ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.COMPILE_MATERIAL));
        }
    }
}