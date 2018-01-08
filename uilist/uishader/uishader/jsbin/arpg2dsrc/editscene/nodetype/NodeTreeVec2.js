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
    var NodeTreeVec2 = /** @class */ (function (_super) {
        __extends(NodeTreeVec2, _super);
        function NodeTreeVec2() {
            var _this = _super.call(this) || this;
            _this.constValue = new Vector2D;
            _this.canDynamic = true;
            return _this;
        }
        return NodeTreeVec2;
    }(materialui.NodeTree));
    materialui.NodeTreeVec2 = NodeTreeVec2;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeVec2.js.map