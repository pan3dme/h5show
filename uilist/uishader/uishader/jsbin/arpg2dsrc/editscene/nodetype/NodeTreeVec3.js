var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeVec3 = (function (_super) {
        __extends(NodeTreeVec3, _super);
        function NodeTreeVec3() {
            _super.call(this);
            this.constVec3 = new Vector3D;
            this.canDynamic = true;
        }
        NodeTreeVec3.prototype.getComponentID = function ($id) {
            if ($id == 0) {
                return materialui.CompileOne.FC + materialui.NodeTree.getID(this.regResultConst.id) + ".xyz";
            }
            else if ($id == 1) {
                return materialui.CompileOne.FC + materialui.NodeTree.getID(this.regResultConst.id) + ".w";
            }
            else if ($id == 2) {
                return materialui.CompileOne.FC + materialui.NodeTree.getID(this.regResultConst.id);
            }
            return null;
        };
        return NodeTreeVec3;
    })(materialui.NodeTree);
    materialui.NodeTreeVec3 = NodeTreeVec3;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeVec3.js.map