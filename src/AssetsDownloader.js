
const utils = require('./Utils');

const OTA_PATH = "ota";


AssetsDownloader = cc.Class.extend({
    constructor: function(manifestFile, storagePath){
        self = this;
        self._manifestFileName = manifestFileName;
        self._storagePath = storagePath;
        self._assetsManager = null;
        self._localManifest = null;
        self._assetsListener = null;
    },

    checkToDownload: function(remoteVersion){
        var localVersion = self._getLocalVersion();
        if(localVersion && self._compareVersion(localVersion, remoteVersion) >= 0)  // 远端版本不比本地版本更新，不用更新
            return false;

        self._download();
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
         self._assetsManager = new jsb.AssetsManager(self._manifestFileName, self._storagePath, 0);
         self._assetsManager.retain()
         self._localManifest = self._assetsManager.getLocalManifest()
         if(!self._localManifest.isLoaded()){
            cc.log("Download failed: local manifest isn't loaded!");
            return;
         }

        self._addAssetsManagerListener();
        self._assetsManager.update();
    },

    _addAssetsManagerListener: function(){
        self._assetsListener = new jsb.EventListenerAssetsManager(self._assetsManager, function(event){
            switch(event.getEventCode()){
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    cc.log("Download failed: no local manifest!");
                    break;
                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    cc.log("Download failed: already up to date!");
                    break;
                case jsb.EventAssetsManager.UPDATE_FAILED:
                    cc.log("Download failed: already up to date!");
                    break;
            }
        })
        cc.eventManager.addListener(self._assetsListener, 1);
    },

    _getLocalVersion: function(){
        manifestFileName = jsb.fileUtils.getWritablePath() + "/" + OTA_PATH + "/project.manifest";
        if (!jsb.fileUtils.isFileExists(manifestFileName)){
            manifestFileName = self._manifestFileName;
        }

        manifest = utils.loadJson(manifestFileName);
        if(manifest)
            return manifest.version;
        else
            return '';
    }
})
    


module.exports = AssetsDownloader

