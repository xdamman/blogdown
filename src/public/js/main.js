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
