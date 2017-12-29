var TpGame = (function () {
    function TpGame() {
    }
    /**是否是外网 */
    TpGame.prototype.init = function () {
        var _this = this;
        PointListSpriter.PointSize = 2;
        Engine.init(document.getElementById('ArpgStageCanvas'));
        UIManager.getInstance().regEvent(null);
        this.loadDataComplet();
        setInterval(function () { _this.upFrameData(); }, 1000 / 60);
    };
    TpGame.prototype.upFrameData = function () {
        Engine.update();
    };
    TpGame.prototype.addGridLineSprite = function () {
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        var $GridLineSprite = new GridLineSprite();
        SceneManager.getInstance().addDisplay($GridLineSprite);
    };
    TpGame.prototype.loadDataComplet = function () {
        GameMouseManager.getInstance().addMouseEvent();
        SceneMouseEventModel.getInstance().initSceneFocueEvent();
        var $dis = new PointListSpriter();
        SceneManager.getInstance().addDisplay($dis);
        this.addGridLineSprite();
        SceneManager.getInstance().ready = true;
    };
    return TpGame;
})();
//# sourceMappingURL=TpGame.js.map