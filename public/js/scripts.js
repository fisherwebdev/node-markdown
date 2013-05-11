//;(function () {

// The build of Highlight.js used here can provide syntax highlighting for:
//   Bash
//   Diff
//   JSON
//   HTML, XML
//   Python
//   HTTP
//   JavaScript
//   Ruby
//   CSS
//   PHP
//   SQL
//   AppleScript
//   CoffeeScript
//   Haskell
hljs.initHighlightingOnLoad();

var changeUnderline = function (e) {
  if (e.type === "mouseover") {
    e.target.className = "underlined";
  }
  else if (e.type === "mouseout") {
    e.target.className = "";
  }
}

var navAnchors = document.querySelectorAll('nav a'),
    anchor;
for (var i = 0; i < navAnchors.length; i++) {
  anchor = navAnchors[i];
  anchor.addEventListener('mouseover', changeUnderline);
  anchor.addEventListener('mouseout', changeUnderline);
}



//}());

