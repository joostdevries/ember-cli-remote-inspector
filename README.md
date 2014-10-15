# ember-cli-remote-inspector

Lets you inspect apps running on different devices/browsers over the network using websockets.

**Warning: Still a work in progress**. Tracking development in #1 and emberjs/ember-inspector#243

## Usage

* (Untill officialy released) add `"ember-cli-remote-inspector":"joostdevries/ember-cli-remote-inspector"` to your `package.json`
* Run `ember serve` from your project root.
* Visit `localhost:30820` to open up the inspector
* Visit `localhost:4200` from another browser.
* Magic.

![image](https://cloud.githubusercontent.com/assets/3824616/4603940/da53f6d8-517f-11e4-96d0-022eae5a4579.png)
![image](https://cloud.githubusercontent.com/assets/3824616/4604177/d23ecb70-518a-11e4-8443-65fe58f59e1f.png)


* If no magic occurs, you might need to add `ws://localhost:30820 http://localhost:30820` to your `"connect-src"` for the [CSP addon](https://github.com/rwjblue/ember-cli-content-security-policy)


## Options

* `remoteDebug` (bool) Enable/disable remote debugging. Defaults to **true** in development.
* `remoteDebugHost` What host should the inspector run on. This hostname/ip should be accessible over the network. Defaults to **localhost**.
* `remoteDebugPort` What port should the inspector run on. Default: **30820**

## Known issues

* Ember-Debug doesn't always work properly on Mobile Safari. I'm tracking this down and will include a fix in the PR I've got open at ember-inspector.

## Credits

Much love goes out to @teddyzeeny and the other people working on the [ember inspector](https://github.com/emberjs/ember-inspector) for making this an easy job. Also credits to @rwjblue and @stefanpenner for ember-cli (addons).
