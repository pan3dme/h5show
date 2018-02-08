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
            Scene_data.focus3D.rotationY = 125;
            Scene_data.focus3D.rotationX = -45;
            Scene_data.cam3D.distance = 150;
            this.initSceneView();
            setInterval(function () { _this.upFrameData(); }, 1000 / 60);
        };
        TestDispStart.prototype.initSceneView = function () {
            Engine.initPbr();
            GameMouseManager.getInstance().addMouseEvent();
            SceneMouseEventModel.getInstance().initSceneFocueEvent();
            SceneManager.getInstance().ready = true;
            this.addBaseModel(1000, "pan/marmoset/model/1007.jpg", "pan/marmoset/model/1004.jpg", ["pan/marmoset/model/1005.jpg", "pan/marmoset/model/1009.jpg"]);
            this.addBaseModel(1001, "pan/marmoset/model/1003.jpg", "pan/marmoset/model/1006.jpg", ["pan/marmoset/model/1001.jpg", "pan/marmoset/model/1008.jpg"]);
        };
        TestDispStart.prototype.addBaseModel = function ($id, $baseuv, $nrmuv, alphajpg) {
            var $ds = new UishaderSprite();
            $ds.loadFileById($id, $baseuv, $nrmuv, alphajpg);
            SceneManager.getInstance().addDisplay($ds);
        };
        TestDispStart.prototype.upFrameData = function () {
            TimeUtil.update();
            FpsMc.update();
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