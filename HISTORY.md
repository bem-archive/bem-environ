1.2.1 / 2013-08-29
==================

  * Fix crash when `libraries` key is not specified in config

1.2.0 / 2013-08-01
==================

  * `bem-environ` now exports function to set global root

    Sample usage from `.bem/make.js`:

    ```js
    var environ = require('bem-environ')(__dirname);
    ```

  * Changed API of extending nodes of `bem make`

    Sample usage from `.bem/make.js`:

    ```js
    var environ = require('bem-environ')(__dirname);
    environ.extendMake(MAKE);
    ```

1.1.0 / 2013-07-19
==================

  * Drop peerDependencies from bem

1.0.1 / 2013-07-15
==================

  * Bugs fixed

1.0.0 / 2013-07-09
==================

  * Code converted to separate to NPM-module

0.2.0 / 2013-06-27
==================

  * Dependencies target renamed: "vendor" -> "libs"

0.1.1 / 2013-05-28
==================

  * "Arch" node fixed
  * configs/current -> configs/current.js

0.1.0 / 2013-05-28
==================

  * Initial
