var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var leftui;
(function (leftui) {
    var LeftUiModule = (function (_super) {
        __extends(LeftUiModule, _super);
        function LeftUiModule() {
            _super.apply(this, arguments);
        }
        LeftUiModule.prototype.getModuleName = function () {
            return "LeftUiModule";
        };
        LeftUiModule.prototype.listProcessors = function () {
            return [new LeftUiProcessor()];
        };
        return LeftUiModule;
    })(Module);
    leftui.LeftUiModule = LeftUiModule;
    var LeftUiEvent = (function (_super) {
        __extends(LeftUiEvent, _super);
        function LeftUiEvent() {
            _super.apply(this, arguments);
        }
        LeftUiEvent.SHOW_LEFT_UI_PANEL = "SHOW_LEFT_UI_PANEL";
        LeftUiEvent.HIDE_LEFT_UI_PANEL = "HIDE_LEFT_UI_PANEL";
        LeftUiEvent.REFRESH_QUEST_EVENT = "REFRESH_QUEST_EVENT";
        LeftUiEvent.LEFT_HANGUP_BASE_REFRESH = "LEFT_HANGUP_BASE_REFRESH"; // 基础挂机数据更新
        return LeftUiEvent;
    })(BaseEvent);
    leftui.LeftUiEvent = LeftUiEvent;
    var LeftUiProcessor = (function (_super) {
        __extends(LeftUiProcessor, _super);
        function LeftUiProcessor() {
            _super.apply(this, arguments);
        }
        LeftUiProcessor.prototype.getName = function () {
            return "LeftUiProcessor";
        };
        LeftUiProcessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof LeftUiEvent) {
                var $topUiEvent = $event;
                if ($topUiEvent.type == LeftUiEvent.SHOW_LEFT_UI_PANEL) {
                    this.showPanel();
                }
                if ($topUiEvent.type == LeftUiEvent.LEFT_HANGUP_BASE_REFRESH) {
                }
                if ($topUiEvent.type == LeftUiEvent.HIDE_LEFT_UI_PANEL) {
                    this.hidePanel();
                }
                if ($topUiEvent.type == LeftUiEvent.REFRESH_QUEST_EVENT) {
                    if (this.leftUiPanel) {
                        this.leftUiPanel.leftUiQuestPanel.refresh();
                        if (GuidData.map.isBaseMap()) {
                            this.questFinishWalkToNextNpc();
                        }
                    }
                }
            }
            if ($event instanceof EngineEvent) {
                var $EngineEvent = $event;
                if ($EngineEvent.type == EngineEvent.MONEY_CHANGE) {
                    if (this.leftUiPanel) {
                        this.leftUiPanel.leftUiQuestPanel.refresh();
                        console.log("刷新任务");
                    }
                }
            }
        };
        LeftUiProcessor.prototype.showEffect = function () {
            var $data = new msgtip.MsgEffectsMoveData();
            var $pos = new Vector2D(UIData.designWidth / 2, UIData.designHeight / 2);
            $data.startTM = TimeUtil.getTimer() + random(200);
            $data.endTM = $data.startTM + 500;
            $data.pos = $pos;
            $data.MONEY_TYPE = 1;
            $data.bezierPos = new Vector2D($pos.x + Math.random() * 400 - 200, $pos.y + Math.random() * 400 - 200);
            $data.toPos = new Vector2D(150, 178);
            var $MsgTipEvent = new msgtip.MsgTipEvent(msgtip.MsgTipEvent.SHOW_EFFECTS_DATA);
            $MsgTipEvent.data = $data;
            ModuleEventManager.dispatchEvent($MsgTipEvent);
        };
        LeftUiProcessor.prototype.questFinishWalkToNextNpc = function () {
            if (GameInstance.questMoveVo) {
                quest.QuestModel.getInstance().walkToNewMainQuest();
            }
        };
        LeftUiProcessor.prototype.hidePanel = function () {
            if (this.leftUiPanel) {
                this.leftUiPanel.hide();
            }
        };
        LeftUiProcessor.prototype.showPanel = function () {
            var _this = this;
            if (!this.leftUiPanel) {
                this.leftUiPanel = new leftui.LeftUiPanel();
            }
            this.leftUiPanel.load(function () {
                if (GuidData.map.isFamilyScene()) {
                }
                else {
                }
                if (GuidData.map.isAdventureBossScene()) {
                    AotuSkillManager.getInstance().aotuBattle = true;
                }
                _this.leftUiPanel.show();
            }, false);
        };
        LeftUiProcessor.prototype.listenModuleEvents = function () {
            return [
                new LeftUiEvent(LeftUiEvent.SHOW_LEFT_UI_PANEL),
                new LeftUiEvent(LeftUiEvent.HIDE_LEFT_UI_PANEL),
                new LeftUiEvent(LeftUiEvent.LEFT_HANGUP_BASE_REFRESH),
                new LeftUiEvent(LeftUiEvent.REFRESH_QUEST_EVENT),
                new EngineEvent(EngineEvent.MONEY_CHANGE),
            ];
        };
        return LeftUiProcessor;
    })(BaseProcessor);
    leftui.LeftUiProcessor = LeftUiProcessor;
})(leftui || (leftui = {}));
//# sourceMappingURL=LeftUiProcessor.js.map