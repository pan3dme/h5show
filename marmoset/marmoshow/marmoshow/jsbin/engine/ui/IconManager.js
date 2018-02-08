var IconManager = /** @class */ (function () {
    function IconManager() {
        this._dic = new Object;
        this._loadDic = new Object;
    }
    IconManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new IconManager();
        }
        return this._instance;
    };
    return IconManager;
}());
//# sourceMappingURL=IconManager.js.map