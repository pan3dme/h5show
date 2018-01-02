class Arpg2dGameStart extends GameStart {
    public static stagePos: Vector2D

    public static altKey:boolean
    public init(): void {

       
        ModuleList.startup();//启动所有模块

        UIData.Scale=0.5
        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SHOW_MATERIA_PANEL));


     
    }
   
  



}