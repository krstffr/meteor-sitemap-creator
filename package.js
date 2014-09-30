Package.describe({
  summary: "Package for generating server side XML sitemaps.",
  version: "0.0.1",
  git: "https://github.com/krstffr/meteor-sitemap-creator",
  name: "krstffr:sitemap-creator"
});

Package.onUse(function (api) {

	api.versionsFrom("METEOR@0.9.0");

  api.use('underscore', 'server');

  api.add_files('sitemap-creator.js', 'server');

  // The main object.
  api.export('SitemapCreator', 'server');

});
