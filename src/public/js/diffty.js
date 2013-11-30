define(['jsdiff','md5'], function(jsdiff, md5) {
  console.log("jsdiff: ",jsdiff);

  var options = {
    elements: document.getElementsByTagName('div')
  };

  var init = function(el) {
    el.originalContent = el.innerHTML;
    el.contentEditable = true;

    el.onblur = function() {
      var content = this.getNewContent();
      var diff = jsdiff.diffChars(this.originalContent, content); 

      if(diff.length == 1) {
        this.changed = false
        return;
      }

      this.changed = true;
      var nc = '';
      for(var j=0;j<diff.length; j++) {
        if(diff[j].added)
          nc += '<span class="diffty-added">'+diff[j].value+'</span>';
        else if(diff[j].removed)
          nc += '<span class="diffty-removed">'+diff[j].value+'</span>';
        else
          nc += diff[j].value;
      }
      console.log("New content: ",nc);
      this.innerHTML = nc;
      this.getDiff();
    };

    el.getNewContent = function() {
      var content = this.innerHTML;
      content = content.replace(/<span class="diffty-added">(.*?)<\/span>/g,'$1');
      content = content.replace(/<span class="diffty-removed">(.*?)<\/span>/g,'');
      return content;
    };

    el.getDiff = function() {
      var filename = this.baseURI + '#' + md5(this.originalContent);
      console.log("Filename: ",filename);
      var diff = jsdiff.createPatch(filename, this.originalContent, this.getNewContent());
      console.log("Diff: ", diff);
      return diff;
    };

    el.applyDiff = function(diff) {
      var content = jsdiff.applyPatch(this.originalContent, diff);
      this.innerHTML = content;
    };

  };

  for(var i=0; i<options.elements.length; i++) {
    var el = options.elements[i];
    init(el);
  }

});
