var GameMouseManager = /** @class */ (function () {
    function GameMouseManager() {
    }
    GameMouseManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new GameMouseManager();
        }
        return this._instance;
    };
    GameMouseManager.prototype.addMouseEvent = function () {
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
    GameMouseManager.prototype.onMouseWheel = function ($evt) {
    };
    GameMouseManager.prototype.onMouse = function ($e) {
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
    GameMouseManager.prototype.mouseToEvent = function ($touchEvent) {
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
    GameMouseManager.prototype.makeMouseEvent = function (evt, point) {
        var temp = UIManager.getInstance().mouseEvetData(evt, point);
        if (!temp) {
            if (evt.type == InteractiveEvent.Up) {
                this.clikSceneGround(point);
            }
        }
    };
    GameMouseManager.prototype.clikSceneGround = function ($pos) {
    };
    GameMouseManager.prototype.walkPathComplete = function () {
    };
    return GameMouseManager;
}());
//# sourceMappingURL=ShadowMouseManager.js.map