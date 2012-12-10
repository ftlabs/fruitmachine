# fruitmachine

Assembles dynamic views on the client and server

## Getting Started
### On the server
Install the module with: `npm install fruitmachine`

```javascript
var fruitmachine = require('fruitmachine');
fruitmachine.awesome(); // "awesome"
```

### In the browser
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/wilsonpage/fruitmachine/master/dist/fruitmachine.min.js
[max]: https://raw.github.com/wilsonpage/fruitmachine/master/dist/fruitmachine.js

In your web page:

```html
<script src="dist/fruitmachine.min.js"></script>
<script>
awesome(); // "awesome"
</script>
```

In your code, you can attach fruitmachine's methods to any object.

```html
<script>
this.exports = Bocoup.utils;
</script>
<script src="dist/fruitmachine.min.js"></script>
<script>
Bocoup.utils.awesome(); // "awesome"
</script>
```

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](http://gruntjs.com/).

_Also, please don't edit files in the "dist" subdirectory as they are generated via grunt. You'll find source code in the "lib" subdirectory!_

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Wilson Page  
Licensed under the MIT license.
