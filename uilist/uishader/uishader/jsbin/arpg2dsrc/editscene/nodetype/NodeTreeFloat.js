var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeFloat = (function (_super) {
        __extends(NodeTreeFloat, _super);
        function NodeTreeFloat() {
            _super.call(this);
            this.canDynamic = true;
        }
        NodeTreeFloat.prototype.getComponentID = function ($id) {
            if ($id == 0) {
                var str = materialui.CompileOne.FC + materialui.NodeTree.getID(this.regResultConst.id);
                if (this.regConstIndex == 0) {
                    str += ".x";
                }
                else if (this.regConstIndex == 1) {
                    str += ".y";
                }
                else if (this.regConstIndex == 2) {
                    str += ".z";
                }
                else if (this.regConstIndex == 3) {
                    str += ".w";
                }
                return str;
            }
            return null;
        };
        return NodeTreeFloat;
    })(materialui.NodeTree);
    materialui.NodeTreeFloat = NodeTreeFloat;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeFloat.js.map