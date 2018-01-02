var materialui;
(function (materialui) {
    var MaterialTreeManager = (function () {
        function MaterialTreeManager() {
        }
        MaterialTreeManager.getInstance = function () {
            if (!this._instance) {
                this._instance = new MaterialTreeManager();
            }
            return this._instance;
        };
        MaterialTreeManager.prototype.getMaterial = function ($url, $fun) {
            LoadManager.getInstance().load(Scene_data.fileRoot + $url, LoadManager.XML_TYPE, function ($dtstr) {
                var $materailTree = new materialui.MaterialTree;
                $materailTree.url = $url.replace(Scene_data.fileRoot, "");
                var $obj = new Object();
                $obj.compileData = new Object;
                $obj.data = JSON.parse($dtstr);
                $materailTree.setData($obj);
                $fun && $fun($materailTree);
            });
        };
        return MaterialTreeManager;
    })();
    materialui.MaterialTreeManager = MaterialTreeManager;
})(materialui || (materialui = {}));
//# sourceMappingURL=MaterialTreeManager.js.map