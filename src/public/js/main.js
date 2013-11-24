ENV = (window.location.port) ? "development" : "production";

var scripts = {
  "production" : ["analytics","domReady!", "timeago!"],
  "development" : ["analytics","domReady!","timeago!", "livereload"]
};

require(scripts[ENV], function(timeago, analytics) {

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
