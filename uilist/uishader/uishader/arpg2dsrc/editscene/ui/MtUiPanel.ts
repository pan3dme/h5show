module materialui {
    export class MtlUiData {
        public static Scale: number = 1;
    }
    export class MtUiPanel extends UIPanel {
        public constructor() {
            super();
        }
     

        public set left(value: number) {
            this._left = value;
            this._xType = 0;
            this._x = this._left * MtlUiData.Scale;
            this.applyChild();
        }
        public get left(): number {
            return this._left
        }
        public set top(value: number) {
            this._top = value;
            this._yType = 0;
            this._y = this._top * MtlUiData.Scale;
            this.applyChild();
        }
        public get top(): number {
            return this._top
        }
        public resize(): void {
            if (this._xType == 0) {
                this._x = this._left * MtlUiData.Scale;
            } else if (this._xType == 1) {
                this._x = Scene_data.stageWidth - this._right * MtlUiData.Scale - this.width * MtlUiData.Scale;
            } else if (this._xType == 2) {
                this._x = this._center * MtlUiData.Scale + Scene_data.stageWidth / 2 - this.width * MtlUiData.Scale / 2;
            }

            if (this._yType == 0) {
                this._y = this._top * MtlUiData.Scale;
            } else if (this._yType == 1) {
                this._y = Scene_data.stageHeight - this._bottom * MtlUiData.Scale - this.height * MtlUiData.Scale;
            } else if (this._yType == 2) {
                this._y = this._middle * MtlUiData.Scale + Scene_data.stageHeight / 2 - this.height * MtlUiData.Scale / 2;
            }

            this.applyChild();

            this.resizeVirtualList();

        }
    }
}