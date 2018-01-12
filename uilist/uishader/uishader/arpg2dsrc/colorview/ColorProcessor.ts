module colorview {
    export class ColorEvent extends BaseEvent {
        public static SHOW_COLOR_PANEL: string = "SHOW_COLOR_PANEL"; //显示面板
        public static HIDE_COLOR_PANEL: string = "HIDE_COLOR_PANEL"; //显示面板
    }
    export class ColorModule extends Module {
        public getModuleName(): string {
            return "ColorModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new ColorProcessor()];
        }
    }

    export class ColorProcessor extends BaseProcessor {
        public getName(): string {
            return "ColorProcessor";
        }
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof ColorEvent) {
                var $leftEvent: ColorEvent = <ColorEvent>$event;

                if ($leftEvent.type == ColorEvent.SHOW_COLOR_PANEL) {
                    this.showColorPanel();
                }
                if ($leftEvent.type == ColorEvent.HIDE_COLOR_PANEL) {
                    this.hideColorPanel();
                }
            }
        }

        private hideColorPanel(): void {
            if (this.colorPanel) {
                UIManager.getInstance().removeUIContainer(this.colorPanel)
            }
        }
        private showColorPanel(): void {
            if (!this.colorPanel) {
                this.colorPanel = new ColorPanel
            }
            if (!this.colorPanel.hasStage) {
                UIManager.getInstance().addUIContainer(this.colorPanel)
            } else {
                ModuleEventManager.dispatchEvent(new ColorEvent(ColorEvent.HIDE_COLOR_PANEL));
            }
        }
        private colorPanel: ColorPanel
        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new ColorEvent(ColorEvent.SHOW_COLOR_PANEL),
                new ColorEvent(ColorEvent.HIDE_COLOR_PANEL),


            ];
        }
    }
}