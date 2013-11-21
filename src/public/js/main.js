ENV = (window.location.port) ? "development" : "production";

require.config({
  baseUrl: "/public/js/",
  paths: {
  }
});

var scripts = {
  "production" : [],
  "development" : ["livereload"]
};

require(scripts[ENV]);

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
