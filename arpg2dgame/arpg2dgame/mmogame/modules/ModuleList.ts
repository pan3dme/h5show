class ModuleList {
    public constructor() {

    }
    private static getModuleList(): Array<Module> {
        //所有的需要注册的模块  都写在这里

        var $arr: Array<Module> = [
            new EngineModule(), //引擎
            new LoginModule(),
            new SceneModule(),

        ];
        
        return $arr
    }


    /**
     * 启动所有模块 
     */
    public static startup(): void {
        var allModules: Array<Module> = ModuleList.getModuleList();
        for (var i: number = 0; i < allModules.length; i++) {
            Module.registerModule(allModules[i]);
        }
    }

   
}
