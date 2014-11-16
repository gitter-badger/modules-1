# hAzzle Modules

[![Build Status](https://secure.travis-ci.org/hazzlejs/modules.png?branch=master)](http://travis-ci.org/hazzlejs/modules)

A collection of various / modules plug-ins for the **hAzzleJS library**.

The difference between **hAzzle** and other Javascript libraries is that **hAzzle** has no support for plug-ins. Everything are modules wrapped in a closure with a return object.

This gives you the freedom to create new modules fast, and if you know native javascript - well, to use **hAzzle** shouldn't be a problem.

I give here a few modules to show some of the posibilities that **hAzzle** has. They are not so advanced, but you can create it if you want.

To create advanced modules, you will need to include different modules to the **Core** that is not part of the hAzzle **Core** itself. You will find them in the **/modules** folder in the hAzzleJS repo.

#####Here is some needed modules you should include:

* dimensions.js ( position, heigh, width, media queries, scrollbars, viewport e.g.)

* style.js  ( same as in other Javascript libraries)

* events.js

Scrollbar, view panels, tree panels, sliders e.g. are all easy to create with **hAzzle** if you use the **dimensions.js** module. All values and calculations are done for you, and returned in a **px** unit.

Modules included
----------------

* outerHTML
* timeago
* cookie
* password
* json
