# What is this?

It's a no nonsense configuration setup module for node.js projects. 
It's very lightweight and has absolutely no dependencies on any third party packages.

# How to use it?

It follows a very simple and intuitive convention, it looks for a directory name `config` in the root folder of your project, you can change this by setting `NODE_CONFIG_PATH` env variale value to a custom relative path (relative to the root directory of your project).

You can put configuration files in `JSON` format in the `config` directory. By default if there is a config file present in the directory named `default.json` then it will be treated as the base config file.

You can have environment specific config files which map to the value of `NODE_ENV` environment variable. For example if you have `default.json`, `dev.json` and `prod.json` files present in the config folder and you have set `NODE_ENV` env variable to `dev` then, config system will be initialised with all the settings present in the `default.json` and additional settings will be added/overwritten by the values pesent in the `dev.json`.

## Example

considering you have following `default.json`

```json
{
    "profile": {
        "name": "xyz",
        "age":10
    },
    "connectionString": "abc"
}
```

and `dev.json` is:

```json
{
    "profile: {
        "age": 48,
        "email": "123@somewhere.com"
    },
    "connectionString": "efg"
}
```
considering you have set `NODE_ENV` to `dev`, you can access the setting as follows:

```javascript
var config = require('config');

var name = config.get('profile.name');
//xyz
var age = config.get('profile.age');
//48
var email = config.get('profile.email');
//"123@somewhere.com"

var conStr = config.get('connectionString');
//efg
```


