var Scene2dManager = /** @class */ (function () {
    function Scene2dManager() {
    }
    Scene2dManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new Scene2dManager();
        }
        return this._instance;
    };
    Scene2dManager.prototype.loadScene = function ($url, $completeFun, $progressFun, $analysisCompleteFun) {
        if (this._currentUrl == $url) {
            AstarUtil.porcessBak(true);
            SceneManager.getInstance().ready = true;
            $completeFun();
            $analysisCompleteFun();
            return;
        }
        SceneManager.getInstance().clearStaticScene();
        SceneManager.getInstance().ready = false;
        var $mapId = GuidData.map.tbMapVo.id;
        LoadManager.getInstance().load(Scene_data.fileRoot + "pan/map2d/net/" + $mapId + ".txt", LoadManager.XML_TYPE, function ($str) {
            Scene_data.sceneNumId++;
            MapConfig.getInstance().anlyData($str);
            AstarUtil.makeStarGraph(MapConfig.getInstance().astarItem);
            SceneManager.getInstance().ready = true;
            $completeFun();
            $analysisCompleteFun();
        });
        this._currentUrl = $url;
    };
    return Scene2dManager;
}());
//# sourceMappingURL=Scene2dManager.js.map