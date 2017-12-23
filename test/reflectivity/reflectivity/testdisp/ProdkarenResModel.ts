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
                    var $jpgurl: string = $url.replace(".txt", ".jpg")
                    console.log($jpgurl)
                    TextureManager.getInstance().addRes($jpgurl, d);
                    var etimg: any = evt.target;
                    URL.revokeObjectURL(etimg.src);
                    TextureManager.getInstance().getTexture($jpgurl, $fun);
                }
                d.src = e

            });
    }
    public loadBuffByTxtUrl($url: string, $fun: Function): void {
        LoadManager.getInstance().load($url, LoadManager.XML_TYPE,
            ($dtstr: string) => {
                var configText: Array<string> = $dtstr.split(",");
                var $dataArr: Array<number> = new Array()
                for (var i: number = 0; i < configText.length ; i++) {
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
}