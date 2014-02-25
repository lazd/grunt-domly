this["JST"] = this["JST"] || {};

this["JST"]["NewName"] = (function() {
  var frag;
function anonymous(data_0) {
    var frag = document.createDocumentFragment();
    var data = data_0;
    var el0 = document.createTextNode("I'm a basic template, yippee!");
    frag.appendChild(el0);
    return frag;
}
  return function template() {
    if (!frag) {
      frag = anonymous();
    }
    return frag.cloneNode(true);
  };
}());