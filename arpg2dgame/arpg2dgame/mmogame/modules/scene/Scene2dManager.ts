class Scene2dManager {

    private static _instance: Scene2dManager;
    public static getInstance(): Scene2dManager {
        if (!this._instance) {
            this._instance = new Scene2dManager();
        }
        return this._instance;
    }
    constructor() {
       
    }
    private _currentUrl: string;
    public loadScene($url: string, $completeFun: Function, $progressFun: Function, $analysisCompleteFun: Function): void {
        if (this._currentUrl == $url) {//原场景不加载
            AstarUtil.porcessBak(true);
            SceneManager.getInstance().ready = true;
            $completeFun();
            $analysisCompleteFun();
            return;
        }
        SceneManager.getInstance().clearStaticScene();
        SceneManager.getInstance().ready= false;
        var $mapId: number = GuidData.map.tbMapVo.id
        LoadManager.getInstance().load(Scene_data.fileRoot + "pan/map2d/net/" + $mapId + ".txt", LoadManager.XML_TYPE,
            ($str: string) => {
                Scene_data.sceneNumId++;
                MapConfig.getInstance().anlyData($str);
                AstarUtil.makeStarGraph(MapConfig.getInstance().astarItem);
                SceneManager.getInstance().ready = true;
                $completeFun();
                $analysisCompleteFun();
            });

        this._currentUrl = $url;
    }

} 