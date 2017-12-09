var scene2d;
(function (scene2d) {
    var Scene2dStart = /** @class */ (function () {
        function Scene2dStart() {
        }
        Scene2dStart.prototype.init = function () {
            var _this = this;
            Scene_data.fileRoot = " http://" + document.domain + "/arpg/res/";
            Engine.init(document.getElementById('ArpgStageCanvas'));
            FpsStage.getInstance().init(document.getElementById('FpsTipsCanvas'), document.getElementById('LoadCanvas'));
            scene2d.Engine2d.init(); //初始2D引擎
            this.initSceneView();
            setInterval(function () { _this.upFrameData(); }, 1000 / 60);
        };
        Scene2dStart.prototype.initSceneView = function () {
            scene2d.SceneLinkEventModel.getInstance().addEvets(); //添加事件
            scene2d.LinkScene2DManager.getInstance().loadMapById(1007); //加载地图
        };
        Scene2dStart.prototype.upFrameData = function () {
            Engine.update();
            if (scene2d.AppDataArpg.lockMainChar) {
                scene2d.AppDataArpg.resetSelfPosCenter();
            }
        };
        Scene2dStart.prototype.resetSize = function () {
            Engine.resetSize();
        };
        return Scene2dStart;
    }());
    scene2d.Scene2dStart = Scene2dStart;
})(scene2d || (scene2d = {}));
//# sourceMappingURL=Scene2dStart.js.map