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
            this.addGridLineSprite();
            /*
                <script src="jsbin/testdisp/group/ProdkarenModelSprite.js"></script>
                <script src="jsbin/testdisp/group/ReflectiveGlassSprite.js"></script>
            
                <script src="jsbin/testdisp/dis/GlassModelSprite.js"></script>
                <script src="jsbin/testdisp/dis/ReflectiveModelSprite.js"></script>
                <script src="jsbin/testdisp/dis/GlossModelSprite.js"></script>
                <script src="jsbin/testdisp/dis/DustNormalSprite.js"></script>
                <script src="jsbin/testdisp/dis/NormalsSpriteList.js"></script>
                <script src="jsbin/testdisp/dis/NormalMapSprite.js"></script>
                <script src="jsbin/testdisp/LightSpriteList.js"></script>
                <script src="jsbin/testdisp/SampleSprite3D.js"></script>
            */
            SceneManager.getInstance().addDisplay(new ProdkarenModelSprite());
            SceneManager.getInstance().ready = true;
        };
        TestDispStart.prototype.addGridLineSprite = function () {
            ProgrmaManager.getInstance().registe(LineDisplayShader.LineShader, new LineDisplayShader);
            var $GridLineSprite = new GridLineSprite();
            $GridLineSprite.x = 100000;
            SceneManager.getInstance().addDisplay($GridLineSprite);
        };
        TestDispStart.prototype.upFrameData = function () {
            Engine.update();
        };
        TestDispStart.prototype.resetSize = function () {
            Engine.resetSize();
        };
        return TestDispStart;
    }());
    testScene.TestDispStart = TestDispStart;
})(testScene || (testScene = {}));
//# sourceMappingURL=TestDispStart.js.map