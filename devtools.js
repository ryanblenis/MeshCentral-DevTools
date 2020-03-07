/** 
* @description MeshCentral DevTools Plugin
* @author Ryan Blenis
* @copyright 
* @license Apache-2.0
*/

"use strict";

module.exports.devtools = function (parent) {
    var obj = {};
    obj.parent = parent;
    obj.meshServer = parent.parent;
    obj.VIEWS = __dirname + '/views/';
    
    obj.handleAdminReq = function(req, res, user) {
        if ((user.siteadmin & 0xFFFFFFFF) == 0) { res.sendStatus(401); return; }
        var vars = {};
        res.render(obj.VIEWS + 'admin', vars);
    };
    
    obj.serveraction = function(command, myparent, grandparent) {
        switch (command.pluginaction) {
            case 'addPluginConfig':
                if (command.cfg.status == null) command.cfg.status = 1;
                obj.meshServer.db.addPlugin(command.cfg, function(){
                  obj.meshServer.db.getPlugins(function(err, docs) {
                      try { myparent.ws.send(JSON.stringify({ action: 'updatePluginList', list: docs, result: err })); } catch (ex) { } 
                  });
                });
            break;
            case 'refreshPluginHandler':
                //var mcpath = obj.meshServer.path.join(obj.meshServer.webPublicPath, '../');
                //obj.meshServer.pluginHandler = require(mcpath+'pluginHandler.js').pluginHandler(obj.meshServer);
                var targets = ['*', 'server-users'];
                obj.meshServer.DispatchEvent(targets, obj, { action: 'pluginStateChange' });
            break;
            case 'getPluginConfig':
                obj.meshServer.db.getPlugin(command.id, (err, conf) => {
                    myparent.ws.send(JSON.stringify({ action: 'plugin', plugin: "devtools", method: "loadEditPluginConfig", conf: conf, result: err }));
                });
            break;
            case 'savePluginConfig':
                obj.meshServer.db.updatePlugin(command.id, command.conf, (err, conf) => {
                    obj.meshServer.db.getPlugins(function(err, docs) {
                        try { myparent.ws.send(JSON.stringify({ action: 'updatePluginList', list: docs, result: err })); } catch (ex) { } 
                    });
                });
            break;
            case 'deletePluginConfig':
                obj.meshServer.db.deletePlugin(command.id, (err, conf) => {
                    obj.meshServer.db.getPlugins(function(err, docs) {
                        try { myparent.ws.send(JSON.stringify({ action: 'updatePluginList', list: docs, result: err })); } catch (ex) { } 
                    });
                });
            break;
            case 'restartServer':
                process.exit(123);
            default:
                console.log('PLUGIN: devtools: unknown action');
            break;
        }
    };
    
    return obj;
}