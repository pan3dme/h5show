module prop {

    export class Vec3PropMeshPanel extends MetaDataView {
        private constVec3NodeUI: materialui.ConstVec3NodeUI;
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.NumberInput, Label: "x:", FunKey: "constXValue", target: this, Category: "属性" },
                    { Type: ReflectionData.NumberInput, Label: "y:", FunKey: "constYValue", target: this, Category: "属性" },
                    { Type: ReflectionData.NumberInput, Label: "z:", FunKey: "constZValue", target: this, Category: "属性" },

                ];
            return ary;
        }
        private _ve3d:Vector3D
        public set data(value: any) {
            this._data = value;
            this.constVec3NodeUI = this._data;

            this._ve3d=this.constVec3NodeUI.constValue
            this.refreshViewValue()


        }
        public get data(): any {
            return this._data
        }


        public get constXValue(): number {
            return this._ve3d.x
        }
        public set constXValue(value: number) {
            this._ve3d.x = value
            this.constVec3NodeUI.constValue = this._ve3d
        }

        public get constYValue(): number {

            return this._ve3d.y
        }
        public set constYValue(value: number) {
            this._ve3d.y = value
            this.constVec3NodeUI.constValue = this._ve3d
        }

        public get constZValue(): number {
            return this._ve3d.z
        }
        public set constZValue(value: number) {
            this._ve3d.z = value

            this.constVec3NodeUI.constValue = this._ve3d
        }
    }
}