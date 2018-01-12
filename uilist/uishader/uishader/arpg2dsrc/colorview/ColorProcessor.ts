module colorview {
    export class ColorEvent extends BaseEvent {
        public static SHOW_COLOR_PANEL: string = "SHOW_COLOR_PANEL"; //显示面板
        public static HIDE_COLOR_PANEL: string = "HIDE_COLOR_PANEL"; //显示面板

        public bfun: Function;
        public v3dColor: Vector3D;
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
                var $colorEvent: ColorEvent = <ColorEvent>$event;

                if ($colorEvent.type == ColorEvent.SHOW_COLOR_PANEL) {
                    this.showColorPanel($colorEvent.v3dColor, $colorEvent.bfun);
                }
                if ($colorEvent.type == ColorEvent.HIDE_COLOR_PANEL) {
                    this.hideColorPanel();
                }
            }
        }

        private hideColorPanel(): void {
            if (this.colorPanel) {
                UIManager.getInstance().removeUIContainer(this.colorPanel)
            }
        }
        private showColorPanel($v3d: Vector3D, $bfun: Function): void {
            if (!this.colorPanel) {
                this.colorPanel = new ColorPanel;
            }
            this.colorPanel.load(() => {
                UIManager.getInstance().addUIContainer(this.colorPanel)
                this.colorPanel.initColor($v3d, $bfun);
            })
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