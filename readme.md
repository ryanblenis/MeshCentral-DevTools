# MeshCentral-DevTools

*Released: 2019-11-24*

Tools to aid plugin developers for the [MeshCentral2](https://github.com/Ylianst/MeshCentral) Project.

## Installation

 Pre-requisite: First, make sure you have plugins enabled for your MeshCentral installation:
>     "plugins": {
>          enabled: true
>     },
Restart your MeshCentral server after making this change.

 To install, simply add the plugin configuration URL when prompted:
 `https://raw.githubusercontent.com/ryanblenis/MeshCentral-DevTools/master/config.json`

## Features
- Inject a plugin to the database without a URL
- Force Refresh the PluginHandler
- Edit a plugin config directly
- Remove a plugin config from the database
- Restart the server