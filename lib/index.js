var path = require('path');
var fs = require('fs');

var _config = {};

function getProjectRoot() {
    var node_modules = path.sep + 'node_modules' + path.sep;
    var pos = __dirname.indexOf(node_modules);
    if (pos > -1)
        return __dirname.substring(0, pos);

    return process.cwd();
}

function cloneArray(arr) {
    return arr.map(e => {
        if (Array.isArray(e)) {
            return cloneArray(e);
        }

        if (typeof e === "object") {
            const res = {};
            assignDeep(e, res);
            return res;
        }

        return e;
    });
}

function assignDeep(fromObj, toObj) {
    Object.keys(fromObj).forEach(function (k) {
        var sourceValue = fromObj[k];
        if (Array.isArray(sourceValue)) {
            toObj[k] = cloneArray(sourceValue);
        } else if (typeof sourceValue === 'object')
            assignDeep(sourceValue, toObj[k] || (toObj[k] = {}));
        else
            toObj[k] = sourceValue;
    });
}

function init() {
    var projectRootDir = getProjectRoot();
    var configDir = path.join(projectRootDir, process.env.NODE_CONFIG_PATH || 'config');

    if (!fs.existsSync(configDir))
        return;

    var configFiles = fs.readdirSync(configDir);
    var defaultFile = configFiles.find(cf => cf.toLowerCase() === "default.json");

    if (defaultFile) {
        _config = require(path.join(configDir, defaultFile));
    }

    var currentEnvConfigFile, currentEnvConfig, nodeEnv = process.env.NODE_ENV;
    if (nodeEnv) {
        currentEnvConfigFile = configFiles.find(cf => path.basename(cf, ".json").toLowerCase() === nodeEnv.toLowerCase());

        if (!currentEnvConfigFile)
            return;

        currentEnvConfig = require(path.join(configDir, currentEnvConfigFile));
        assignDeep(currentEnvConfig, _config);
    }
    Object.freeze(_config);
}

init();

module.exports = {
    get: function (key) {
        if (!key)
            return;

        if ((key.indexOf(".") === -1) && process.env[key])
            return process.env[key];

        var keys = key.split('.');
        var result;
        for (var i = 0; i < keys.length; i++) {
            if (i === 0)
                result = _config[keys[i]];
            else if (result)
                result = result[keys[i]]
        }

        return result;
    },
    getAll: function () {
        var res = {};
        assignDeep(_config, res);
        return res;
    }
}