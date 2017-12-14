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
        ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
        this._hitBoxSprite = new LineDisplaySprite();
        SceneManager.getInstance().addDisplay(this._hitBoxSprite);
        this.setBoxScale(100, 100, 100);
        SceneManager.getInstance().ready = true;
        if (this.hasMouseEvent) {
            GameMouseManager.getInstance().addMouseEvent();
            SceneMouseEventModel.getInstance().initSceneFocueEvent();
        }
        if (this.showGridline) {
            this.addGridLineSprite();
        }
    };
    PointShowModel.setBoxScale = function ($x, $y, $z, $color) {
        if ($color === void 0) { $color = null; }
        $x /= 2;
        $y /= 2;
        $z /= 2;
        this._hitBoxSprite.clear();
        this._hitBoxSprite.baseColor = new Vector3D(1, 0, 0);
        if ($color && $color.length >= 3) {
            this._hitBoxSprite.baseColor = new Vector3D($color[0], $color[1], $color[2]);
        }
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, +$z), new Vector3D(+$x, +$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, -$y, +$z), new Vector3D(+$x, -$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, +$z), new Vector3D(-$x, -$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, +$y, +$z), new Vector3D(+$x, -$y, +$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, -$z), new Vector3D(+$x, +$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, -$y, -$z), new Vector3D(+$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, -$z), new Vector3D(-$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, +$y, -$z), new Vector3D(+$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, +$y, +$z), new Vector3D(-$x, +$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, +$y, +$z), new Vector3D(+$x, +$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(-$x, -$y, +$z), new Vector3D(-$x, -$y, -$z));
        this._hitBoxSprite.makeLineMode(new Vector3D(+$x, -$y, +$z), new Vector3D(+$x, -$y, -$z));
        this._hitBoxSprite.upToGpu();
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