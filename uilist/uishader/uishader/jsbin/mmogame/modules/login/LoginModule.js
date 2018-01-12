var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LoginModule = (function (_super) {
    __extends(LoginModule, _super);
    function LoginModule() {
        _super.apply(this, arguments);
    }
    LoginModule.prototype.getModuleName = function () {
        return "LoginModule";
    };
    LoginModule.prototype.listProcessors = function () {
        return [new LoginProcessor()];
    };
    return LoginModule;
})(Module);
//# sourceMappingURL=LoginModule.js.map