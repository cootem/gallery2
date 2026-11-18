
var type = "IE"; // Variable used to hold the browser name

detectBrowser();

function detectBrowser() {
  if (window.opera && document.readyState) {
    type="OP"; // The surfer is using Opera of some version
  } else if (document.all) {
    type="IE"; // The surfer is using IE 4+
  } else if (document.layers) {
    type="NN"; // The surfer is using NS 4
  } else if (!document.all && document.getElementById) {
    type="MO"; // The surfer is using NS6+ or Firefox
  } else {
    type="IE"; // I assume it will not get here
  }
}

document.onkeydown = function(e) {
  if (!e) {
    // If the browser did not pass the event information to the
    // function, we will have to obtain it from the event register.
    if(window.event) {
      e = window.event; // IE 4+
    } else {
      return;
    }
  }
  if (typeof(e.keyCode) == 'number') {
    e = e.keyCode;  // DOM
  } else if (typeof(e.which) == 'number') {
    e = e.which;    // NS 4
  } else if(typeof(e.charCode) == 'number') {
    e = e.charCode; // NS 6+, Mozilla 0.9+
  } else {
    return;
  }
  if ((e==39 || e==63235) && document.getElementById("next")) {
    location.href = document.getElementById("next").href;
  } else if ((e==37 || e==63234) && document.getElementById("prev")) {
    location.href = document.getElementById("prev").href;
  }
}

/*****************************************************************************/

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_showHideLayers() { //v6.0
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
    if (obj.style) { obj=obj.style; v=(v=='show')?'visible':(v=='hide')?'hidden':v; }
    obj.visibility=v; }
}

/*****************************************************************************/

var leftmost = -190;
var rightmost = 10;
var interval = null;
var sidebarVisible = false;
var DOMCapable;

document.getElementById ? DOMCapable=true : DOMCapable=false;

function scrollRight(menuId) {
  var leftPosition;
  if (DOMCapable) {
    leftPosition = parseInt(document.getElementById(menuId).style.left);
    if (leftPosition >= rightmost) {
      clearInterval(interval);
      return;
    } else {
      leftPosition += 10;
      document.getElementById(menuId).style.left = leftPosition+"px";
    }
  }
}

function scrollLeft(menuId) {
  if (DOMCapable) {
    leftPosition = parseInt(document.getElementById(menuId).style.left);
    if (leftPosition <= leftmost) {
      clearInterval(interval);
      return;
    } else {
      leftPosition -= 10;
      document.getElementById(menuId).style.left = leftPosition+"px";
    }
  }
}

function slideIn(menuId) {
  if (document.getElementById(menuId)) {
    clearInterval(interval);
    interval = setInterval('scrollRight("'+menuId+'")', 5);
  }
  sidebarVisible = true;
}

function slideOut(menuId) {
  if (document.getElementById(menuId)) {
    clearInterval(interval);
    interval = setInterval('scrollLeft("'+menuId+'")', 5);
  }
  sidebarVisible = false;
}

function toggleSidebar(menuId) {
  if (!sidebarVisible) {
    slideIn(menuId);
  } else {
    slideOut(menuId);
  }
}

/*****************************************************************************/

function popImage(img, title) {
  picfile = new Image();
  picfile.src = img;
  picfile.imageTitle = title;
  fileCheck(100);
}

function fileCheck(i) {
  if ((picfile.width != 0 && picfile.height != 0) || i == 0) {
    makeWindow();
  } else {
    setTimeout("fileCheck(" + (i-1) + ")", 50);
  }
}

function makeWindow() {
  var img = picfile.src, wd = picfile.width, ht = picfile.height, title = picfile.imageTitle;
  var args = "resizable=yes";
  if (wd == 0) {
    // Default window size if image load is slow
    wd = 800;
    ht = 600;
    args += ",scrollbars=yes";
  }

  if (window.screen) {
    var isIE = (navigator.appName.indexOf("Microsoft") != -1) ? 1 : 0;
    var avwd = screen.availWidth, avht = screen.availHeight;

    if (avwd < wd || avht < ht) { args += ",scrollbars=yes"; }

    var xcen = (avwd > wd) ? (avwd - wd) / 2 : 0;
    var ycen = (avht > ht) ? (avht - ht) / 2 : 0;
    args += ",left=" + xcen + ",screenX=" + xcen;
    args += ",top=" + ycen + ",screenY=" + ycen;

    if (avwd < wd) {
      wd = avwd;
      if (isIE) wd -= 12;
    }
    if (avht < ht) {
      ht = avht;
      if (isIE) ht -= 32;
    }
  }
  args += ",width=" + wd + ",innerWidth=" + wd;
  args += ",height=" + ht + ",innerHeight=" + ht;

  popwin = window.open(img, 'fullSize', args);
  popwin.document.open();
  popwin.document.write('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">');
  popwin.document.write('<html>');
  popwin.document.write('<head>');
  popwin.document.write('<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>');
  popwin.document.write('<title>'+title+'</title>');
  popwin.document.write('</head>');
  popwin.document.write('<body style="margin:0px"><a href="javascript:window.close()"><img src="'+img+'" border="0" alt="'+title+'"/></a></body>');
  popwin.document.write('</html>');
  popwin.document.close();
}

/*****************************************************************************/

var exifVisible = false;

function setLayer(obj,lyr) {
  var newX = findPosX(obj)+5;
  var newY = findPosY(obj)+5;
  var x = new getObj(lyr);
  x.style.top = newY + 'px';
  x.style.left = newX + 'px';
}

function findPosX(obj) {
  var curleft = 0;

  if (!obj) { return curleft; }
  if (obj.offsetParent) {
    while (obj.offsetParent) {
      curleft += obj.offsetLeft
      obj = obj.offsetParent;
    }
  } else if (obj.x) {
    curleft += obj.x;
  }
  return curleft;
}

function findPosY(obj) {
  var curtop = 0;

  if (!obj) { return curtop; }
  if (obj.offsetParent) {
    while (obj.offsetParent) {
      curtop += obj.offsetTop
      obj = obj.offsetParent;
    }
  } else if (obj.y) {
    curtop += obj.y;
  }
  return curtop;
}

function getObj(id) {
  if (type=="IE") {
    this.obj = document.all[id];
    this.style = document.all[id].style;
  } else if (type=="MO" || type=="OP") {
    this.obj = document.getElementById(id);
    this.style = document.getElementById(id).style;
  } else if (type=="NN") {
    if (document.layers[id]) {
      this.obj = document.layers[id];
      this.style = document.layers[id];
    }
  }
}

function toggleExif(parentId, id) {
  var parent = document.getElementById(parentId);

  MM_showHideLayers(id,'',(exifVisible) ? 'hide' : 'show');
  setLayer(parent,id);

  exifVisible = !exifVisible;
}

/* Photo page navigation: left/right arrow keys and left/right swipe (added 2026-11-10, v2).
 * Uses the existing Previous/Next navigator links, so it follows the album's own ordering.
 * Add ?swipedebug=1 to a photo URL to show touch events on screen. */
(function () {
  function link(cls) {
    var a = document.querySelector('.' + cls + ' a');
    return a ? a.href : null;
  }
  function onPhotoPage() { return !!document.getElementById('gsImageView'); }
  function go(cls) {
    var url = link(cls);
    if (url) { window.location.href = url; return true; }
    return false;
  }
  function inField(el) {
    return !!el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable);
  }

  document.addEventListener('keydown', function (e) {
    if (!onPhotoPage() || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || inField(e.target)) return;
    if (e.key === 'ArrowRight') { if (go('buttonNext')) e.preventDefault(); }
    else if (e.key === 'ArrowLeft') { if (go('buttonPrev')) e.preventDefault(); }
  });

  var dbg = null;
  function say(msg) {
    if (location.search.indexOf('swipedebug') < 0) return;
    if (!dbg) {
      dbg = document.createElement('div');
      dbg.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#000;color:#0f0;font:12px monospace;padding:4px;white-space:pre-wrap';
      document.body.appendChild(dbg);
    }
    dbg.textContent = msg;
  }

  var sx = 0, sy = 0, lx = 0, ly = 0, st = 0, tracking = false;
  function zoomed() { return window.visualViewport && window.visualViewport.scale > 1.05; }  /* ignore while pinch-zoomed */
  document.addEventListener('touchstart', function (e) {
    tracking = onPhotoPage() && e.touches.length === 1 && !inField(e.target) && !zoomed();
    say('start tracking=' + tracking + ' touches=' + e.touches.length + ' scale=' + (window.visualViewport ? window.visualViewport.scale : 'n/a'));
    if (!tracking) return;
    sx = lx = e.touches[0].clientX; sy = ly = e.touches[0].clientY; st = Date.now();
  }, { passive: true });
  document.addEventListener('touchmove', function (e) {
    if (!tracking || !e.touches.length) return;
    lx = e.touches[0].clientX; ly = e.touches[0].clientY;
  }, { passive: true });
  function finish(e) {
    if (!tracking) return;
    tracking = false;
    var t = e.changedTouches && e.changedTouches[0];
    var x = t ? t.clientX : lx, y = t ? t.clientY : ly;
    var dx = x - sx, dy = y - sy, ms = Date.now() - st;
    var ok = ms <= 1000 && Math.abs(dx) >= 50 && Math.abs(dx) >= 1.3 * Math.abs(dy);
    say(e.type + ' dx=' + Math.round(dx) + ' dy=' + Math.round(dy) + ' ms=' + ms + ' -> ' + (ok ? (dx < 0 ? 'NEXT' : 'PREV') : 'ignored'));
    if (ok) go(dx < 0 ? 'buttonNext' : 'buttonPrev');   /* swipe left = next, swipe right = previous */
  }
  document.addEventListener('touchend', finish, { passive: true });
  document.addEventListener('touchcancel', finish, { passive: true });
})();
