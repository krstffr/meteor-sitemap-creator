meteor-sitemap-creator
======================

Package for generating server side XML sitemaps.


## How to use (with iron:router)

1. Define a sitemap route for iron:router.
```javascript

  // Sitemap route
	this.route('sitemap', {
		path: 'sitemap.xml',
		// HAS TO BE on the server.
		where: 'server'
	});

```
2. Sweet, now add an action method for the sitemap route. Create a collection of the data you want for the sitemap, and pass the collection to the SitemapCreator.createXMLSitemap( collection, rootUrl, mapMethodCallback ) method along with your rootUrl and a callback map method (which will iterate over all your passed collection items and return a new array of items).
```javascript

		action: function () {
			
			// Let's get some stuff from MongoDB!
			// (This can just be an array with whatever though.)
      // (And don't forget the .fetch() if you're using MongoDB!)
			var collectionOfPages = YourWebsitesPages.find(
				{ status: "live" },
				{ fields: { url: 1, updatedDate: 1, sitemapPrio: 1 } }
				).fetch();
      
      // Pass the collection aloing with a rootUrl string and a map method callback.
      // The xmlSitemap var will contain the XML for the sitemap!
			var xmlSitemap = SitemapCreator.createXMLSitemap( collectionOfPages, 'http://www.your-root-url.com', function ( page ) {
			  // This callback will return the items for the actual XML creation.
			  // You'll have to provide a loc key/value, the rest of them are optional.
			  // You can NOT provide any other keys, only these four.
				return {
					loc: page.url,
					lastmod: new Date( page.updatedDate ),
					priority: page.sitemapPrio,
					changefreq: 'monthly'
				};
			});
      
      // Write the response from the server!
			this.response.writeHead(200, {'Content-Type': 'text/xml'});
			this.response.end( xmlSitemap );
			
		}

```
3. Now navigate to your site and go to /sitemap.xml (or whatever route you chose for your sitemap) and enjoy your sweet sweet sitemap.


## Stuff to think about

- You have to proivde a loc key/value for every item from the callback method.
- You must not pass any other keys than loc, lastmod, priority or changefreq. Doing so will throw an error.


## Bugs etc.

This was created in very little time, and bugs are probably bound to be discover. Please let me konw in the issues if that happens! :)
