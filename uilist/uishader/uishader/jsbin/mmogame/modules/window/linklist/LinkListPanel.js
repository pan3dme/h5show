var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var linklist;
(function (linklist) {
    var LinkListPanel = (function (_super) {
        __extends(LinkListPanel, _super);
        function LinkListPanel() {
            _super.call(this);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);
        }
        LinkListPanel.prototype.applyLoad = function () {
            this._midRender.uiAtlas = new UIAtlas();
            this.applyLoadComplete();
        };
        LinkListPanel.prototype.butClik = function (evt) {
            UIManager.getInstance().removeUIContainer(this);
        };
        return LinkListPanel;
    })(WindowCentenMin);
    linklist.LinkListPanel = LinkListPanel;
})(linklist || (linklist = {}));
//# sourceMappingURL=LinkListPanel.js.map