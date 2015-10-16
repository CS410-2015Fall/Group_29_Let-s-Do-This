//Big thanks to levbrie for this one
//https://github.com/levbrie/mighty_marks/blob/master/yelp-business-sample.html
$(document).ready(function() {
  console.log('Yelp Script Loading');
  $.getScript("js/yelpScripts/oauth.js"); //OAuth Help
  $.getScript("js/yelpScripts/sha1.js"); //Hash Algo help
  $.getScript("js/yelpScripts/prettyprint.js"); //Script to display results
});

function searchYelp(city, distance, term, sortBy){
  var query = ""; //The running query

  var limit = 10; //Number of businesses to return
  query = query.concat("limit=" + limit);
  //After this you should include an & at the start of your concat
  if(city!="" && (typeof city=='string')){ //Check if the user specified the city/and ensure it is a string
    query = query.concat("&location=" + city.replace(' ', '+')); //Must replace spaces with a +
  }else{
    query = query.concat("&location=vancouver"); //Temporary default to Vancouver
  }
  if(distance!="" && (typeof distance=='number')){ //Check if the user specified the distance/and ensure it is a string
    query = query.concat("&radius_filter=" + distance);
  }
  if(term!="" && (typeof term=='string')){ //Check if the user specified the name/and ensure it is a string
    query = query.concat("&term=" + term.replace(' ', '+')); //Must replace spaces with a +
  }
  if(sortBy!="" && (typeof sortBy=='number')){ //Check if the user specified a sort order
    // 0=Best matched (default), 1=Distance, 2=Highest Rated
    query = query.concat("&sort=" + sortBy);
  }

  //Finally, make the call to yelp
  console.log("Query: " + query);
  makeCall(query);
}

function makeCall (query){
  var auth = {
    consumerKey : "fWy0OS47UomZ6u0tukwu8Q",
    consumerSecret : "tOtfhQ0iM4qxWCDt575AKVvbEbo",
    accessToken : "dF-qWXTTvmDE2zr2f3YQ0upfijevm_DL",
    /* Apparently you shouldn't drop your accessTokenSecret in like this.
    *  Which makes sense, I mean it is a secret, but
    *  "How am I ever gonna get to be old and wise
    *  If I ain't ever young and crazy?"
    */
    accessTokenSecret : "RBD9-rdfWqIAb69C2zDUtgXXTIw",
    serviceProvider : {
      signatureMethod : "HMAC-SHA1"
    }
  };
  var accessor = {
    consumerSecret : auth.consumerSecret,
    tokenSecret : auth.accessTokenSecret
  };
  parameters = [];
  parameters.push(['callback', 'cb']);
  parameters.push(['oauth_consumer_key', auth.consumerKey]);
  parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
  parameters.push(['oauth_token', auth.accessToken]);
  parameters.push(['oauth_signature_method', 'HMAC-SHA1']);
  //Constuct the search url
  var root = 'http://api.yelp.com/v2/search?';
  var finalQuery = root.concat(query);

  var message = {
    'action' : finalQuery.valueOf(),
    'method' : 'GET',
    'parameters' : parameters
  };
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)

  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'cache' : true,
    'dataType' : 'jsonp',
    'jsonpCallback' : 'cb',
    'success' : function(data, textStats, XMLHttpRequest) {
      console.log(data);
      var output = prettyPrint(data);
					$("#mainContent").append(output);
    }
  });
}
