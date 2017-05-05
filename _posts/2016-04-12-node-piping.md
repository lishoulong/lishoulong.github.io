---
layout: post
title: node piping plugin
---

<br>piping
<br>There are already node "wrappers" that handle watching for file changes and restarting your application (such as node-supervisor), as well as reloading on crash, but I wasn't fond of having that. Piping adds "hot reloading" functionality to node, watching all your project files and reloading when anything changes, without requiring a "wrapper" binary.

        if (__DEVELOPMENT__) {
          if (!require('piping')({
              hook: true,
              //hook (boolean): Whether to hook into node's "require" function and only watch required files. Defaults to false, which means piping will watch all the files in the folder in which main resides. The require hook can only detect files required after invoking this module!
              ignore: /(\/\.|~$|\.json|\.scss$)/i
              //ignore (regex): Files/paths matching this regex will not be watched. Defaults to /(\/\.|~$)/
            })) {
            return;
          }
        }
