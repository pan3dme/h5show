class Arpg2dGameStart extends GameStart {
    public static stagePos: Vector2D

    public static altKey:boolean
    public init(): void {

       
        ModuleList.startup();//启动所有模块

        UIData.Scale = 1
        materialui.MtlUiData.Scale = 1;
        Engine.initPbr();
        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SHOW_MATERIA_PANEL));
    }

  



}