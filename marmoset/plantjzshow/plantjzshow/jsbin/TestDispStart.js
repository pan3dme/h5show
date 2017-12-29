var testScene;
(function (testScene) {
    var TestDispStart = /** @class */ (function () {
        function TestDispStart() {
        }
        TestDispStart.prototype.init = function () {
            var _this = this;
            Scene_data.fileRoot = " http://" + document.domain + "/arpg/res/";
            Engine.init(document.getElementById('ArpgStageCanvas'));
            FpsStage.getInstance().init(document.getElementById('FpsTipsCanvas'), document.getElementById('LoadCanvas'));
            Scene_data.focus3D.x = 0;
            Scene_data.focus3D.y = 0;
            Scene_data.focus3D.z = 0;
            Scene_data.focus3D.rotationY = 0;
            Scene_data.focus3D.rotationX = -45;
            Scene_data.cam3D.distance = 250;
            this.initSceneView();
            setInterval(function () { _this.upFrameData(); }, 1000 / 60);
        };
        TestDispStart.prototype.initSceneView = function () {
            Engine.initPbr();
            SkillMouseManager.getInstance().addMouseEvent();
            SkillMouseEventModel.getInstance().initSceneFocueEvent();
            SceneManager.getInstance().addDisplay(new ProdkarenModelSprite());
            SceneManager.getInstance().ready = true;
        };
        TestDispStart.prototype.upFrameData = function () {
            TimeUtil.update();
            var istrue = false;
            if (istrue) {
                SceneManager.getInstance().update();
            }
            else {
                SceneRenderToTextrue.getInstance().renderToTexture();
                if (SceneRenderToTextrue.getInstance().fbo) {
                    BloomRenderModel.getInstance().showTexture(SceneRenderToTextrue.getInstance().fbo.texture);
                }
            }
        };
        TestDispStart.prototype.resetSize = function () {
            Engine.resetSize();
        };
        return TestDispStart;
    }());
    testScene.TestDispStart = TestDispStart;
})(testScene || (testScene = {}));
//# sourceMappingURL=TestDispStart.js.map