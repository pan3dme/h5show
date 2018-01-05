var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var selectserver;
(function (selectserver) {
    var Ssgonggao = (function (_super) {
        __extends(Ssgonggao, _super);
        function Ssgonggao() {
            _super.call(this);
            this._mouseY = 0;
            this.curY = 0;
            this.scrollLock = true;
            this._txtHight = 0;
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.center = 0;
            this.middle = 0;
            // this._bottomRender = new UIRenderComponent;
            // this.addRender(this._bottomRender)
            this._baseRender = new UIRenderComponent;
            this.addRender(this._baseRender);
            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);
            this._bgMask = new UIMask();
            this._bgMask.x = 146;
            this._bgMask.y = 110;
            this._bgMask.width = 695;
            this._bgMask.height = 355;
            this.addMask(this._bgMask);
            this._topRender.mask = this._bgMask;
        }
        Ssgonggao.prototype.dispose = function () {
            this._baseRender.dispose();
            this._baseRender = null;
            this._topRender.dispose();
            this._topRender = null;
            this._bgMask.dispose();
            this._bgMask = null;
        };
        Ssgonggao.prototype.initUiAtlas = function ($uiAtlas) {
            // this._bottomRender.uiAtlas = $uiAtlas;
            this._baseRender.uiAtlas = $uiAtlas;
            this._topRender.uiAtlas = $uiAtlas;
            this.initView();
        };
        Ssgonggao.prototype.initView = function () {
            var renderLevel = this._baseRender;
            var b_angel3 = this.addChild(renderLevel.getComponent("b_angel3"));
            b_angel3.isU = true;
            b_angel3.isV = true;
            var b_angel1 = this.addChild(renderLevel.getComponent("b_angel1"));
            b_angel1.isU = true;
            this.addChild(renderLevel.getComponent("b_angel0"));
            var b_angel2 = this.addChild(renderLevel.getComponent("b_angel2"));
            b_angel2.isV = true;
            this.addUIList(["b_topline", "b_leftline", "b_leftline_copy", "b_topline_copy", "b_title"], renderLevel);
            this.b_gonggao = this.addChild(this._topRender.getComponent("b_gonggao"));
            this.b_gonggao.addEventListener(InteractiveEvent.Down, this.onDown, this);
        };
        Ssgonggao.prototype.resize = function () {
            _super.prototype.resize.call(this);
        };
        Ssgonggao.prototype.onDown = function ($e) {
            if (this._bgMask.testPoint($e.x, $e.y)) {
                this._mouseY = $e.y;
                if (!this.scrollLock) {
                    Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
                    Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);
                }
            }
        };
        Ssgonggao.prototype.onMove = function ($e) {
            var delatY = $e.y - this._mouseY;
            this._mouseY = $e.y;
            // if (delatY < 0 && this.scrollLock) {
            //     return;
            // }
            var scrollYnum = this._txtHight - this._bgMask.height;
            this.curY = this.curY - delatY;
            if (this.curY <= 0) {
                this.b_gonggao.y = 110;
                return;
            }
            if (this.curY >= scrollYnum) {
                this.b_gonggao.y = 110 - scrollYnum;
                return;
            }
            this.b_gonggao.y = this.b_gonggao.y + delatY;
            // this.scrollY(delatY);
        };
        Ssgonggao.prototype.onUp = function ($e) {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        };
        Ssgonggao.prototype.show = function () {
            UIManager.getInstance().addUIContainer(this);
            //请求数据
            this.resetData();
        };
        Ssgonggao.prototype.hide = function () {
            UIManager.getInstance().removeUIContainer(this);
        };
        Ssgonggao.prototype.resetData = function () {
            var _this = this;
            LoadManager.getInstance().load("gg.txt", LoadManager.XML_TYPE, function ($str) {
                $str = $str.replace(/\r/g, "\n");
                var aaa = LabelTextFont.writeText(_this._baseRender.uiAtlas, _this.b_gonggao.skinName, 0, 0, $str, 16, ColorType.color9a683f, 685, true);
                _this._txtHight = aaa[1];
                _this.scrollLock = _this._txtHight <= _this._bgMask.height;
                _this.b_gonggao.y = 110;
            });
            this.resize();
        };
        return Ssgonggao;
    })(UIVirtualContainer);
    selectserver.Ssgonggao = Ssgonggao;
})(selectserver || (selectserver = {}));
//# sourceMappingURL=Ssgonggao.js.map