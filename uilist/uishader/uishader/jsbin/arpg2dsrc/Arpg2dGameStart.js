var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Arpg2dGameStart = (function (_super) {
    __extends(Arpg2dGameStart, _super);
    function Arpg2dGameStart() {
        _super.apply(this, arguments);
    }
    Arpg2dGameStart.prototype.init = function () {
        ModuleList.startup(); //启动所有模块
        UIData.Scale = 1;
        materialui.MtlUiData.Scale = 1;
        Engine.initPbr();
        GameMouseManager.getInstance().addMouseEvent();
        ModuleEventManager.dispatchEvent(new materialui.MaterialEvent(materialui.MaterialEvent.SHOW_MATERIA_PANEL));
        //ModuleEventManager.dispatchEvent(new colorview.ColorEvent(colorview.ColorEvent.SHOW_COLOR_PANEL));
    };
    return Arpg2dGameStart;
})(GameStart);
//# sourceMappingURL=Arpg2dGameStart.js.map