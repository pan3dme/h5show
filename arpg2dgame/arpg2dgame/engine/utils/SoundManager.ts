class SoundManager {
    
    constructor() {
        
    }

    private static _instance: SoundManager;
    public static getInstance(): SoundManager {
        if (!this._instance) {
            this._instance = new SoundManager();
        }
        return this._instance;
    }
    private init:boolean = false;
    private audio:any;
    private _volume:number = 1.0;
    public playSound():void{
        this.initSound();
        this.audio.play();
    }

    public initSound():void{
        if(this.init){
            return;
        }

        this.audio = new Audio('res/sound/sound_3521.mp3');
        this.audio.loop = true;
        this.audio.volume = this._volume;
        this.audio.play();

        this.init = true;
    }

    public stopSound(): void{

  
    }

    public setVolume(val:number):void{

    }

    public setSkillVolume(val:number):void{
 
    }

    private _skillSoundDic:any = new Object;
    private _skillVolume:number = 1.0;
    public playSkillSound($name:string):void{
      
    }
}