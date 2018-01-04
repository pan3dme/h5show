module materialui {
    export class RightMenuEvent extends BaseEvent {
        public static SHOW_RIGHT_MENU: string = "SHOW_RIGHT_MENU"; //显示面板
        public static HIDE_RIGHT_MENU: string = "HIDE_RIGHT_MENU"; //显示面板
        public posv2d: Vector2D;


    }
    export class RightMenuModule extends Module {
        public getModuleName(): string {
            return "RightMenuModule";
        }
        protected listProcessors(): Array<Processor> {
            return [new RightMenuProcessor()];
        }
    }

    export class RightMenuProcessor extends BaseProcessor {
        public getName(): string {
            return "RightMenuProcessor";
        }
        private _rightMenuPanel: RightMenuPanel
        protected receivedModuleEvent($event: BaseEvent): void {
            if ($event instanceof RightMenuEvent) {
                var $materialEvent: RightMenuEvent = <RightMenuEvent>$event;
                if ($materialEvent.type == RightMenuEvent.SHOW_RIGHT_MENU) {

                    this.showMenuPanel($materialEvent.posv2d)
                }
                if ($materialEvent.type == RightMenuEvent.HIDE_RIGHT_MENU) {
                    if (this._rightMenuPanel) {
                        UIManager.getInstance().removeUIContainer(this._rightMenuPanel);
                        Scene_data.uiBlankStage.removeEventListener(InteractiveEvent.Down, this.onMouseDown, this);
                    }
                }
            }
        }
        private showMenuPanel(posv2d: Vector2D): void {
            if (!this._rightMenuPanel) {
                this._rightMenuPanel = new RightMenuPanel()
            }
            this._rightMenuPanel.left = posv2d.x / UIData.Scale;
            this._rightMenuPanel.top = posv2d.y / UIData.Scale;
            UIManager.getInstance().addUIContainer(this._rightMenuPanel);
            this._rightMenuPanel.refrish()

            Scene_data.uiBlankStage.addEventListener(InteractiveEvent.Down, this.onMouseDown, this);
        }
        public onMouseDown($evt: InteractiveEvent): void {
            ModuleEventManager.dispatchEvent(new RightMenuEvent(RightMenuEvent.HIDE_RIGHT_MENU));
        
        }

        protected listenModuleEvents(): Array<BaseEvent> {
            return [
                new RightMenuEvent(RightMenuEvent.SHOW_RIGHT_MENU),
                new RightMenuEvent(RightMenuEvent.HIDE_RIGHT_MENU),


            ];
        }
    }

}