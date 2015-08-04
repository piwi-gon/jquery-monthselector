<<<<<<< HEAD
# jQuery Widget monthSelectorWidget

this plugin/widget is used to build a Month-Selector on a given selector

## Usage

1. Include jQuery:

	```html
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min.js"></script>
	```

2. Include plugin's code:

	```html
	<link rel="stylesheet" href="dist/css/monthselector.css">
	<script src="dist/js/jquery.monthselector.widget.js"></script>
	```

3. Call the plugin:

	```javascript
	$("#element").monthSelectorWidget();
	```

## Structure

The basic structure of the project is given in the following way:

```
├── demo/
│   ├── index.html
│   ├──css/
│   │  └──demo.css
│   ├──images/
│   │  └──16x16/
│   │     ├─ arrow_left.png
│   │     └─ arrow_right.png
├── dist/
│   ├── css/
│   │  └── monthselector.css
│   └── js/
│      └── jquery.monthselector.widget.js
├── src/
│   ├── css/
│   │  └── monthselector.css
│   └── js/
│      └── jquery.monthselector.widget.js
├── .jshintrc
├── Gruntfile.js
├── bower.json
└── package.json


#### [demo/](https://github.com/jquery-boilerplate/boilerplate/tree/master/demo)

Contains a simple HTML file to demonstrate your plugin.

#### [dist/](https://github.com/jquery-boilerplate/boilerplate/tree/master/dist)

This is where the generated files are stored once Grunt runs.

#### [src/](https://github.com/jquery-boilerplate/boilerplate/tree/master/src)

Contains the files responsible for your plugin, you can choose between JavaScript or CoffeeScript.

