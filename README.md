# ember-cli-remote-inspector

Lets you inspect apps running on different devices/browsers over the network using websockets.

## Usage

* `npm install --save-dev ember-cli-remote-inspector`
* Run `ember serve` from your project root.
* Visit `localhost:30820` to open up the inspector
* Visit `localhost:4200` from another browser.
* Magic.

![image](https://cloud.githubusercontent.com/assets/3824616/4604177/d23ecb70-518a-11e4-8443-65fe58f59e1f.png)


## Options

* `remoteDebug` (bool) Enable/disable remote debugging. Defaults to **true** in development.
* `remoteDebugHost` What host should the inspector run on. This hostname/ip should be accessible over the network. Defaults to **localhost**.
* `remoteDebugPort` What port should the inspector run on. Default: **30820**

## Credits

Much love goes out to @teddyzeeny and the other people working on the [ember inspector](https://github.com/emberjs/ember-inspector) for making this an easy job. Also credits to @rwjblue and @stefanpenner for ember-cli (addons).
