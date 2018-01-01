var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var materialui;
(function (materialui) {
    var MEvent_Material_Connect = (function (_super) {
        __extends(MEvent_Material_Connect, _super);
        function MEvent_Material_Connect() {
            _super.apply(this, arguments);
        }
        MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STARTDRAG = "MEvent_Material_Connect_startDrag";
        MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_STOPDRAG = "MEvent_Material_Connect_stopDrag";
        MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_REMOVELINE = "MEvent_Material_Connect_removeLine";
        MEvent_Material_Connect.MEVENT_MATERIAL_CONNECT_DOUBLUELINE = "MEvent_Material_Connect_doublueLine";
        return MEvent_Material_Connect;
    })(BaseEvent);
    materialui.MEvent_Material_Connect = MEvent_Material_Connect;
})(materialui || (materialui = {}));
//# sourceMappingURL=MEvent_Material_Connect.js.map