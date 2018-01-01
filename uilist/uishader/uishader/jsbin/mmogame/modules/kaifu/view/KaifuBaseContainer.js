var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var kaifu;
(function (kaifu) {
    var KaifuBaseContainer = (function (_super) {
        __extends(KaifuBaseContainer, _super);
        function KaifuBaseContainer() {
            _super.call(this);
        }
        KaifuBaseContainer.prototype.show = function () {
            //this._activeID = $activeID;
            UIManager.getInstance().addUIContainer(this);
        };
        KaifuBaseContainer.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
        };
        KaifuBaseContainer.prototype.setActiveID = function ($val) {
            this._activeID = $val;
        };
        return KaifuBaseContainer;
    })(UIConatiner);
    kaifu.KaifuBaseContainer = KaifuBaseContainer;
})(kaifu || (kaifu = {}));
//# sourceMappingURL=KaifuBaseContainer.js.map