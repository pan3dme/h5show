var Md5MouseEventModel = /** @class */ (function () {
    function Md5MouseEventModel() {
        this.lastRotationY = 0;
        this.lastRotationX = 0;
        this._lastMousePos = new Vector2D();
    }
    Md5MouseEventModel.getInstance = function () {
        if (!this._instance) {
            this._instance = new Md5MouseEventModel();
        }
        return this._instance;
    };
    Md5MouseEventModel.prototype.initSceneFocueEvent = function () {
        var _this = this;
        Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Down, this.onMouseDown, this);
        Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Up, this.onMouseUp, this);
        Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Move, this.onMouseMove, this);
        document.addEventListener(MouseType.MouseWheel, function ($evt) { _this.onMouseWheel($evt); });
    };
    Md5MouseEventModel.prototype.onMouseWheel = function ($evt) {
        Scene_data.cam3D.distance += $evt.wheelDelta / 10;
    };
    Md5MouseEventModel.prototype.onMouseMove = function ($evt) {
        if (this._isMouseDown) {
            var $addx = $evt.x - this._lastMousePos.x;
            Scene_data.focus3D.rotationY = this.lastRotationY - $addx;
            var $addy = $evt.y - this._lastMousePos.y;
            Scene_data.focus3D.rotationX = this.lastRotationX - $addy;
        }
    };
    Md5MouseEventModel.prototype.onMouseDown = function ($evt) {
        this._lastMousePos.x = $evt.x;
        this._lastMousePos.y = $evt.y;
        this.lastRotationY = Scene_data.focus3D.rotationY;
        this.lastRotationX = Scene_data.focus3D.rotationX;
        this._isMouseDown = true;
    };
    Md5MouseEventModel.prototype.onMouseUp = function ($evt) {
        this._isMouseDown = false;
    };
    return Md5MouseEventModel;
}());
//# sourceMappingURL=Md5MouseEventModel.js.map