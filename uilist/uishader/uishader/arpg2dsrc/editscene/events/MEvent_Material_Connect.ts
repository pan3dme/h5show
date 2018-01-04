module materialui {
    export class MEvent_Material_Connect extends BaseEvent {
        public static  MEVENT_MATERIAL_CONNECT_STARTDRAG:string = "MEvent_Material_Connect_startDrag";
        public static MEVENT_MATERIAL_CONNECT_STOPDRAG: string = "MEvent_Material_Connect_stopDrag";
        public static MEVENT_MATERIAL_CONNECT_REMOVELINE: string = "MEvent_Material_Connect_removeLine";
        public static MEVENT_MATERIAL_CONNECT_DOUBLUELINE: string = "MEvent_Material_Connect_doublueLine";

        public  itemNode:ItemMaterialUI;
        public  line:MaterialNodeLineUI;

        public  startNode:ItemMaterialUI;
        public  endNode:ItemMaterialUI;


    }
}
