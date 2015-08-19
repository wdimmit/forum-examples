var THEME = require('themes/sample/theme');
var SCROLLER = require('mobile/scroller');
var SCREEN = require('mobile/screen');

/* ASSETS */
var blackSkin = new Skin({ fill: 'black',});
var whiteSkin = new Skin({ fill: 'white',});
var yellowSkin	= new Skin({ fill: 'yellow'});
var blueSkin = new Skin({fill: 'blue'})
var separatorSkin = new Skin({ fill: 'silver',});

/* STYLES */
var productNameStyle = new Style({  font: 'bold 22px', horizontal: 'left', vertical: 'middle', lines: 1, });
var productDescriptionStyle = new Style({  font: '18px', horizontal: 'left', vertical: 'middle', left: 1, color: 'white' });

/* STATIC */
/* A simple array of objects. Each will be used as a single
 * entry in our scrollable list. */
var menuItems = [
    	{title: 'Pentium', button: 'P5'},
    	{title: 'Pentium MMX', button: 'Tillamook'},
    	{title: 'Pentium Pro', button: 'P6'},
    	{title: 'Pentium II', button: 'Klamath'},
    	{title: 'Pentium III', button: 'Coppermine'},
    	{title: 'Pentium IV', button: 'Prescott'},
    	{title: 'Pentium M', button: 'Dothan'},
    	{title: 'Core Duo', button: 'Yonah'},
    	{title: 'Core 2 Duo', button: 'Penryn'},
    	{title: 'Core i7', button: 'Sandy Bridge'}
    	];

/* This is a template that will be used to for each entry populating the list. 
 * Note that it is anticipating an object each time in is instanciated */
var ProcessorLine = Line.template(function($) { return { left: 0, right: 0, active: true, skin: THEME.lineSkin, 
    behavior: Object.create(Behavior.prototype, {
    	/* Gives the user some visual feedback on which entry they have tapped.
    	 * note that the skin is reverted to white in onTouchEnded() */    	 
    	onTouchBegan: { value: function(container, id, x,  y, ticks) {
    		container.skin = yellowSkin;
    	}},
    	/* Traces out the value of the first Label's string. The
    	 * silly string of "first" in the trace can be thought of as
    	 * container.Column.Container.Label.string.  This pattern can
    	 * be seen reading down the contents of this object below */
    	onTouchEnded: { value: function(container, id, x,  y, ticks) {	
			container.skin = whiteSkin;
			trace(container.first.first.first.string+"\n");
		}}
    }),
	contents: [
     	Column($, { left: 0, right: 0, contents: [
     		Container($, { left: 4, right: 4, height: 52, 
     			contents: [
     			           /* This label expects that the object passed to ProcessorLine() 
     			            * includes a value for title.  Note that this Label is not marked
     			            * as active. Touches registered here will bubble back up to the
     			            * nested objects until it hits one which is active. */
     			           Label($, { left: 10, style: productNameStyle, string: $.title,}),
     			           /* This label is expecting a value for button.  Note that this Label
     			            * is marked active.  Touches registered here will be handeled here */
     			           Label($, { right: 10, style: productDescriptionStyle, skin: blueSkin, active: true, string: $.button,
     			               behavior: Object.create(Behavior.prototype, {
     			           		    	/* When this label is touched, simply trace out its string.
     			           		    	 * Note that no chain of "first" is needed here because the
     			           		    	 * touch happened in the object that contains the property
     			           		    	 * we want to trace */
     			           		    	onTouchEnded: { value: function(label, id, x,  y, ticks) {	
											trace(label.string+"\n");
										}}
								})
     			           }), 
 			           ], 
	           }),
     		Line($, { left: 0, right: 0, height: 1, skin: separatorSkin, }),
     	], }),
     ], 
 }});


var ScrollerBehavior = SCROLLER.VerticalScrollerBehavior({
    snap: function(scroller, position, direction) {
        var itemHeight = 120;
        if (direction < 0)
            position = itemHeight * Math.ceil(position / itemHeight);
        else if (direction > 0)
            position = itemHeight * Math.floor(position / itemHeight);
        else
            position = itemHeight * Math.round(position / itemHeight);
        trace("In snap\n");
        return position;
    }
});

/* This is template for a container which takes up the
 * whole screen.  It contains only a single object,
 * the SCROLLER.VerticalScroller.  Although we are not
 * referencing any values from an object passed on creation,
 * an object is still required as the SCROLLER uses it internally. */
var ScreenContainer = Container.template(function($) { return {
	left:0, right:0, top:0, bottom:0,
	contents: [
	   		/* Note that the scroller is declared as having only an empty
	   		 * Column and a scrollbar.  All the entries will be added 
	   		 * programmatically. */ 
	   		SCROLLER.VerticalScroller($, { 
	   			behavior: ScrollerBehavior,
	   			contents: [
              			Column($, { left: 0, right: 0, top: 0, name: 'menu', }),
              			SCROLLER.VerticalScrollbar($, { }),
              			]
	   		})
	   		]
	}});

var data = new Object();
var screen = new ScreenContainer(data);

/* This simple function exists so we can call "forEach" on
 * our array of list entries (menuItems).  It adds a new 
 * ProcessorLine() object to the Column named "menu" in the
 * screen object's SCROLLER */
function ListBuilder(element, index, array) {
	screen.first.menu.add(new ProcessorLine(element));
}

application.behavior = Object.create(Object.prototype, {
	onLaunch: { value: function(application) {
		/* Call ListBuilder for each element in our array of
		 * list items.*/
		menuItems.forEach(ListBuilder);
		application.add(screen);
	}}
});