class ProdkarenResModel {
    private static _instance: ProdkarenResModel;
    public static getInstance(): ProdkarenResModel {
        if (!this._instance) {
            this._instance = new ProdkarenResModel();
        }
        return this._instance;
    }

    public loadTexturelByBoldUrl($url: string, $fun: Function): void {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE,
            ($data: string) => {
                var _stritem = $data.split(",")
                var imgAryBuffer: ArrayBuffer = new ArrayBuffer(_stritem.length);
                var bdata = new Uint8Array(imgAryBuffer);
                for (var i: number = 0; i < _stritem.length; i++) {
                    bdata[i] = Number(_stritem[i])
                }
                var useImgData = bdata
                var d: any = new Image();
                var a = new Blob([useImgData], {
                    type: "image/jpeg"
                });
                var e = URL.createObjectURL(a);
                d.onload = (evt: Event) => {


                    var $img = d
                    var $textureRect: Rectangle = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
                    var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($textureRect.width, $textureRect.height, false);
                    $ctx.scale(1, -1)
                    $ctx.drawImage($img, 0, 0, $textureRect.width, $textureRect.height, 0, 0, $textureRect.width, -$textureRect.height);
                    var $textureRes = new TextureRes()
                    $textureRes.texture = Scene_data.context3D.getTexture($ctx.canvas, 0, 0)
                    $textureRes.width = $img.width;
                    $textureRes.height = $img.height;
                    $textureRes.useNum = 1
                    $ctx.scale(1, 1)
                    $fun($textureRes)


                }
                d.src = e

            });
    }
    public loadSkyTextureByUrl($url: string, $fun: Function): void {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE,
            ($dtstr: string) => {
                var configText: Array<string> = $dtstr.split(",");
                var $dataArr: Array<number> = new Array();

                for (var i: number = 0; i < configText.length; i++) {
                    $dataArr.push(Number(configText[i]))
                }
                var $textureRes = new TextureRes()
                $textureRes.texture = this.loadArray(new Uint8Array($dataArr), null, null)
                $textureRes.width = 256;
                $textureRes.height = 2048;
                $textureRes.useNum = 1
                $fun($textureRes)
            });

    }
    private loadArray(a: Uint8Array, b: Uint8Array, c: Uint8Array): WebGLTexture {

        var gl: WebGLRenderingContext = Scene_data.context3D.renderContext
        var $texture: WebGLTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, $texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, !0);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 256, 2048, 0, gl.RGBA, gl.UNSIGNED_BYTE, a)

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.bindTexture(gl.TEXTURE_2D, null)
        return $texture
    }
    public loadBuffByTxtUrl($url: string, $fun: Function): void {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE,
            ($dtstr: string) => {
                var configText: Array<string> = $dtstr.split(",");
                var $dataArr: Array<number> = new Array()
                for (var i: number = 0; i < configText.length; i++) {
                    $dataArr.push(Number(configText[i]))
                }
                console.log($dataArr.length)
                var $buffData: WebGLBuffer = Scene_data.context3D.renderContext.createBuffer();
                Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, $buffData);
                Scene_data.context3D.renderContext.bufferData(Scene_data.context3D.renderContext.ARRAY_BUFFER, new Uint8Array($dataArr), Scene_data.context3D.renderContext.STATIC_DRAW);
                Scene_data.context3D.renderContext.bindBuffer(Scene_data.context3D.renderContext.ARRAY_BUFFER, null);

                $fun($buffData)
            });
    }
    private renderContext: WebGLRenderingContext;


    public flectAlphaByUrl(rgburl: string, alphaurl: string, $fun: Function): void {
        LoadManager.getInstance().load(rgburl, LoadManager.XML_TYPE,
            ($rgbstr: string) => {
                var $rgbItem: Array<number> = this.getArrByStr($rgbstr)
                LoadManager.getInstance().load(alphaurl, LoadManager.XML_TYPE,
                    ($alphastr: string) => {
                        var $alphaItem: Array<number> = this.getArrByStr($alphastr)
                        this.getImageDataByItemData($rgbItem, ($rgbimageData: ImageData) => {
                            this.getImageDataByItemData($alphaItem, ($alphaimageData: ImageData) => {

                                for (var i = 0; i < $rgbimageData.data.length; i += 4) {
                                    $rgbimageData.data[i + 3] = $alphaimageData.data[i + 0];
                                    //$rgbimageData.data[i + 0] = $alphaimageData.data[i + 0];
                                    //$rgbimageData.data[i + 1] = $alphaimageData.data[i + 0];
                                    //$rgbimageData.data[i + 2] = $alphaimageData.data[i + 0];
                                    /*
                                                if ((i / 4) % 2 == 0) {
                                                    $rgbimageData.data[i + 0] = 255;
                                                    $rgbimageData.data[i + 1] = 0;
                                                    $rgbimageData.data[i + 2] = 0;
                                                    $rgbimageData.data[i + 3] = 255;
                                                } else {
                                                    $rgbimageData.data[i + 0] = 255;
                                                    $rgbimageData.data[i + 1] = 255;
                                                    $rgbimageData.data[i + 2] = 255;
                                                    $rgbimageData.data[i + 3] =255;
                                                }
                                                */

                                }
                                var $textureRes = new TextureRes();

                                $textureRes.texture = this.getTexture($rgbimageData)
                                $textureRes.width = $rgbimageData.width;
                                $textureRes.height = $rgbimageData.height;
                                $textureRes.useNum = 1;
                                $fun && $fun($textureRes);
                            });
                        });

                    });
            });
    }
    public getTexture($img: any): WebGLTexture {
        // $mipmap=0
        this.renderContext = Scene_data.context3D.renderContext
        var $textureRect: Rectangle = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
        var textureObject: WebGLTexture = this.renderContext.createTexture();
        this.renderContext.bindTexture(this.renderContext.TEXTURE_2D, textureObject);
        this.renderContext.texImage2D(this.renderContext.TEXTURE_2D, 0, this.renderContext.RGBA, this.renderContext.RGBA, this.renderContext.UNSIGNED_BYTE, $img);



        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_MAG_FILTER, this.renderContext.LINEAR);
        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_MIN_FILTER, this.renderContext.LINEAR_MIPMAP_LINEAR);

        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_WRAP_S, this.renderContext.CLAMP_TO_EDGE);
        this.renderContext.texParameteri(this.renderContext.TEXTURE_2D, this.renderContext.TEXTURE_WRAP_T, this.renderContext.CLAMP_TO_EDGE);

        this.renderContext.generateMipmap(this.renderContext.TEXTURE_2D);

        return textureObject;
    }
    private getImageDataByItemData($numItem: Array<number>, $fun: Function): void {
        var imgAryBuffer: ArrayBuffer = new ArrayBuffer($numItem.length);
        var bdata = new Uint8Array(imgAryBuffer);
        for (var i: number = 0; i < $numItem.length; i++) {
            bdata[i] = Number($numItem[i])
        }
        var useImgData = bdata
        var d: any = new Image();
        var a = new Blob([useImgData], {
            type: "image/jpeg"
        });
        var e = URL.createObjectURL(a);
        d.onload = (evt: Event) => {
            var $img = d
            var $textureRect: Rectangle = new Rectangle(0, 0, Math.pow(2, Math.ceil(Math.log($img.width) / Math.log(2))), Math.pow(2, Math.ceil(Math.log($img.height) / Math.log(2))));
            var $ctx: CanvasRenderingContext2D = UIManager.getInstance().getContext2D($textureRect.width, $textureRect.height, false);
            $ctx.scale(1, 1)
            $ctx.drawImage($img, 0, 0, $textureRect.width, $textureRect.height, 0, 0, $textureRect.width, $textureRect.height);
            var $imageData: ImageData = $ctx.getImageData(0, 0, $textureRect.width, $textureRect.height)
            $ctx.scale(1, 1)
            $fun && $fun($imageData)

        }
        d.src = e
    }
    private getArrByStr($dtstr: string): Array<number> {
        var configText: Array<string> = $dtstr.split(",");
        var $dataArr: Array<number> = new Array()
        for (var i: number = 0; i < configText.length; i++) {
            $dataArr.push(Number(configText[i]))
        }
        return $dataArr
    }

}