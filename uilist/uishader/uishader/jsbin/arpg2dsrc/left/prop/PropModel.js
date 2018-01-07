var prop;
(function (prop) {
    var PropModel = (function () {
        function PropModel() {
        }
        PropModel.getInstance = function () {
            if (!this._instance) {
                this._instance = new PropModel();
            }
            return this._instance;
        };
        PropModel.prototype.showPanel = function ($ui) {
            if (this.lastNodel != $ui) {
                if (this.metaDataView) {
                    this.metaDataView.destory();
                    this.metaDataView = null;
                    this.lastNodel = null;
                }
                if ($ui instanceof materialui.ConstVec3NodeUI) {
                    this.metaDataView = new prop.Vec3PropMeshPanel();
                }
                else if ($ui instanceof materialui.ConstFloatNodeUI) {
                    this.metaDataView = new prop.FloatPropMeshPanel();
                }
                else if ($ui instanceof materialui.TextureSampleNodeUI) {
                    this.metaDataView = new prop.TexturePropMeshPanel();
                }
                else {
                    return;
                }
                this.lastNodel = $ui;
                this.metaDataView.data = $ui;
            }
        };
        return PropModel;
    })();
    prop.PropModel = PropModel;
})(prop || (prop = {}));
//# sourceMappingURL=PropModel.js.map