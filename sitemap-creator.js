SitemapCreatorHandler = function () {
	
	var that = this;

	that.requiredSitemapKeys = ['loc'];
	that.approvedSitemapKeys = ['loc', 'lastmod', 'changefreq', 'priority'];
	that.rootUrl = '';

	// Method for preparing values for XML output
	that.prepareXmlString = function (string) {
		// Make sure passed string is a string
		var preparedString = string.toString();
		preparedString = preparedString.replace(/&/g, '&amp;');
		return preparedString;
	};

	// Method for returning number with leading zeros
	that.zeroPad = function (num, numZeros) {
		var n = Math.abs(num);
    var zeros = Math.max(0, numZeros - Math.floor(n).toString().length );
    var zeroString = Math.pow(10,zeros).toString().substr(1);
    if( num < 0 )
      zeroString = '-' + zeroString;
    return zeroString+n;
	};

	// Method for creating lasmod date from Date() objects
	that.createLastmodDate = function ( date ) {
		var dateToOutput = new Date( date );
    return dateToOutput.getFullYear()+
    '-'+that.zeroPad((dateToOutput.getMonth()+1), 2)+
    '-'+that.zeroPad(dateToOutput.getDate(), 2);
	};

	// Method for creating <url> XML rows
	that.createXMLUrlRow = function ( rowData ) {
		
		var stringToReturn = '<url>';

		stringToReturn += _(rowData).map( function( value, key ) {

			// Make sure value is not undefined
			value = value || '';
		
			// Prepare <lastmod> (where needed)
			if (key === 'lastmod' && value.length !== 10 && typeof value === 'object')
				value = that.createLastmodDate( value );

			// Prepare <loc>, add rootUrl if not already added!
			if (key === 'loc' && value.substring(0,4) !== 'http')
				value = that.rootUrl + value;

			key = that.prepareXmlString( key );
			value = that.prepareXmlString( value );

			return '\n<'+key+'>\n'+value+'\n</'+key+'>';

		}).join('\n');

		stringToReturn += '\n</url>';

		return stringToReturn;

	};

	// Method for creating the sitemap XML
	that.createXMLSitemap = function ( collection, rootUrl ) {

		if (!collection)
			throw new Error('You must provide a "collection"!');

		if (typeof collection !== 'object' && collection.length < 1)
			throw new Error('"collection" seems to be empty (or not an array).');

		if (!rootUrl)
			throw new Error('You must provide a "rootUrl"!');

		if (typeof rootUrl !== 'string')
			throw new Error('"rootUrl" is not a string, is: ' + typeof rootUrl );
		
		// Set the rootUrl for this whole object
		that.rootUrl = rootUrl;

		// This test is not super clean, but it should work for now
		var xmlKeys = _( collection[0] ).keys();

		// Make sure all required keys are set
		_.each(that.requiredSitemapKeys, function( requiredKey ){
			if( xmlKeys.indexOf(requiredKey) < 0 )
				throw new Error( requiredKey + ' is not passed, and is required!' );
		});
		
		// Make sure there are only "OK" keys, and nothing else
		var forbiddenXmlKeys = _(xmlKeys).difference( that.approvedSitemapKeys );
		if (forbiddenXmlKeys.length)
			throw new Error('The array produced by "mapMethod( "collection" )" has forbidden keys: ' + forbiddenXmlKeys );

		var locArray = [];
		// Make sure there are not 2 items with the same "loc" value
		_.each(collection, function(xmlItem) {
			if (locArray.indexOf(xmlItem.loc) > -1)
				console.log('Warning from sitemap-creator: duplicate <loc>: ', xmlItem.loc );
			locArray.push( xmlItem.loc );
		});

		// Sort the keys by 1. priority, 2. change date
		collection = _.chain(collection)
		.sortBy(function( xmlItem ){
			if (xmlItem.lastmod)
				return -xmlItem.lastmod;
			return 1;
		})
		.sortBy(function( xmlItem ){
			if (xmlItem.priority)
				return -xmlItem.priority;
			return 1;
		})
		.value();

		// Iterate over all the key/values and return an array (which is then turned into a string by .join('\n') )
		var innerXmlToReturn = _(collection).map( function( xmlRowData ) {
			return that.createXMLUrlRow( xmlRowData );
		}).join('\n');

		return '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+innerXmlToReturn+'</urlset>';
	};

};

SitemapCreator = new SitemapCreatorHandler();