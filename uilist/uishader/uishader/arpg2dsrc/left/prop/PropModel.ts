module prop {

    export class PropModel {

        private static _instance: PropModel;
        public static getInstance(): PropModel {
            if (!this._instance) {
                this._instance = new PropModel();
            }
            return this._instance;
        }
        private metaDataView: MetaDataView;
        private lastNodel: materialui.BaseMaterialNodeUI
        public showPanel($ui: materialui.BaseMaterialNodeUI): void {
            if (this.lastNodel != $ui) {
                if (this.metaDataView) {
                    this.metaDataView.destory()
                    this.metaDataView = null;
                    this.lastNodel = null;
                }
                if ($ui instanceof materialui.ConstVec3NodeUI) {
                    this.metaDataView = new Vec3PropMeshPanel();
                } else if ($ui instanceof materialui.ConstFloatNodeUI) {
                    this.metaDataView = new FloatPropMeshPanel();
                } else {
                    return;
                }
                this.lastNodel = $ui;
                this.metaDataView.data = $ui;
            }



        }
    }
}