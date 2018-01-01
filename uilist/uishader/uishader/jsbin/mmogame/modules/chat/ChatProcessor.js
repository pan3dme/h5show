var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Chat;
(function (Chat) {
    var ChatEvent = (function (_super) {
        __extends(ChatEvent, _super);
        function ChatEvent() {
            _super.apply(this, arguments);
        }
        ChatEvent.SHOW_CHAT_EVENT = "SHOW_CHAT_EVENT"; //显示面板
        ChatEvent.HIDE_CHAT_EVENT = "HIDE_CHAT_EVENT"; //显示面板
        ChatEvent.CHAT_INFO_TO_PANEL = "CHAT_INFO_TO_PANEL"; //主场UI显示聊天内容
        ChatEvent.REFRESH_EMAIL_LIST = "REFRESH_EMAIL_LIST"; //
        return ChatEvent;
    })(BaseEvent);
    Chat.ChatEvent = ChatEvent;
    var ChatModule = (function (_super) {
        __extends(ChatModule, _super);
        function ChatModule() {
            _super.apply(this, arguments);
        }
        ChatModule.prototype.getModuleName = function () {
            return "ChatModule";
        };
        ChatModule.prototype.listProcessors = function () {
            return [new ChatProcessor()];
        };
        return ChatModule;
    })(Module);
    Chat.ChatModule = ChatModule;
    var ChatProcessor = (function (_super) {
        __extends(ChatProcessor, _super);
        function ChatProcessor() {
            _super.apply(this, arguments);
        }
        ChatProcessor.prototype.getName = function () {
            return "ChatProcessor";
        };
        ChatProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof mainUi.MainUiEvent) {
                if (this._chatBasePanel) {
                    this._chatBasePanel.close();
                }
            }
            if ($event instanceof ChatEvent) {
                var evt = $event;
                if (evt.type == ChatEvent.SHOW_CHAT_EVENT) {
                    this.showBasePanel();
                }
                if (evt.type == ChatEvent.HIDE_CHAT_EVENT) {
                    if (this._chatBasePanel) {
                        this._chatBasePanel.close();
                    }
                }
                // if (evt.type == ChatEvent.REFRESH_EMAIL_LIST) {
                //     if (this._chatBasePanel) {
                //         this._chatBasePanel.refresh()
                //     }
                //     ModuleEventManager.dispatchEvent(new bottomui.BottomUiEvent(bottomui.BottomUiEvent.BOTTOM_REFRESH_INFO_ICON));
                // }
                if (evt.type == ChatEvent.CHAT_INFO_TO_PANEL) {
                    if (this._chatBasePanel) {
                        this._chatBasePanel.refresh();
                    }
                }
            }
        };
        ChatProcessor.prototype.showBasePanel = function () {
            var _this = this;
            if (!this._chatBasePanel) {
                this._chatBasePanel = new Chat.ChatBasePanel();
            }
            this._chatBasePanel.load(function () {
                UIManager.getInstance().addUIContainer(_this._chatBasePanel);
                _this._chatBasePanel.refresh();
            });
        };
        ChatProcessor.prototype.listenModuleEvents = function () {
            return [
                new ChatEvent(ChatEvent.SHOW_CHAT_EVENT),
                new ChatEvent(ChatEvent.HIDE_CHAT_EVENT),
                new ChatEvent(ChatEvent.CHAT_INFO_TO_PANEL),
                new ChatEvent(ChatEvent.REFRESH_EMAIL_LIST),
                new mainUi.MainUiEvent(mainUi.MainUiEvent.HIDE_MAINUI_EVENT),
            ];
        };
        return ChatProcessor;
    })(BaseProcessor);
    Chat.ChatProcessor = ChatProcessor;
})(Chat || (Chat = {}));
//# sourceMappingURL=ChatProcessor.js.map