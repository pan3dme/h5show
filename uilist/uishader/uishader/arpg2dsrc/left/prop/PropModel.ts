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
                }
                if ($ui instanceof materialui.ConstVec3NodeUI) {
                    this.metaDataView = new Vec3PropMeshPanel();
                } else if ($ui instanceof materialui.ConstFloatNodeUI) {
                    this.metaDataView = new FloatPropMeshPanel();
                } else if ($ui instanceof materialui.TextureSampleNodeUI) {
                    this.metaDataView = new TexturePropMeshPanel();
                } else if ($ui instanceof materialui.ResultNodeUI) {
                    this.metaDataView = new OpPropMeshPanel();
                } else {
                    this.showSciencePropPanel();
  
                }

                this.lastNodel = $ui;
                this.metaDataView.data = $ui;
                this.metaDataView.top = this._top

            }
        }
        private showSciencePropPanel(): void {
            if (this.metaDataView) {
                this.metaDataView.destory()
                this.metaDataView = null;
                this.lastNodel = null;
            }
            this.metaDataView = new SciencePropMeshPanel();
         


        }
        private _top: number=350
        public moveTop($ty: number): void {
            this._top = $ty
            if (this.metaDataView) {
                this.metaDataView.top = this._top
            }
        }
    }
}