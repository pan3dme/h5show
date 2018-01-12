module colorview {

    export class ColorPanel extends UIPanel {
        public _bottomRender: UIRenderComponent;
        public _midRender: UIRenderComponent;
        public _topRender: UIRenderComponent;

        public constructor() {
            super();
            this.layer = 2000;
            this.left = 400;
            this.top = 200;
            this.width = 300;
            this.height = 300;
            this._bottomRender = new UIRenderComponent;
            this.addRender(this._bottomRender);

            this._midRender = new UIRenderComponent;
            this.addRender(this._midRender);

            this._topRender = new UIRenderComponent;
            this.addRender(this._topRender);

            this._topRender.uiAtlas = new UIAtlas();

        }
        public applyLoad(): void {
            this._topRender.uiAtlas.setInfo("pan/marmoset/uilist/colorview/colorview.xml", "pan/marmoset/uilist/colorview/colorview.png", () => { this.loadConfigCom() });
        }
        private c_tittle: UICompenent;
        private c_mainper: UICompenent;
        private c_out_color: UICompenent;
        private c_color_txt_bg: UICompenent;
        private c_close: UICompenent
        private loadConfigCom(): void {
            this._bottomRender.uiAtlas = this._topRender.uiAtlas
            this._midRender.uiAtlas = this._topRender.uiAtlas;
            this.c_tittle = this.addEvntBut("c_tittle", this._bottomRender)
            this.addChild(<UICompenent>this._bottomRender.getComponent("c_bg"));
            this.c_color_txt_bg = this.addChild(<UICompenent>this._midRender.getComponent("c_color_txt_bg"));
      
            this.c_main_color = this.addEvntBut("c_main_color", this._midRender)
            this.c_panel_color = this.addEvntBut("c_panel_color", this._midRender)
            this.c_close = this.addEvntBut("c_close", this._topRender)

            
            this.c_mainper = this.addChild(<UICompenent>this._topRender.getComponent("c_mainper"));
            this.c_pickImg = this.addChild(<UICompenent>this._topRender.getComponent("c_pickImg"));
            this.c_out_color = this.addChild(<UICompenent>this._topRender.getComponent("c_out_color"));


            this.c_text_info= this.addChild(this._topRender.getComponent("c_text_info"));
            this.c_text_a =  this.addChild(this._topRender.getComponent("c_text_a"));
            this.c_text_b = this.addChild(this._topRender.getComponent("c_text_b"));
            this.c_text_g = this.addChild(this._topRender.getComponent("c_text_g"));
            this.c_text_r =  this.addChild(this._topRender.getComponent("c_text_r"));

            this.drawMainColor();
           // this.initColor();
            this.c_main_color.addEventListener(InteractiveEvent.Move, this.onMainColorMove, this);
            this.c_panel_color.addEventListener(InteractiveEvent.Move, this.onPanelColorMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUiStageUp, this);

            this.applyLoadComplete();
        }
        private c_text_r: UICompenent;
        private c_text_g: UICompenent;
        private c_text_b: UICompenent;
        private c_text_a: UICompenent;
        private c_text_info: UICompenent;


        private c_pickImg: UICompenent;
        private _currentMainPer: number;
        private _perX: number;
        private _perY: number;
        private changeFun: Function
        public initColor(value: Vector3D, $bfun: Function): void {
            this.changeFun = $bfun
            var $baseColorV3d: Vector3D = new Vector3D(random(255), random(255), random(255))
            if (value) {
                $baseColorV3d = value
            }
            var hsb: Vector3D = this.rgb2hsb($baseColorV3d);
            if (isNaN(hsb.x)) {
                hsb.x = 0;
            }
            this._currentMainPer = hsb.x / 360;
            this.changePanelColor(this._currentMainPer);
            this._perX = hsb.y;
            this._perY = 1 - hsb.z;
            this.showColor(this._perX, this._perY);
            this.showColorTxt(this._perX, this._perY);
        }
        private showColor($perx: number, $pery: number): void {
            this.c_pickImg.x = 150 * $perx + this.c_panel_color.x - 10;
            this.c_pickImg.y = 150 * $pery + this.c_panel_color.y - 10;
        }
        private showColorTxt($perx: number, $pery: number): void {
            this._perX = $perx;
            this._perY = $pery;
            var cx: number = (255 * (1 - $perx) + this.mainColor.x * $perx) * (1 - $pery);
            var cy: number = (255 * (1 - $perx) + this.mainColor.y * $perx) * (1 - $pery);
            var cz: number = (255 * (1 - $perx) + this.mainColor.z * $perx) * (1 - $pery);
            this.drawStrToUi(this.c_text_r, String(Math.floor(cx)));
            this.drawStrToUi(this.c_text_g, String(Math.floor(cy)));
            this.drawStrToUi(this.c_text_b, String(Math.floor(cz)));
            this.drawStrToUi(this.c_text_a, String(Math.floor(100)));
            this.drawStrToUi(this.c_text_info, "#ff99cc");

      
            this.drawOutColor(new Vector3D(cx, cy, cz))
        }
        private getHtxColor(value: number): string {
            return ""
        }
        private drawStrToUi($ui: UICompenent, $str: string): void {
            this._topRender.uiAtlas.writeSingleLabel($ui.skinName, ColorType.Whiteffffff+ $str);
        }
        private drawOutColor($vcolor: Vector3D = null): void {
            var $UIAtlas: UIAtlas = this._topRender.uiAtlas
            var rec: UIRectangle = $UIAtlas.getRec(this.c_out_color.skinName);
            var ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
            var $imgData: ImageData = ctx.getImageData(0, 0, rec.pixelWitdh, rec.pixelHeight);
            for (var i: number = 0; i < $imgData.data.length / 4; i++) {
                $imgData.data[i * 4 + 0] = $vcolor.x;
                $imgData.data[i * 4 + 1] = $vcolor.y;
                $imgData.data[i * 4 + 2] = $vcolor.z;
                $imgData.data[i * 4 + 3] = 255;
            }
            ctx.putImageData($imgData, 0, 0)
            TextureManager.getInstance().updateTexture($UIAtlas.texture, rec.pixelX, rec.pixelY, ctx);


            this._outColorVect = $vcolor;

        }
        protected onUiStageUp(evt: InteractiveEvent): void {
            this.c_main_color.data = false;
            this.c_panel_color.data = false

        }
        protected onMainColorMove(evt: InteractiveEvent): void {
            if (this.c_main_color.data) {
                var $cur: number = ((evt.x - this.left) - this.c_main_color.x) / this.c_main_color.width;
                $cur = Math.max(Math.min(1, $cur), 0);
                this.changePanelColor($cur);
                this.showColorTxt(this._perX, this._perY);
                this.changeFun && this.changeFun(this._outColorVect)
            }
        }
        private _outColorVect: Vector3D
        private onPanelColorMove(evt: InteractiveEvent): void {
            if (this.c_panel_color.data) {
                var $curX: number = ((evt.x - this.left) - this.c_panel_color.x) / this.c_panel_color.width;
                var $curY: number = ((evt.y - this.top) - this.c_panel_color.y) / this.c_panel_color.height;
                this._perX = $curX;
                this._perY = $curY;
                this.showColor(this._perX, this._perY);
                this.showColorTxt(this._perX, this._perY);
                this.changeFun && this.changeFun(this._outColorVect)
            }
        }
        public rgb2hsb(color: Vector3D): Vector3D {

            var rgbR: number = Math.floor(color.x);
            var rgbG: number = Math.floor(color.y);
            var rgbB: number = Math.floor(color.z);

            var rgb: Array<number> = [rgbR, rgbG, rgbB];
            rgb.sort(function (aa: number, bb: number): number {
                return aa - bb;
            })

            var max: number = rgb[2];
            var min: number = rgb[0];

            var hsbB: number = max / 255.0;
            var hsbS: number = max == 0 ? 0 : (max - min) / max;

            var hsbH: number = 0;
            if (max == rgbR && rgbG >= rgbB) {
                hsbH = (rgbG - rgbB) * 60 / (max - min) + 0;
            } else if (max == rgbR && rgbG < rgbB) {
                hsbH = (rgbG - rgbB) * 60 / (max - min) + 360;
            } else if (max == rgbG) {
                hsbH = (rgbB - rgbR) * 60 / (max - min) + 120;
            } else if (max == rgbB) {
                hsbH = (rgbR - rgbG) * 60 / (max - min) + 240;
            }

            return new Vector3D(hsbH, hsbS, hsbB);
        }
        private mainColor: Vector3D
        private changePanelColor($per: number): void {
            this.c_mainper.x = this.c_main_color.x + this.c_main_color.width * $per - this.c_mainper.width / 2;
            this.c_mainper.y = this.c_main_color.y - 10;
            var per: number = $per * 6;
            var index: number = Math.floor(per);
            per = per - index;
            var color1: Vector3D = hexToArgb(this.maincary[index], false);
            var color2: Vector3D = hexToArgb(this.maincary[index + 1], false);
            color1.scaleBy(1 - per);
            color2.scaleBy(per);
            color1 = color1.add(color2);

            this.mainColor = color1;
            var num: number = this.argbToHex16(color1.x, color1.y, color1.z);
            this.drawPanelColor(color1);
        }
        public argbToHex16(r: number, g: number, b: number): number {
            var color: number = r << 16 | g << 8 | b;
            return color;
        }
        private c_panel_color: UICompenent;
        private drawPanelColor($vcolor: Vector3D = null): void {
            var $UIAtlas: UIAtlas = this._topRender.uiAtlas
            var rec: UIRectangle = $UIAtlas.getRec(this.c_panel_color.skinName);
            var ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
            ctx.clearRect(0, 0, rec.pixelWitdh, rec.pixelHeight)
            var $imgData: ImageData = ctx.getImageData(0, 0, rec.pixelWitdh, rec.pixelHeight);

            var beColor: Vector3D = new Vector3D(255, 255, 255, 255);
            var toColor: Vector3D = new Vector3D(255, 0, 0, 255);
            if ($vcolor) {
                toColor = $vcolor;
            }
            var adColor: Vector3D = new Vector3D(toColor.x - beColor.x, toColor.y - beColor.y, toColor.z - beColor.z)
            for (var i: number = 0; i < $imgData.width; i++) {
                for (var j: number = 0; j < $imgData.width; j++) {
                    var $slot: number = (i * $imgData.width + j) * 4;
                    var $speed: number = (j / $imgData.width)
                    $imgData.data[$slot + 0] = beColor.x + adColor.x * $speed;
                    $imgData.data[$slot + 1] = beColor.x + adColor.y * $speed;
                    $imgData.data[$slot + 2] = beColor.x + adColor.z * $speed;

                    $imgData.data[$slot + 0] *= 1 - (i / $imgData.height);
                    $imgData.data[$slot + 1] *= 1 - (i / $imgData.height);
                    $imgData.data[$slot + 2] *= 1 - (i / $imgData.height);
                    $imgData.data[$slot + 3] = 255;
                }
            }
            ctx.putImageData($imgData, 0, 0)
            TextureManager.getInstance().updateTexture($UIAtlas.texture, rec.pixelX, rec.pixelY, ctx);
        }
        private maincary: Array<number> = [0xFF0000, 0xFFFF00, 0x00FF00, 0x00FFFF, 0x0000FF, 0xFF00FF, 0xFF0000];
        private drawMainColor(): void {
            var $UIAtlas: UIAtlas = this._topRender.uiAtlas
            var rec: UIRectangle = $UIAtlas.getRec(this.c_main_color.skinName);
            var ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D(rec.pixelWitdh, rec.pixelHeight, false);
            var grad: CanvasGradient = <CanvasGradient>(ctx.createLinearGradient(0, 0, rec.pixelWitdh, rec.pixelHeight));
            for (var i: number = 0; i < this.maincary.length; i++) {
                var $p: Vector3D = hexToArgb(this.maincary[i], false);
                grad.addColorStop(i / (this.maincary.length - 1), "rgb(" + $p.x + "," + $p.y + ", " + $p.z + ")");    //   
            }
            ctx.fillStyle = grad;
            ctx.rect(0, 0, rec.pixelWitdh, rec.pixelHeight);
            ctx.fill();
            TextureManager.getInstance().updateTexture($UIAtlas.texture, rec.pixelX, rec.pixelY, ctx);
        }
        private c_main_color: UICompenent;
        protected butClik(evt: InteractiveEvent): void {
            switch (evt.target) {
                case this.c_tittle:
                    this.addStageMoveEvets(evt)
                    break;
                case this.c_main_color:
                    this.c_main_color.data = true
                    break
                case this.c_panel_color:
                    this.c_panel_color.data = true
                    break
                case this.c_close:
                    ModuleEventManager.dispatchEvent(new ColorEvent(ColorEvent.HIDE_COLOR_PANEL));
                    break

                    
                default:
                    break;
            }
        }

        private lastPanelPos: Vector2D;
        private mouseXY: Vector2D;
        private addStageMoveEvets($e: InteractiveEvent): void {
            this.lastPanelPos = new Vector2D(this.left, this.top);
            this.mouseXY = new Vector2D($e.x, $e.y)
            Scene_data.uiStage.addEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.addEventListener(InteractiveEvent.Up, this.onUp, this);

        }
        private onMove($e: InteractiveEvent): void {
            this.left = this.lastPanelPos.x + ($e.x - this.mouseXY.x) / UIData.Scale;
            this.top = this.lastPanelPos.y + ($e.y - this.mouseXY.y) / UIData.Scale;
            this.resize();

        }
        private onUp($e: InteractiveEvent): void {
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Move, this.onMove, this);
            Scene_data.uiStage.removeEventListener(InteractiveEvent.Up, this.onUp, this);
        }

    }
}