module materialui {

    export class MtUIRenderComponent extends UIRenderComponent {
        public constructor() {
            super();
        }
        public createFrame($upskin: string): MtFrameCompenent {

            var frameMc: MtFrameCompenent = new MtFrameCompenent;
            frameMc.skinName = $upskin;
            var rec: UIRectangle = this.uiAtlas.getRec($upskin);
            frameMc.setFrameData(rec);
            frameMc.uiRender = this;
            return frameMc;
        }

        public creatBaseComponent($skinName: string): MtUICompenent {
            var ui: MtUICompenent = new MtUICompenent();
            ui.skinName = $skinName;
            var rec: UIRectangle = this.uiAtlas.getRec($skinName);

            ui.tr.setRec(rec);
            ui.width = rec.pixelWitdh;
            ui.height = rec.pixelHeight;

            ui.uiRender = this;
            return ui;
        }

        public creatGrid9Component($skinName: string, $width: number, $height: number): MtGrid9Compenent {
            var ui: MtGrid9Compenent = new MtGrid9Compenent();
            ui.skinName = $skinName;
            var rec: UIGridRentangle = this.uiAtlas.getGridRec($skinName)
            ui.tr.setRec(rec);
            ui.ogw = rec.ogw;
            ui.ogh = rec.ogh;
            ui.gw = ui.ogw / rec.pixelWitdh;
            ui.gh = ui.ogh / rec.pixelHeight;
            ui.width = $width;
            ui.height = $height;

            ui.uiRender = this;
            return ui;
        }

    }
}