var ModuleList = /** @class */ (function () {
    function ModuleList() {
    }
    ModuleList.getModuleList = function () {
        //所有的需要注册的模块  都写在这里
        var $arr = [
            new EngineModule(),
            new SceneLoadModule(),
            new materialui.MaterialModule(),
            new materialui.RightMenuModule(),
        ];
        return $arr;
    };
    /**
     * 启动所有模块
     */
    ModuleList.startup = function () {
        var allModules = ModuleList.getModuleList();
        for (var i = 0; i < allModules.length; i++) {
            Module.registerModule(allModules[i]);
        }
    };
    return ModuleList;
}());
//# sourceMappingURL=ModuleList.js.map