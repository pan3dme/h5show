var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var EngineModule = (function (_super) {
    __extends(EngineModule, _super);
    function EngineModule() {
        _super.apply(this, arguments);
    }
    EngineModule.prototype.getModuleName = function () {
        return "EngineModule";
    };
    EngineModule.prototype.listProcessors = function () {
        return [new EngineProcessor(),
            new NetBaseProcessor()
        ];
    };
    return EngineModule;
})(Module);
//# sourceMappingURL=EngineModule.js.map