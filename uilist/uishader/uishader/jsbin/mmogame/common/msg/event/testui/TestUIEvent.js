var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TestUIEvent = (function (_super) {
    __extends(TestUIEvent, _super);
    function TestUIEvent() {
        _super.apply(this, arguments);
    }
    TestUIEvent.CREAT_TESTUI_EVENT = "creat_testui_event";
    TestUIEvent.ADD_TESTUI_EVENT = "add_testui_event";
    TestUIEvent.HIDE_TESTUI_EVENT = "hide_testui_event";
    return TestUIEvent;
})(BaseEvent);
//# sourceMappingURL=TestUIEvent.js.map