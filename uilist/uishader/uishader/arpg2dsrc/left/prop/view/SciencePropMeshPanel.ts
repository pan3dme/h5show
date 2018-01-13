module prop {

    export class SciencePropMeshPanel extends MetaDataView {
        public getView(): Array<any> {
            var ary: Array<any> =
                [
                    { Type: ReflectionData.Vec3Color, Label: "环境颜色:", FunKey: "sunDirect", target: this, Step: 0.1 },
                    { Type: ReflectionData.Vec3Color, Label: "sun颜色:", FunKey: "sunColor", target: this, Step: 0.1 },
                    { Type: ReflectionData.Vec3Color, Label: "基本颜色:", FunKey: "ambientColor", target: this, Step: 0.1 },
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
        public get sunDirect(): Vector3D {
            return new Vector3D(Scene_data.light.sunDirect[0], Scene_data.light.sunDirect[1], Scene_data.light.sunDirect[2]);
        }
        public set sunDirect(value: Vector3D) {
            Scene_data.light.sunDirect[0] = value.x;
            Scene_data.light.sunDirect[1] = value.y;
            Scene_data.light.sunDirect[2] = value.z;
        }

        public get sunColor(): Vector3D {
            return new Vector3D(Scene_data.light.sunColor[0], Scene_data.light.sunColor[1], Scene_data.light.sunColor[2]);
        }
        public set sunColor(value: Vector3D) {
            Scene_data.light.sunColor[0] = value.x;
            Scene_data.light.sunColor[1] = value.y;
            Scene_data.light.sunColor[2] = value.z;
        }

        public get ambientColor(): Vector3D {
            return new Vector3D(Scene_data.light.ambientColor[0], Scene_data.light.ambientColor[1], Scene_data.light.ambientColor[2]);
        }
        public set ambientColor(value: Vector3D) {
            Scene_data.light.ambientColor[0] = value.x;
            Scene_data.light.ambientColor[1] = value.y;
            Scene_data.light.ambientColor[2] = value.z;
        }
 
   
    }
}