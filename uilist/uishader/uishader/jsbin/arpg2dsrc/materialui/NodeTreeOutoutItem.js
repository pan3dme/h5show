var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var NodeTreeOutoutItem = (function (_super) {
        __extends(NodeTreeOutoutItem, _super);
        function NodeTreeOutoutItem() {
            _super.call(this);
            this.sunNodeItems = new Array;
            this.inoutType = materialui.NodeTreeItem.OUT;
        }
        NodeTreeOutoutItem.prototype.pushSunNode = function (nodeitem) {
            this.sunNodeItems.push(nodeitem);
        };
        NodeTreeOutoutItem.prototype.removeSunNode = function (nodeitem) {
            for (var i = 0; i < this.sunNodeItems.length; i++) {
                if (this.sunNodeItems[i] == nodeitem) {
                    this.sunNodeItems.splice(i, 1);
                    break;
                }
            }
        };
        return NodeTreeOutoutItem;
    })(materialui.NodeTreeItem);
    materialui.NodeTreeOutoutItem = NodeTreeOutoutItem;
})(materialui || (materialui = {}));
//# sourceMappingURL=NodeTreeOutoutItem.js.map