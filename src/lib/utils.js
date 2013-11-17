module.exports = {

  getFileExtension: function(file) {
    return file.substr(file.lastIndexOf('.')+1);
  },

  getFileName: function(file) {
    return file.substr(0,file.lastIndexOf('.'))
  }

};
