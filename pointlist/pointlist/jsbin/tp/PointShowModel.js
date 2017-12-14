var PointShowModel = (function () {
    /**是否是外网 */
    function PointShowModel() {
    }
    PointShowModel.init = function () {
        var _this = this;
        Engine.init(document.getElementById('ArpgStageCanvas'));
        UIManager.getInstance().regEvent(null);
        this.loadDataComplet();
        setInterval(function () { _this.upFrameData(); }, 1000 / 60);
    };
    PointShowModel.upFrameData = function () {
        PointListSpriter.PointSize = this.PointSize;
        Engine.update();
    };
    PointShowModel.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        SceneManager.getInstance().addDisplay($GridLineSprite);
    };
    PointShowModel.loadDataComplet = function () {
        this._pointListSpriter = new PointListSpriter();
        SceneManager.getInstance().addDisplay(this._pointListSpriter);
        SceneManager.getInstance().ready = true;
        if (this.hasMouseEvent) {
            GameMouseManager.getInstance().addMouseEvent();
            SceneMouseEventModel.getInstance().initSceneFocueEvent();
        }
        if (this.showGridline) {
            this.addGridLineSprite();
        }
    };
    PointShowModel.setPointData = function ($point, $color) {
        if ($color === void 0) { $color = null; }
        this._pointListSpriter.setNewItemData($point, $color);
    };
    PointShowModel.PointSize = 2;
    PointShowModel.hasMouseEvent = false;
    PointShowModel.showGridline = false;
    return PointShowModel;
})();
//# sourceMappingURL=PointShowModel.js.map