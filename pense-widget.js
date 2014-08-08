/**
 * javascript library to embed
 * the pense widget in another
 * location
 *
 * @autor Iuri Andreazza
 */
 
var pw = pw || (function(){
	
	//Private vars
	var scriptName = "pense-widget.js"; //Scriptname
	var scriptTag; //reference to the html script tag
	
	/******** Get reference to self (scriptTag) *********/
    var allScripts = document.getElementsByTagName('script');
    var targetScripts = [];
    for (var i in allScripts) {
        var name = allScripts[i].src
        if(name && name.indexOf(scriptName) > 0)
            targetScripts.push(allScripts[i]);
    }
 
    scriptTag = targetScripts[targetScripts.length - 1];
	
	// ===============================
	// Loading scripts anychronously
	//
	// Usage: getScript('script.js', function() { /* callback */ });
	// ===============================
	var getScript = function(url,success){
	    var script = document.createElement('script');
	    script.src = url;
	    script.async = true;
	    var head = document.getElementsByTagName('head')[0], done=false;
	    script.onload = script.onreadystatechange = function(){
	        if (!done && (!this.readyState || this.readyState == 'loaded' || this.readyState == 'complete')) {
	            done=true;
	            if(success)
	            	success();
	            script.onload = script.onreadystatechange = null;
	            head.removeChild(script);
	        }
	    };
	    head.appendChild(script);
	};
	
	var each = function (arr, fnc) {
	    var data = [];
	    for (i = 0; i < arr.length; i++)
	        data.push(fnc(arr[i]));
	    return data;
	};
	
	// deparam
	//
	// Inverse of $.param()
	//
	// Taken from jquery-bbq by Ben Alman
	// https://github.com/cowboy/jquery-bbq/blob/master/jquery.ba-bbq.js
	 
	var isArray = Array.isArray || function(obj) {
	  return Object.prototype.toString.call(obj) == '[object Array]';
	};
	 
	var deparam = function( params, coerce ) {
	  var obj = {},
	  coerce_types = { 'true': !0, 'false': !1, 'null': null };
	 
	  // Iterate over all name=value pairs.
	  each( params.replace( /\+/g, ' ' ).split( '&' ), function(v, j){
	    var param = v.split( '=' ),
	    key = decodeURIComponent( param[0] ),
	    val,
	    cur = obj,
	    i = 0,
	 
	    // If key is more complex than 'foo', like 'a[]' or 'a[b][c]', split it
	    // into its component parts.
	    keys = key.split( '][' ),
	    keys_last = keys.length - 1;
	 
	    // If the first keys part contains [ and the last ends with ], then []
	    // are correctly balanced.
	    if ( /\[/.test( keys[0] ) && /\]$/.test( keys[ keys_last ] ) ) {
	      // Remove the trailing ] from the last keys part.
	      keys[ keys_last ] = keys[ keys_last ].replace( /\]$/, '' );
	 
	      // Split first keys part into two parts on the [ and add them back onto
	      // the beginning of the keys array.
	      keys = keys.shift().split('[').concat( keys );
	 
	      keys_last = keys.length - 1;
	    } else {
	      // Basic 'foo' style key.
	      keys_last = 0;
	    }
	 
	    // Are we dealing with a name=value pair, or just a name?
	    if ( param.length === 2 ) {
	      val = decodeURIComponent( param[1] );
	 
	      // Coerce values.
	      if ( coerce ) {
	        val = val && !isNaN(val)            ? +val              // number
	        : val === 'undefined'             ? undefined         // undefined
	        : coerce_types[val] !== undefined ? coerce_types[val] // true, false, null
	        : val;                                                // string
	      }
	 
	      if ( keys_last ) {
	        // Complex key, build deep object structure based on a few rules:
	        // * The 'cur' pointer starts at the object top-level.
	        // * [] = array push (n is set to array length), [n] = array if n is 
	        //   numeric, otherwise object.
	        // * If at the last keys part, set the value.
	        // * For each keys part, if the current level is undefined create an
	        //   object or array based on the type of the next keys part.
	        // * Move the 'cur' pointer to the next level.
	        // * Rinse & repeat.
	        for ( ; i <= keys_last; i++ ) {
	          key = keys[i] === '' ? cur.length : keys[i];
	          cur = cur[key] = i < keys_last
	          ? cur[key] || ( keys[i+1] && isNaN( keys[i+1] ) ? {} : [] )
	          : val;
	        }
	 
	      } else {
	        // Simple key, even simpler rules, since only scalars and shallow
	        // arrays are allowed.
	 
	        if ( isArray( obj[key] ) ) {
	          // val is already an array, so push on the next value.
	          obj[key].push( val );
	 
	        } else if ( obj[key] !== undefined ) {
	          // val isn't an array, but since a second value has been specified,
	          // convert val into an array.
	          obj[key] = [ obj[key], val ];
	 
	        } else {
	          // val is a scalar.
	          obj[key] = val;
	        }
	      }
	 
	    } else if ( key ) {
	      // No value was defined, so set something meaningful.
	      obj[key] = coerce
	      ? undefined
	      : '';
	    }
	  });
	 
	  return obj;
	};
	
	
	// ===============================
	// Loading Query String
	//
	// Usage: parseQueryString('http://test.com?a=1&b=2');
	// ===============================
	var parseQueryString = function(url) {
		  var a = document.createElement('a');
		  a.href = url;
		  str = a.search.replace(/\?/, '');
		  return deparam(str, true /* coerce values, eg. 'false' into false */);
	};
	
	var info = parseQueryString(scriptTag.src);
	
	getScript("../lib/handlebars-v1.3.0.js");
	getScript("../lib/zepto.min.js", function(){ pw.init(); });
	
	pwo = {
		
		debug : true,
		
		params : info,
			
		config : {
			cssClassPrefix 	: "",
			
			search_box 	: "search-box",
			list_box 	: "list",
			anuncio_box : "anuncio",
		},
			
		// ===============================
		// Initialize lib
		//
		// Usage: pw.init([configuration])
		// ===============================
		init : function(config){
			//Load Lib
			
			if(config){
				this.applyConfig(config);
			}
			
			//Auto init widget
			
			//Apenas inicializar se tiver o parametro type
			if(this.params.type){
				//Search box
				if(this.params.type == 'search')
					this.showSearchBox();
				//list from search
				if(this.params.type == 'list')
					this.showList();
				//Anuncio detail
				if(this.params.type == 'anuncio')
					this.showAnuncio();
			}
			
		},
		
		
		// ===============================
		// Apply Configuration to widget
		//
		// Usage: pw.appyConfig(configuration)
		// ===============================
		appyConfig : function(config){
			
		},
		
		// ===============================
		// TODO
		//
		// Usage: pw.showList()
		// ===============================
		showList : function(){},
		
		// ===============================
		// TODO
		//
		// Usage: pw.showAnuncio()
		// ===============================
		showAnuncio : function(){},
		
		// ===============================
		// Render the Search Box
		//
		// Usage: pw.showSearchBox()
		// ===============================
		showSearchBox : function(){
			var parentContainer = $(scriptTag).parent();
			if(this.params.element_id){
				$("#"+this.params.element_id);
			}
			if(parentContainer){
				$.ajax({
				      url: '../templates/search-box.html',
				      dataType: 'html',
				      cache: false,
				      context: this,
				      success: function(data, status, response) {
				        source = data;
				        var template    = Handlebars.compile(response.responseText);
				        var context = {
				          title: 'Static Title (to be replaced)'
				        };
				        $(parentContainer).append($("<span id="+this.params.hash+"-"+this.config.search_box+"></span>").html(template(context)));
				      }
				});
			}
		}
	};
	return pwo;
	
}());