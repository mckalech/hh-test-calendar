require.config 
	paths : 
	    underscore : "../libs/underscore/underscore"
	    jquery : "../libs/jquery/dist/jquery.min"
	    backbone : "../libs/backbone/backbone"
	    text : "../libs/requirejs-text/text"
	    handlebars : "../libs/handlebars/handlebars.amd.min"
	shim: 
		underscore : 
            exports: '_'
        backbone :
            deps: ['underscore', 'jquery']
            exports: 'Backbone'

require ['jquery', 'calendar'], ($ , CalendarView) ->
	$ ->
		new CalendarView()
		return  
	return


