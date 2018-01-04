var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var materialui;
(function (materialui) {
    var NodeTreeVec3 = /** @class */ (function (_super) {
        __extends(NodeTreeVec3, _super);
        function NodeTreeVec3() {
            var _this = _super.call(this) || this;
            _this.constVec3 = new Vector3D;
            _this.canDynamic = true;
            return _this;
        }
        return NodeTreeVec3;
    }(materialui.NodeTree));
    materialui.NodeTreeVec3 = NodeTreeVec3;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeVec3.js.map