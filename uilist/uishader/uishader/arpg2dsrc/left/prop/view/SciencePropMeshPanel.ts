module prop {

    export class SciencePropMeshPanel extends MetaDataView {

        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.Vec3Color, Label: "环境光:", FunKey: "constXValue", target: this, Step: 0.1 },
                    { Type: ReflectionData.Vec3Color, Label: "光法线:", FunKey: "constXValue", target: this, Step: 0.1 },
                ];
            return ary;
        }

        public set data(value: any) {
            this._data = value;
            this._colorAbc = new Vector3D(1,0.5,1)
            this.refreshViewValue()
        }
        public get data(): any {
            return this._data
        }
        private _colorAbc: Vector3D
        public get constXValue(): Vector3D {
            return this._colorAbc
        }
        public set constXValue(value: Vector3D) {
            this._colorAbc = value
        }
 
   
    }
}