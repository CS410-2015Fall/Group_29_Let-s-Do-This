// fixtures need to be loaded before mock-ajax.js is run

jasmine.getFixtures().fixturesPath = 'base/test/javascripts/fixtures/';
preloadFixtures("myfixture.html","profilefixture.html", "createuserfixture.html", "editprofilefixture.html", "loginfixture.html");