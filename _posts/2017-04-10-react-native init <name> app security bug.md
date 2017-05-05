---
layout: post
title: react-native init <name> app security bug
---

Use the react-native cli to init a new project, but when run the project, I encounter a bug, that referrer have no provide of js bundle URL; After google, I find many person encounter this problem, so I post the solution here.

I find the react-native init ,silently set the App Transport Security in the info.plist using the Exception Domains, this is where incurring the problem.

Actually you can just add the NSAppTransportSecurity dictionary, and then create the NSAllowsArbitraryLoads item with the value to be "YES". Then it will run smoothly.
