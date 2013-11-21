ENV = (window.location.port) ? "development" : "production";

require.config({
  baseUrl: "/public/js/",
  paths: {
      moment: "../lib/momentjs/moment"
    , domReady: "../lib/requirejs-domready/domReady"
  }
});

var scripts = {
  "production" : ["moment","domReady!"],
  "development" : ["moment","domReady!","livereload"]
};

require(scripts[ENV], function(moment) {

  var moments = document.getElementsByClassName("moment");

  for(var i=0, len=moments.length; i<len; i++) {
    var m = moments[i];
    var fromNow = moment(m.innerText).fromNow();
    m.innerHTML = fromNow;
  }

  var anchors = document.getElementsByTagName("a");
  for(var i=0, len=anchors.length; i<len; i++) {
    var a = anchors[i];
    if(a.dataset.eventName) {
      a.addEventListener("click", function(e) {
        analytics.track(a.dataset.eventName, a.dataset.eventValue, a.dataset.eventContext);
      });
    }
  }

  var shareTwitter = document.getElementsByClassName("share_twitter")[0];

  shareTwitter.addEventListener("click", function(e) {
    e.preventDefault();
    analytics.track('share_twitter', window.location.href, 'footer');
    var url = 'http://twitter.com/intent/tweet?text='+encodeURIComponent(window.document.title)+'&via=xdamman&url='+encodeURIComponent(window.location.href);
    var w = 640, h=440;
    var left = (screen.width/2)-(w/2);
    var top = (screen.height/2)-(h/2)-100;
    window.open(url, "share_twitter", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
    return false;
  });
});
