meteor-sitemap-creator
======================

Package for generating server side XML sitemaps.


## How to use (with iron:router)

- Define a sitemap route for iron:router.
```javascript

	// Sitemap route
	this.route('sitemap', {
		path: 'sitemap.xml',
		// HAS TO BE on the server.
		where: 'server'
	});

```
- Sweet, now add an action method for the sitemap route. Create a collection of the data you want for the sitemap, and pass the collection to the SitemapCreator.createXMLSitemap( collection, rootUrl, mapMethodCallback ) method along with your rootUrl. The collection you pass must only contain items which has the keys `loc` (required), `lastmod`, `priority` and `changefreq`. If the collection items contain more keys (or not the required `loc`) an error will be thrown.

```javascript

	action: function () {
			
		// Let's get some stuff from MongoDB!
		// (This can just be an array with whatever though.)
		// (And don't forget the .fetch() if you're using MongoDB!)
		var collectionOfPages = YourWebsitesPages.find(
			{ status: "live" },
			{ fields: { url: 1, updatedDate: 1, sitemapPrio: 1 } }
			).fetch();

		var collectionForXMLcreation = _( collectionOfPages ).map( function ( page ) {
			// This map method will prepare a new array of items for the actual XML creation.
			// You'll have to provide a "loc" value, the rest of the keys them are optional.
			// You can NOT provide any other keys, only these four!
			return {
				loc: page.url,
				lastmod: new Date( page.updatedDate ),
				priority: page.sitemapPrio,
				changefreq: 'monthly'
			};
		});
      
		// Pass the collection aloing with a rootUrl string and a map method callback.
		// The xmlSitemap var will contain the XML for the sitemap!
		var xmlSitemap = SitemapCreator.createXMLSitemap( collectionForXMLcreation, 'http://www.your-root-url.com' );
		
		// Write the response from the server!
		this.response.writeHead(200, {'Content-Type': 'text/xml'});
		this.response.end( xmlSitemap );
			
	}

```
- Now navigate to your site and go to /sitemap.xml (or whatever route you chose for your sitemap) and enjoy your sweet sweet sitemap.


## Stuff to think about

- The sitemap will be ordered by 1. priorty 2. lastmod.
- Every item in the sitemap must have a unique loc value. Failing this will throw an error.


## Bugs etc.

This was created in very little time, and bugs are probably bound to be discover. Please let me konw in the issues if that happens! :)
