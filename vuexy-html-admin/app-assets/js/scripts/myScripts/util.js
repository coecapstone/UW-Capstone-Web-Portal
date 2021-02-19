// Site-wide configuration
//const baseURL = "https://uwcoe-api.azurewebsites.net/api/";
const baseURL = "https://engine.ce.washington.edu/api/";

/*
 * Simon Willison's addLoadEvent function,
 * frmo https://www.htmlgoodies.com/beyond/javascript/article.php/3724571/using-multiple-javascript-onload-functions.htm
 *
 * usage: addLoadEvent(func);
 *     or addLoadEvent(function() { some code; });
 */
function addLoadEvent(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}
