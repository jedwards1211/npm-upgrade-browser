# npm-upgrade-browser

[![CircleCI](https://circleci.com/gh/jedwards1211/npm-upgrade-browser.svg?style=svg)](https://circleci.com/gh/jedwards1211/npm-upgrade-browser)
[![Coverage Status](https://codecov.io/gh/jedwards1211/npm-upgrade-browser/branch/master/graph/badge.svg)](https://codecov.io/gh/jedwards1211/npm-upgrade-browser)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![npm version](https://badge.fury.io/js/npm-upgrade-browser.svg)](https://badge.fury.io/js/npm-upgrade-browser)

This is an awesome UI for upgrading packages in your project. It shows you changelogs for newer versions of each package, lets you select versions, and install the selected versions, all from your browser.

![Package View Screenshot](/screenshots/package-view.png)

![Apply Upgrades View screenshot](/screenshots/apply-upgrades-view.png)

# Requirements

The code is only built for Node 10+ and recent browsers, because I assume you
(being a developer) use an up-to-date browser and version of node.

# Usage

```
cd ~/your-project
npx npm-upgrade-browser
```

`npm-upgrade-browser` will start a server on an open port, and open the UI in your
browser.
