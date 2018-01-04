module materialui {
    export class MtGrid9Compenent extends Grid9Compenent {
        public constructor() {
            super();
        }
        public applyAbsolutePoint(): void {
            if (this.parent) {
                //this.absoluteX = this._x * MtlUiData.Scale + this.parent.x;
                //this.absoluteY = this._y * MtlUiData.Scale + this.parent.y;
                if (this._xType == -1) {
                    this.absoluteX = this._x * MtlUiData.Scale * this.scale + this.parent.x;
                } else if (this._xType == 0) {
                    this.absoluteX = this._left * MtlUiData.Scale;
                } else if (this._xType == 1) {
                    this.absoluteX = Scene_data.stageWidth - this._right * MtlUiData.Scale - this.width * MtlUiData.Scale;
                } else if (this._xType == 2) {
                    this.absoluteX = this._center * MtlUiData.Scale + Scene_data.stageWidth / 2 - this.width * MtlUiData.Scale / 2;
                }

                if (this._yType == -1) {
                    this.absoluteY = this._y * MtlUiData.Scale * this.scale + this.parent.y;
                } else if (this._yType == 0) {
                    this.absoluteY = this._top * MtlUiData.Scale;
                } else if (this._yType == 1) {
                    this.absoluteY = Scene_data.stageHeight - this._bottom * MtlUiData.Scale - this.height * MtlUiData.Scale;
                } else if (this._yType == 2) {
                    this.absoluteY = this._middle * MtlUiData.Scale + Scene_data.stageHeight / 2 - this.height * MtlUiData.Scale / 2;
                }

                this.absoluteWidth = this.width * MtlUiData.Scale;
                this.absoluteHeight = this.height * MtlUiData.Scale;
                this.applyRenderSize();
            }
        }
    }
}