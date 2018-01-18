class GameInstance {
    public static mainChar: SceneChar;
    public static attackTarget: SceneChar;
    public static tb_map: tb.TB_map;

    public static threeBattarId:number
    public static initData(): void
    {
        this.threeBattarId=0
    }


    private static getModelUrl(name: string): string {
         return "lyf/" + name + getBaseUrl() + ".txt";
    }
    //单独在场景播放特效

    private static allStr:string=""
    public  static playLyf($str: string, $pos: Vector3D ): void {
        GroupDataManager.getInstance().getGroupData(Scene_data.fileRoot + this.getModelUrl($str), (groupRes: GroupRes) => {
            for (var i: number = 0; i < groupRes.dataAry.length; i++) {
                var item: GroupItem = groupRes.dataAry[i];
                if (item.types == BaseRes.SCENE_PARTICLE_TYPE) {
                    var $particle: CombineParticle = ParticleManager.getInstance().getParticleByte(Scene_data.fileRoot + item.particleUrl);
                    $particle.setPos($pos.x, $pos.y, $pos.z);
                  //  $particle.rotationY=random(360)
                    ParticleManager.getInstance().addParticle($particle);
                  //  console.log("添加一次");
                    $particle.addEventListener(BaseEvent.COMPLETE, this.onPlayCom, this);
                    console.log($particle.sourceData.maxTime, $str)
                  //  TweenMoveTo($particle, 2.3, { x: -200 });

                    if ($particle.sourceData.maxTime > 10000000) {
                        this.allStr += $str;
                        this.allStr += ",";
                        console.log(this.allStr);
                    }
                } else {
                    console.log("播放的不是单纯特效");
                }
            }
        })
    }
    private static onPlayCom(event: BaseEvent): void {
        var $particle: any = event.target;
      //  console.log("移除")
        $particle.removeEventListener(BaseEvent.COMPLETE, this.onPlayCom, this);
        ParticleManager.getInstance().removeParticle($particle);
    }

}