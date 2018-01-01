var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeInputItem = (function (_super) {
        __extends(NodeTreeInputItem, _super);
        function NodeTreeInputItem() {
            _super.call(this);
        }
        Object.defineProperty(NodeTreeInputItem.prototype, "parentNodeItem", {
            get: function () {
                return this._parentNodeItem;
            },
            set: function (value) {
                this._parentNodeItem = value;
            },
            enumerable: true,
            configurable: true
        });
        return NodeTreeInputItem;
    })(materialui.NodeTreeItem);
    materialui.NodeTreeInputItem = NodeTreeInputItem;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeInputItem.js.map