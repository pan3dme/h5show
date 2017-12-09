var Md5MouseManager = /** @class */ (function () {
    function Md5MouseManager() {
    }
    Md5MouseManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new Md5MouseManager();
        }
        return this._instance;
    };
    Md5MouseManager.prototype.addMouseEvent = function () {
        var _this = this;
        if (Scene_data.isPc) {
            document.addEventListener(MouseType.MouseDown, function ($evt) { _this.onMouse($evt); });
            document.addEventListener(MouseType.MouseUp, function ($evt) { _this.onMouse($evt); });
            document.addEventListener(MouseType.MouseMove, function ($evt) { _this.onMouse($evt); });
            document.addEventListener(MouseType.MouseWheel, function ($evt) { _this.onMouseWheel($evt); });
        }
        else {
            document.addEventListener(MouseType.TouchMove, function ($evt) { _this.mouseToEvent($evt); });
            document.addEventListener(MouseType.TouchEnd, function ($evt) { _this.mouseToEvent($evt); });
            document.addEventListener(MouseType.TouchStart, function ($evt) { _this.mouseToEvent($evt); });
        }
    };
    Md5MouseManager.prototype.onMouseWheel = function ($evt) {
    };
    Md5MouseManager.prototype.onMouse = function ($e) {
        var evt;
        var point = new Vector2D();
        if ($e instanceof MouseEvent) {
            if ($e.type == MouseType.MouseDown) {
                evt = new InteractiveEvent(InteractiveEvent.Down);
            }
            else if ($e.type == MouseType.MouseUp) {
                evt = new InteractiveEvent(InteractiveEvent.Up);
            }
            else if ($e.type == MouseType.MouseMove) {
                evt = new InteractiveEvent(InteractiveEvent.Move);
            }
            else if ($e.type == MouseType.MouseClick) {
            }
            point.x = $e.pageX;
            point.y = $e.pageY;
        }
        this.makeMouseEvent(evt, point);
    };
    Md5MouseManager.prototype.mouseToEvent = function ($touchEvent) {
        var evt;
        var point = new Vector2D();
        if ($touchEvent.type == MouseType.TouchStart) {
            evt = new InteractiveEvent(InteractiveEvent.Down);
        }
        else if ($touchEvent.type == MouseType.TouchEnd) {
            evt = new InteractiveEvent(InteractiveEvent.Up);
            point.x = $touchEvent.changedTouches[0].pageX;
            point.y = $touchEvent.changedTouches[0].pageY;
        }
        else if ($touchEvent.type == MouseType.TouchMove) {
            evt = new InteractiveEvent(InteractiveEvent.Move);
        }
        if ($touchEvent.touches.length) {
            point.x = $touchEvent.touches[$touchEvent.touches.length - 1].clientX;
            point.y = $touchEvent.touches[$touchEvent.touches.length - 1].clientY;
        }
        this.makeMouseEvent(evt, point);
    };
    Md5MouseManager.prototype.makeMouseEvent = function (evt, point) {
        var temp = UIManager.getInstance().mouseEvetData(evt, point);
        if (!temp) {
            if (evt.type == InteractiveEvent.Up) {
                this.clikSceneGround(point);
            }
        }
    };
    Md5MouseManager.prototype.clikSceneGround = function ($pos) {
    };
    Md5MouseManager.prototype.walkPathComplete = function () {
    };
    return Md5MouseManager;
}());
//# sourceMappingURL=Md5MouseManager.js.map