
const utils = require('./Utils');

const OTA_PATH = "ota";


AssetsDownloader = cc.Class.extend({
    ctor: function(manifestFileName, storagePath, downloadController){
        this._manifestFileName = manifestFileName;
        this._downloadController = downloadController;
        this._storagePath = storagePath;
        this._assetsManager = null;
        this._localManifest = null;
        this._assetsListener = null;
    },

    checkToDownload: function(remoteVersion){
        if (!cc.sys.isNative)
            return false;

        var localVersion = this._getLocalVersion();
        if(localVersion && this._compareVersion(localVersion, remoteVersion) >= 0)  // 远端版本不比本地版本更新，不用更新
            return false;

        this._download();
        return true;
    },

    _compareVersion: function(version1, version2){
        var version1Nums = version1.split('.');
        var version2Nums = version2.split('.');
        for (var i = 0;i < version1Nums.length;++i){
            var version1Num = parseInt(version1Nums[i]);
            var version2Num = parseInt(version2Nums[i]);
            if(version1Num < version2Num)
                return -1;
            else if(version1Num > version2Num)
                return 1;
            else
                continue;
        }

        return 0;
    },

    _download: function(){
         this._assetsManager = new jsb.AssetsManager(this._manifestFileName, this._storagePath, 0);
         this._assetsManager.retain()
         this._localManifest = this._assetsManager.getLocalManifest()
         if(!this._localManifest.isLoaded()){
            cc.log("Download failed: local manifest isn't loaded!");
            return;
         }

        this._addAssetsManagerListener();
        this._assetsManager.update();
    },

    _addAssetsManagerListener: function(){
        this._assetsListener = new jsb.EventListenerAssetsManager(this._assetsManager, function(event){
            switch(event.getEventCode()){
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    cc.log("Download failed: no local manifest!");
                    this._onError(event);
                    break;
                    
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    cc.log("Download failed: already up to date!");
                    break;
                case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                    cc.log("Download update: " + event.getPercent() / 100);
                    this._onProgress(event);
                    break;
                case jsb.EventAssetsManager.UPDATE_FINISHED:
                    cc.log("Download finished!");
                    this._onSuccess(event)
                case jsb.EventAssetsManager.UPDATE_FAILED:
                    cc.log("Download failed: already up to date!");
                    this._onError(event);
                    break;
                case jsb.EventAssetsManager.ERROR_UPDATING:
                    cc.log("Download failed: error when updating!");
                    this._onError(event);
                    break;
            }
        }.bind(this))
        cc.eventManager.addListener(this._assetsListener, 1);
    },

    _getLocalVersion: function(){
        manifest = utils.loadJson(this._manifestFileName);
        if(manifest)
            return manifest.version;
        else
            return '';
    },

    _onSuccess: function(event){
        this._downloadController.onSuccess();
    },

    _onProgress: function(event){
        this._downloadController.onProgress(event.getPercent());
    },

    _onError: function(event){
        cc.log("Download failed: " + event.getEventCode());
        this._downloadController.onError(event.getEventCode());
    }
})
    

module.exports = AssetsDownloader

