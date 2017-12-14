var SoundManager = /** @class */ (function () {
    function SoundManager() {
        this.init = false;
        this._volume = 1.0;
        this._skillSoundDic = new Object;
        this._skillVolume = 1.0;
    }
    SoundManager.getInstance = function () {
        if (!this._instance) {
            this._instance = new SoundManager();
        }
        return this._instance;
    };
    SoundManager.prototype.playSound = function () {
        this.initSound();
        this.audio.play();
    };
    SoundManager.prototype.initSound = function () {
        if (this.init) {
            return;
        }
        this.audio = new Audio('res/sound/sound_3521.mp3');
        this.audio.loop = true;
        this.audio.volume = this._volume;
        this.audio.play();
        this.init = true;
    };
    SoundManager.prototype.stopSound = function () {
    };
    SoundManager.prototype.setVolume = function (val) {
    };
    SoundManager.prototype.setSkillVolume = function (val) {
    };
    SoundManager.prototype.playSkillSound = function ($name) {
    };
    return SoundManager;
}());
//# sourceMappingURL=SoundManager.js.map