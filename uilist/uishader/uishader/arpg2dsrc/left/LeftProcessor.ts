module left {
    export class LeftEvent extends BaseEvent {
        public static SHOW_LEFT_PANEL: string = "SHOW_LEFT_PANEL"; //显示面板
        public static HIDE_LEFT_PANEL: string = "HIDE_LEFT_PANEL"; //显示面板
    }
    export class LeftModule extends Module {
        public getModuleName(): string {
            return "LeftModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new LeftProcessor()];
        }
    }

    export class LeftProcessor extends BaseProcessor {
        public getName(): string {
            return "LeftProcessor";
        }
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof LeftEvent) {
                var $leftEvent: LeftEvent = <LeftEvent>$event;

                if ($leftEvent.type == LeftEvent.SHOW_LEFT_PANEL) {
                    this.showLeftPanel();
                    this.showReflactionView()
                }
                if ($leftEvent.type == LeftEvent.HIDE_LEFT_PANEL) {
                    this.hideLeftPanel();
                }
            }
        }
        private showReflactionView(): void
        {
          


        }
        private hideLeftPanel(): void {
            if (this.leftPanel) {
                UIManager.getInstance().removeUIContainer(this.leftPanel)
            }
        }
        private showLeftPanel(): void
        {
            if (!this.leftPanel) {
                this.leftPanel = new LeftPanel
            }
            if (!this.leftPanel.hasStage) {
                UIManager.getInstance().addUIContainer(this.leftPanel)

                ModelShowModel.getInstance().addBaseModel()
            } else {
                ModuleEventManager.dispatchEvent(new LeftEvent(LeftEvent.HIDE_LEFT_PANEL));
            }
     

        }
        private leftPanel: LeftPanel
        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new LeftEvent(LeftEvent.SHOW_LEFT_PANEL),
                new LeftEvent(LeftEvent.HIDE_LEFT_PANEL),


            ];
        }
    }
}