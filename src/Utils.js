var Utils = {};


Utils.loadJson = function (jsonFile){
    jsonData = null;
    cc.loader.loadJson(jsonFile, function(error, data){
        if(error){
            cc.log("Error when loading json " + jsonFile);
            cc.error(error.stack);
            return;
        }

        jsonData = data;
    })

    return jsonData;
};


module.exports = Utils

