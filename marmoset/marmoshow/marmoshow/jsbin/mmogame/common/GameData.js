var ModulePageManager = /** @class */ (function () {
    function ModulePageManager() {
    }
    ModulePageManager.showResTittle = function ($arr) {
    };
    return ModulePageManager;
}());
var GameData = /** @class */ (function () {
    function GameData() {
    }
    GameData.getPublicUiAtlas = function ($fun) {
        var _this = this;
        if (!this.publicbgUiAtlas) {
            this.publicbgUiAtlas = new UIAtlas;
            this.publicbgUiAtlas.setInfo("ui/uidata/public/publicbg.xml", "ui/uidata/public/publicbg.png", function () {
                $fun(_this.publicbgUiAtlas);
            });
        }
        else {
            $fun(this.publicbgUiAtlas);
        }
    };
    return GameData;
}());
//# sourceMappingURL=GameData.js.map