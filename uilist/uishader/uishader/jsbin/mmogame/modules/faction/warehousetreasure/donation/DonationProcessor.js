var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var donation;
(function (donation) {
    var DonationModule = (function (_super) {
        __extends(DonationModule, _super);
        function DonationModule() {
            _super.apply(this, arguments);
        }
        DonationModule.prototype.getModuleName = function () {
            return "DonationModule";
        };
        DonationModule.prototype.listProcessors = function () {
            return [new DonationRrocessor()];
        };
        return DonationModule;
    })(Module);
    donation.DonationModule = DonationModule;
    var DonationEvent = (function (_super) {
        __extends(DonationEvent, _super);
        function DonationEvent() {
            _super.apply(this, arguments);
        }
        DonationEvent.SHOW_DONATION_PANEL = "SHOW_DONATION_PANEL";
        DonationEvent.HIDE_DONATION_PANEL = "HIDE_DONATION_PANEL";
        return DonationEvent;
    })(BaseEvent);
    donation.DonationEvent = DonationEvent;
    var DonationRrocessor = (function (_super) {
        __extends(DonationRrocessor, _super);
        function DonationRrocessor() {
            _super.apply(this, arguments);
        }
        DonationRrocessor.prototype.getName = function () {
            return "DonationRrocessor";
        };
        DonationRrocessor.prototype.receivedModuleEvent = function ($event) {
            if ($event instanceof DonationEvent) {
                var evt = $event;
                if (evt.type == DonationEvent.SHOW_DONATION_PANEL) {
                    this.showPanel(evt.data);
                }
                if (this.donationPanel) {
                    if (evt.type == DonationEvent.HIDE_DONATION_PANEL) {
                        this.hidePanel();
                    }
                }
            }
            if ($event instanceof UIPanelEvent) {
                var panelEvent = $event;
                if (panelEvent.panel == this.donationPanel) {
                    this.donationPanel.dispose();
                    this.donationPanel = null;
                    console.log("释放面板 exchangepPanel");
                }
            }
        };
        DonationRrocessor.prototype.hidePanel = function () {
            this.donationPanel.hide();
        };
        DonationRrocessor.prototype.showPanel = function ($type) {
            var _this = this;
            if (!this.donationPanel) {
                this.donationPanel = new donation.DonationPanel();
            }
            this.donationPanel.load(function () {
                _this.donationPanel.show($type);
            }, false);
        };
        DonationRrocessor.prototype.listenModuleEvents = function () {
            return [
                new DonationEvent(DonationEvent.SHOW_DONATION_PANEL),
                new DonationEvent(DonationEvent.HIDE_DONATION_PANEL),
                new UIPanelEvent(UIPanelEvent.DISPOSE_PANEL_EVENT),
            ];
        };
        return DonationRrocessor;
    })(BaseProcessor);
    donation.DonationRrocessor = DonationRrocessor;
})(donation || (donation = {}));
//# sourceMappingURL=DonationProcessor.js.map