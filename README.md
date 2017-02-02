# What is this?

It's a no nonsense configuration setup module for node.js projects. 
It's very lightweight and has absolutely no dependencies on any third party packages.

# How does it work?

It follows a very simple and straight forward convention, it looks for a directory name `config` in the root folder of your project, you can ofcourse change this to be any directory by setting `NODE_CONFIG_PATH` env variale value to respective directory path, which should be relative to your project root directory.

You can put configuration files in `JSON` format in the `config` directory. You can choose the name of the config file to be anything, at the runtime module checks the value of `NODE_ENV` environment variable and will try to resolve the config file based on it's value. By default if there is a config file present in the directory named `default.json` then it will be treated as the base config file, this is absolutely optional you might choose to not have any `default.json` file which will work without any issues.

For example, if you have following files in you config directory:
```.
├── default.json
├── development.json
├── local.json
├── production.json
└── qa.json
```
and you have `NODE_ENV` env variale set to `qa` then all the settings present in the `default.json` will be taken first and then all the settings present in the `qa.json` would be applied on top of it, in which case addition settings will be added, settings with the same `key` would be overwritten and missing setting would be carried from the `default.json`.

# Quick Start

Add the dependency using `npm` like you might have done million times already:

```
npm install tiny-config --save
mkdir config
```

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
    "profile": {
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

var all = config.getAll()
//Will return all the settings 
```


