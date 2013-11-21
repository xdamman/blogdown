ENV = (window.location.port) ? "development" : "production";

require.config({
  baseUrl: "/public/js/",
  paths: {
    moment: "../lib/momentjs/moment"
  }
});

var scripts = {
  "production" : ["moment"],
  "development" : ["livereload","moment"]
};

require(scripts[ENV], function() {
   var moments = document.getElementsByClassName("moment");
   for(var i=0, len=moments.length; i<len; i++) {
    var m = moments[i];
    var fromNow = moment(m.innerText).fromNow();
    m.innerHTML = fromNow;
   }

   var shareTwitter = document.getElementsByClassName("share_twitter")[0];
   shareTwitter.addEventListener("click", function(e) {
     e.preventDefault();
     var url = 'http://twitter.com/intent/tweet?text='+encodeURIComponent(window.document.title)+'&via=xdamman&url='+encodeURIComponent(window.location.href);
     var w = 640, h=440;
     var left = (screen.width/2)-(w/2);
     var top = (screen.height/2)-(h/2)-100;
     window.open(url, "share_twitter", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
     return false;
   });
});

function freeImagesFromParagraph() {

  var paragraphs = document.getElementsByTagName("p");
  ap=null, img=null;
  for(var i=0, len=paragraphs.length; i<len; i++) {
    var p = paragraphs[i];
    if(p.childElementCount == 1 && p.children[0].tagName == "IMG") {
      img = p.children[0];
      p.parentElement.insertBefore(img,p);
      p.remove();
    }
  }

}

// freeImagesFromParagraph();
