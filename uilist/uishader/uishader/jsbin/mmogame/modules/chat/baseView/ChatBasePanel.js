var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Chat;
(function (Chat) {
    var ChatBasePanel = (function (_super) {
        __extends(ChatBasePanel, _super);
        function ChatBasePanel() {
            _super.call(this);
            this.uiAtlasComplet = false;
            this._lastMouseY = 0;
            this._lastChatListY = 0;
            this._chatListMove = false;
            this.listRect = new Rectangle(0, 0, 100, 100);
            this.width = UIData.designWidth;
            this.height = UIData.designHeight;
            this.top = 0;
            this.left = 0;
            this._bottomRender = new UIRenderComponent();
            this.addRender(this._bottomRender);
            this._midRender = new UIRenderComponent();
            this.addRender(this._midRender);
            this._topRender = new UIRenderComponent();
            this.addRender(this._topRender);
            this._midRender.uiAtlas = new UIAtlas();
        }
        ChatBasePanel.prototype.applyLoad = function () {
            var _this = this;
            this._midRender.uiAtlas.setInfo("ui/uidata/chat/chat.xml", "ui/uidata/chat/chat.png", function () { _this.loadConfigCom(); }, "ui/uidata/chat/chatuse.png");
        };
        ChatBasePanel.prototype.loadConfigCom = function () {
            this._bottomRender.uiAtlas = this._midRender.uiAtlas;
            this._topRender.uiAtlas = this._midRender.uiAtlas;
            this.w_list_page_bg = this.addEvntBut("w_list_page_bg", this._midRender);
            this.w_list_page_bg.addEventListener(InteractiveEvent.Up, this.butClik, this);
            this.w_win_close = this.addEvntButUp("w_win_close", this._bottomRender);
            this.w_win_close.top = 10;
            this.w_right_gold_line = this.addChild(this._topRender.getComponent("w_right_gold_line"));
            this.w_right_gold_line.top = 0;
            this.chatBaseMenu = new Chat.ChatBaseMenu();
            this.chatBaseMenu.setRender(this._bottomRender, this._midRender, this._topRender);
            this.addVirtualContainer(this.chatBaseMenu);
            this.chatBaseLeftMenu = new Chat.ChatBaseLeftMenu();
            this.chatBaseLeftMenu.setRender(this._bottomRender, this._midRender, this._topRender);
            this.addVirtualContainer(this.chatBaseLeftMenu);
            this.listPanel = new Chat.ChatListContextComponent();
            this.listPanel.panelUiAtlas = this._midRender.uiAtlas;
            this.listPanel.pageBasePos = new Vector2D(90, 0);
            this.listPanel.textScale = 1.35;
            this.listPanel.configUIAtlas(this);
            this.addRender(this.listPanel);
            this._listMask = new UIMask();
            this._listMask.x = 0;
            this._listMask.y = 0;
            this._listMask.width = 512;
            this._listMask.height = 100;
            this.addMask(this._listMask);
            this.listPanel.mask = this._listMask;
            this.uiAtlasComplet = true;
            this.applyLoadComplete();
            this.refresh();
        };
        ChatBasePanel.prototype.listBgMouseDown = function (evt) {
            this._chatListMove = false;
            this._lastMouseY = evt.y;
            this._lastChatListY = this.listPanel.pagey;
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onStageMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onStageUp, this);
        };
        ChatBasePanel.prototype.onStageMove = function (evt) {
            this._chatListMove = true;
            this.listPanel.pagey = this._lastChatListY - (evt.y - this._lastMouseY);
        };
        ChatBasePanel.prototype.onStageUp = function (evt) {
            this._chatListMove = false;
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onStageMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onStageUp, this);
            this.listPanel.uptoCtx();
        };
        ChatBasePanel.prototype.butClik = function (evt) {
            switch (evt.target) {
                case this.w_win_close:
                    this.close();
                    break;
                case this.w_list_page_bg:
                    if (evt.type == InteractiveEvent.Up) {
                        if (!this._chatListMove) {
                            this.listPanel.clikEvent(evt);
                        }
                    }
                    else {
                        this.listBgMouseDown(evt);
                    }
                    break;
                default:
                    break;
            }
        };
        ChatBasePanel.prototype.close = function () {
            UIManager.getInstance().removeUIContainer(this);
            Engine.needInputTxt = false;
        };
        ChatBasePanel.prototype.resize = function () {
            _super.prototype.resize.call(this);
            if (this.uiAtlasComplet) {
                this.listRect.x = 80;
                this.listRect.y = 0;
                this.listRect.width = 400;
                this.listRect.height = Scene_data.stageHeight / UIData.Scale - 65;
                this.w_list_page_bg.x = this.listRect.x;
                this.w_list_page_bg.y = this.listRect.y;
                this.w_list_page_bg.width = this.listRect.width;
                this.w_list_page_bg.height = this.listRect.height;
                this._listMask.x = this.listRect.x;
                this._listMask.y = this.listRect.y;
                this._listMask.width = this.listRect.width;
                this._listMask.height = this.listRect.height;
                this._listMask.applyObjData();
                this.listPanel.textHeight = this.listRect.height;
                this._bottomRender.applyObjData();
                this._midRender.applyObjData();
                this._topRender.applyObjData();
            }
        };
        ChatBasePanel.prototype.refresh = function () {
            if (this.uiAtlasComplet && this.hasStage) {
                this.resize();
                this.listPanel.refresh();
                this.chatBaseLeftMenu.refresh();
                this.chatBaseMenu.refresh();
            }
        };
        return ChatBasePanel;
    })(UIConatiner);
    Chat.ChatBasePanel = ChatBasePanel;
})(Chat || (Chat = {}));
//# sourceMappingURL=ChatBasePanel.js.map