# ember-cli-remote-inspector

Lets you inspect apps running on different devices/browsers over the network using websockets.

**Warning: Still a work in progress**

## Options

* `remoteDebug` (bool) Enable/disable remote debugging. Defaults to **true** in development.
* `remoteDebugHost` What host should the inspector run on. This hostname/ip should be accessible over the network. Defaults to **localhost**.
* `remoteDebugPort` What port should the inspector run on. Default: **30820**

## Credits

Much love goes out to @teddyzeeny and the other people working on the [ember inspector](https://github.com/emberjs/ember-inspector) for making this an easy job. Also credits to @rwjblue and @stefanpenner for ember-cli (addons).