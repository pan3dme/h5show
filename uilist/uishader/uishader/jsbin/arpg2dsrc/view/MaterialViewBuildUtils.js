var materialui;
(function (materialui) {
    var MaterialViewBuildUtils = /** @class */ (function () {
        function MaterialViewBuildUtils() {
        }
        MaterialViewBuildUtils.getInstance = function () {
            if (!this._instance) {
                this._instance = new MaterialViewBuildUtils();
            }
            return this._instance;
        };
        MaterialViewBuildUtils.prototype.setData = function (ary) {
            this._uiVec = new Array;
            var ui;
            if (!ary) {
            }
            else {
                for (var i = 0; i < ary.length; i++) {
                    ui = this.getUI(ary[i].type);
                    ui.setData(ary[i].data);
                    ui.setInItemByData(ary[i].inAry);
                    ui.setOutItemByData(ary[i].outAry);
                    ui.nodeTree.id = ary[i].id;
                    this.addFun(ui);
                    this._uiVec.push(ui);
                }
                this._dataAry = ary;
                this.drawLine();
            }
        };
        MaterialViewBuildUtils.prototype.drawLine = function () {
            for (var i = 0; i < this._dataAry.length; i++) {
                var inAry = this._dataAry[i].inAry;
                for (var j = 0; j < inAry.length; j++) {
                    if (!inAry[j].parentObj) {
                        continue;
                    }
                    var endNode = this.getUIbyID(this._dataAry[i].id, inAry[j].id, true);
                    var startNode = this.getUIbyID(inAry[j].parentObj.pid, inAry[j].parentObj.id, false);
                    if (endNode.typets == materialui.MaterialItemType.UNDEFINE) {
                        endNode.changeType(startNode.typets);
                    }
                    var evt = new materialui.MEvent_Material_Connect(materialui.MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE);
                    evt.startNode = startNode;
                    evt.endNode = endNode;
                    ModuleEventManager.dispatchEvent(evt);
                }
            }
        };
        MaterialViewBuildUtils.prototype.getUIbyID = function ($pid, $id, $inout) {
            var ui = this.getNodeUI($pid);
            if ($inout) {
                return ui.getInItem($id);
            }
            else {
                return ui.getOutItem($id);
            }
        };
        MaterialViewBuildUtils.prototype.getNodeUI = function ($pid) {
            for (var i = 0; i < this._uiVec.length; i++) {
                if (this._uiVec[i].nodeTree.id == $pid) {
                    return this._uiVec[i];
                }
            }
            return null;
        };
        MaterialViewBuildUtils.prototype.getUI = function (type) {
            var ui;
            switch (type) {
                case materialui.NodeTree.OP:
                    ui = new materialui.ResultNodeUI();
                    break;
                case materialui.NodeTree.TEX:
                    ui = new materialui.TextureSampleNodeUI();
                    break;
                case materialui.NodeTree.ADD:
                    ui = new materialui.MathAddNodeUI;
                    break;
                default:
                    break;
            }
            return ui;
        };
        return MaterialViewBuildUtils;
    }());
    materialui.MaterialViewBuildUtils = MaterialViewBuildUtils;
})(materialui || (materialui = {}));
//# sourceMappingURL=MaterialViewBuildUtils.js.map