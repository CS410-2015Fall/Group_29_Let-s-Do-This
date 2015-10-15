//Big thanks to levbrie for this one
//https://github.com/levbrie/mighty_marks/blob/master/yelp-business-sample.html
// var OAuthScript = "oauth.js"
$(document).ready(function() {
  console.log('Yelp Script Loaded');
  $.getScript("js/oauth.js"); //OAuth Help
  $.getScript("js/sha1.js"); //Hash Algo help
  console.log('OAuth scripts loaded');
});

function callYelp (){
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
  var message = {
    'action' : 'http://api.yelp.com/v2/business/bay-to-breakers-12k-san-francisco',
    'method' : 'GET',
    'parameters' : parameters
  };
  OAuth.setTimestampAndNonce(message);
  OAuth.SignatureMethod.sign(message, accessor);
  var parameterMap = OAuth.getParameterMap(message.parameters);
  parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
  console.log(parameterMap);
  $.ajax({
    'url' : message.action,
    'data' : parameterMap,
    'cache' : true,
    'dataType' : 'jsonp',
    'jsonpCallback' : 'cb',
    'success' : function(data, textStats, XMLHttpRequest) {
      console.log(data);
      var output = prettyPrint(data);
      $("body").append(output);
    }
  });
}
