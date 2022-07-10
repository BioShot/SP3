//Made By Bio Shot!
    /*
* FileSaver.js
* A saveAs() FileSaver implementation.
*
* By Eli Grey, http://eligrey.com
*
* License : https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md (MIT)
* source  : http://purl.eligrey.com/github/FileSaver.js
*/

// The one and only way of getting global scope in all environments
// https://stackoverflow.com/q/3277182/1008999
/*! jQuery v3.6.0 | (c) OpenJS Foundation and other contributors | jquery.org/license */

var _global = typeof window === 'object' && window.window === window
? window : typeof self === 'object' && self.self === self
? self : typeof global === 'object' && global.global === global
? global
: this

function bom (blob, opts) {
if (typeof opts === 'undefined') opts = { autoBom: false }
else if (typeof opts !== 'object') {
  console.warn('Deprecated: Expected third argument to be a object')
  opts = { autoBom: !opts }
}

// prepend BOM for UTF-8 XML and text/* types (including HTML)
// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
if (opts.autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
  return new Blob([String.fromCharCode(0xFEFF), blob], { type: blob.type })
}
return blob
}

function download (url, name, opts) {
var xhr = new XMLHttpRequest()
xhr.open('GET', url)
xhr.responseType = 'blob'
xhr.onload = function () {
  saveAs(xhr.response, name, opts)
}
xhr.onerror = function () {
  console.error('could not download file')
}
xhr.send()
}

function corsEnabled (url) {
var xhr = new XMLHttpRequest()
// use sync to avoid popup blocker
xhr.open('HEAD', url, false)
try {
  xhr.send()
} catch (e) {}
return xhr.status >= 200 && xhr.status <= 299
}

// `a.click()` doesn't work for all browsers (#465)
function click (node) {
try {
  node.dispatchEvent(new MouseEvent('click'))
} catch (e) {
  var evt = document.createEvent('MouseEvents')
  evt.initMouseEvent('click', true, true, window, 0, 0, 0, 80,
                        20, false, false, false, false, 0, null)
  node.dispatchEvent(evt)
}
}

// Detect WebView inside a native macOS app by ruling out all browsers
// We just need to check for 'Safari' because all other browsers (besides Firefox) include that too
// https://www.whatismybrowser.com/guides/the-latest-user-agent/macos
var isMacOSWebView = _global.navigator && /Macintosh/.test(navigator.userAgent) && /AppleWebKit/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent)

var saveAs = _global.saveAs || (
// probably in some web worker
(typeof window !== 'object' || window !== _global)
  ? function saveAs () { /* noop */ }

// Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView
: ('download' in HTMLAnchorElement.prototype && !isMacOSWebView)
? function saveAs (blob, name, opts) {
  var URL = _global.URL || _global.webkitURL
  var a = document.createElement('a')
  name = name || blob.name || 'download'

  a.download = name
  a.rel = 'noopener' // tabnabbing

  // TODO: detect chrome extensions & packaged apps
  // a.target = '_blank'

  if (typeof blob === 'string') {
    // Support regular links
    a.href = blob
    if (a.origin !== location.origin) {
      corsEnabled(a.href)
        ? download(blob, name, opts)
        : click(a, a.target = '_blank')
    } else {
      click(a)
    }
  } else {
    // Support blobs
    a.href = URL.createObjectURL(blob)
    setTimeout(function () { URL.revokeObjectURL(a.href) }, 4E4) // 40s
    setTimeout(function () { click(a) }, 0)
  }
}

// Use msSaveOrOpenBlob as a second approach
: 'msSaveOrOpenBlob' in navigator
? function saveAs (blob, name, opts) {
  name = name || blob.name || 'download'

  if (typeof blob === 'string') {
    if (corsEnabled(blob)) {
      download(blob, name, opts)
    } else {
      var a = document.createElement('a')
      a.href = blob
      a.target = '_blank'
      setTimeout(function () { click(a) })
    }
  } else {
    navigator.msSaveOrOpenBlob(bom(blob, opts), name)
  }
}

// Fallback to using FileReader and a popup
: function saveAs (blob, name, opts, popup) {
  // Open a popup immediately do go around popup blocker
  // Mostly only available on user interaction and the fileReader is async so...
  popup = popup || open('', '_blank')
  if (popup) {
    popup.document.title =
    popup.document.body.innerText = 'downloading...'
  }

  if (typeof blob === 'string') return download(blob, name, opts)

  var force = blob.type === 'application/octet-stream'
  var isSafari = /constructor/i.test(_global.HTMLElement) || _global.safari
  var isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent)

  if ((isChromeIOS || (force && isSafari) || isMacOSWebView) && typeof FileReader !== 'undefined') {
    // Safari doesn't allow downloading of blob URLs
    var reader = new FileReader()
    reader.onloadend = function () {
      var url = reader.result
      url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, 'data:attachment/file;')
      if (popup) popup.location.href = url
      else location = url
      popup = null // reverse-tabnabbing #460
    }
    reader.readAsDataURL(blob)
  } else {
    var URL = _global.URL || _global.webkitURL
    var url = URL.createObjectURL(blob)
    if (popup) popup.location = url
    else location.href = url
    popup = null // reverse-tabnabbing #460
    setTimeout(function () { URL.revokeObjectURL(url) }, 4E4) // 40s
  }
}
)

_global.saveAs = saveAs.saveAs = saveAs

if (typeof module !== 'undefined') {
module.exports = saveAs;
}
(function (d) {
  d.fn.shake = function (a) {
    "function" === typeof a && (a = { callback: a }); a = d.extend({ direction: "left", distance: 20, times: 3, speed: 140, easing: "swing" }, a); return this.each(function () {
      var b = d(this), k = { position: b.css("position"), top: b.css("top"), bottom: b.css("bottom"), left: b.css("left"), right: b.css("right") }; b.css("position", "relative"); var c = "up" == a.direction || "down" == a.direction ? "top" : "left", e = "up" == a.direction || "left" == a.direction ? "pos" : "neg", f = {}, g = {}, h = {}; f[c] = ("pos" == e ? "-=" : "+=") + a.distance; g[c] =
        ("pos" == e ? "+=" : "-=") + 2 * a.distance; h[c] = ("pos" == e ? "-=" : "+=") + 2 * a.distance; b.animate(f, a.speed, a.easing); for (c = 1; c < a.times; c++)b.animate(g, a.speed, a.easing).animate(h, a.speed, a.easing); b.animate(g, a.speed, a.easing).animate(f, a.speed / 2, a.easing, function () { b.css(k); a.callback && a.callback.apply(this, arguments) })
    })
  }
})(jQuery);

    function _(selector){
        var self = {};
        self.selector = selector;
        self.element = document.getElementById(self.selector);
        loaded = false;
        
        self.html = function(){
            return self.element;
        }
        self.popup = function(url,https){
            if(selector == "popupBox"){
                if(https == null){
                    window.open("https://"+url,"popup","popup")
            }else{
                window.open(url,"popup","popup")
            }}
        }
        self.text = function(text){
            self.element.innerHTML = text;
        }
        self.delete = function(){
            self.element.remove();
        }
        self.event = function(event,callback){
            self.element['on'+event] =  callback;
        }
        self.addCookie = function(name,value){
            if(selector == "cookie"){
                document.cookie = name + "=" + value + "" + ";path=/";
        }}
        self.attr = function(name,value){
            if(!value) return self.element.getAttribute(name)
            self.element.setAttribute(name,value);
            return self;
        }
        self.removeattr = function(name){
            self.element.removeAttribute(name);
        }
        if(selector == "credit"){
            console.log("Made By BioShot. Inspired by Jquery(). Enjoy!")
        }
        self.savefile = function(contents,name){
            if(selector == "file"){
                var blob = new Blob([contents],
                    { type: "text/plain;charset=utf-8" });
                    saveAs(blob,name)
            }
            
        }
        self.load = function(callback){
            var event = "load";
            self.element['on'+event] =  callback;
        }
        self.ked = function(TYPE,callback){
            if(TYPE == "ckx"){
                self.element.click();
                _(self.selector).event("click",callback);
                
            }
            if(TYPE == "download"){
                
            }
        }
        self.prompt = function(message,callback){
            var event = prompt(message);
            callback(event);
        }
        self.getCookie = function(name){
            var cname = name + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i < ca.length; i++){
            var c = ca[i];
            while(c.charAt(0) == ' '){
                c = c.substring(1);
            }
            if(c.indexOf(cname) == 0){
                return c.substring(cname.length, c.length);
            }
    }
    return "";
        }
        self.css = {}
        self.css.custom = function(css){
          self.element.setAttribute("style",css);
          return self;
        }
        self.css.background = function(backgroundImg){
          var body = document.body;
          body.style.backgroundImage = backgroundImg
        }
        self.bounce = function(direction,speed,times){
          $(self.selector).shake({
            direction: direction,
            distance: 10,
            speed: speed,
            times: times
          })
          
        }
        self.settings = function (table) {
          if(!table.beta){
            if(!table.perms){

            }else{
              if(table.perms == true){
                return true
              }
            }
          }else{
            if(table.beta == true){
              return true
            }
          }
          
        }


        

        
        return self;
    }