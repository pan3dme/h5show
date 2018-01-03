module materialui {

    export class MaterialTreeManager {
        private static _instance: MaterialTreeManager;
        public static getInstance(): MaterialTreeManager {
            if (!this._instance) {
                this._instance = new MaterialTreeManager();
            }
            return this._instance;
        }
        public getMaterial($url: String, $fun: Function): void{


            LoadManager.getInstance().load(Scene_data.fileRoot + $url, LoadManager.XML_TYPE,
                ($dtstr: string) => {
                    var $materailTree: MaterialTree = new MaterialTree;
                    $materailTree.url = $url.replace(Scene_data.fileRoot, "");
                    var $obj: any = JSON.parse($dtstr)
                    $materailTree.setData($obj);
                    $fun && $fun($materailTree)
                });
        }
    }
}