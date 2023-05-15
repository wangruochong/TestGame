/****************************************************************************
 Copyright (c) 2017-2018 Xiamen Yaji Software Co., Ltd.
 
 http://www.cocos2d-x.org
 
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 
 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.
 
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/


var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();
        
        this._initData();
        this._initUi();
        this._updateState()
        return true;
    },

    _initData: function(){
        this._state = 0;  // 0: 未更新；1: 更新中；2: 更新完成；3: 错误
        this._progress = 0;
        if (cc.sys.isNative)
            this._checkToDownload();
    },

    _initUi: function(){
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        var versionLabel = new cc.LabelTTF("version:1.0", "Arial", 20);
        versionLabel.setAnchorPoint(cc.p(0, 0));
        versionLabel.x = 15;
        versionLabel.y = 15;
        this.addChild(versionLabel, 5);

        this._updateLabel = new cc.LabelTTF("ota progress", "Arial", 20);
        this._updateLabel.setAnchorPoint(cc.p(0, 0));
        this._updateLabel.x = 15;
        this._updateLabel.y = 40;
        this.addChild(this._updateLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite("res/HelloWorld.png");
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });

        this.button = new cc.Sprite("res/btn_2.png");
        this.button.attr({
            x: size.width / 2,
            y: 70
        });

        this.addChild(this.sprite, 0);
        this.addChild(this.button, 0);
    },

    _checkToDownload: function(){
        AssetsDownloader = require("./AssetsDownloader");
        storagePath = cc.path.join(jsb.fileUtils.getWritablePath(), "ota");
        otaManifestPath = cc.path.join(storagePath, "project.manifest");
        manifestPath = jsb.fileUtils.isFileExist(otaManifestPath) ? otaManifestPath : "manifests/project.manifest";
        this._assetsDownloader = new AssetsDownloader(manifestPath, storagePath, this);
        this._state = this._assetsDownloader.checkToDownload("1.1")?1:0;
    },

    _updateState: function(){
        this._updateLabel.setVisible(this._state > 0);
        if (this._state == 0)
            return;

        stateStr = "ota ";
        switch(this._state){
            case 1:
                stateStr += "progress: " + this._progress;
                break;
            case 2:
                stateStr += "succeed"
                break;
            case 3:
                stateStr += "ERROR!!!"
                break;
        }

        this._updateLabel.setString(stateStr);
    },

    onSuccess: function(){
        this._updateState();
    },

    onProgress: function(progress){
        this._progress = progress;
        this._updateState();
    },

    onError: function(errorCode){
        this._updateState();
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});


module.exports = HelloWorldScene

