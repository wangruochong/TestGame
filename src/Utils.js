var Utils = {};


Utils.loadJson = function (jsonFile){
    jsonData = null;
    cc.loader.loadJson(jsonFile, function(error, data){
        if(error)
            return;

        jsonData = data;
    })

    return jsonData;
};


module.exports = Utils

