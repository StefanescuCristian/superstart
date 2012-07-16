var $ = function(e, s) {
	if (s === undefined) {
		s = e;
		e = document;
	}
	if (typeof(s) != 'string' || s == '') {
		return null;
	}
	if (s.charAt(0) == '#' && s.indexOf(' ') == -1 && s.indexOf('>') == -1) {
		return document.getElementById(s.substr(1));
	} else {
		return e.querySelectorAll(s);
	}
};

var $$ = function(id) {
	return document.getElementById(id);
};

(function($) {
	$.hasClass = function(el, cls) {
		try {
			return el.classList.contains(cls);
		} catch (e) {}
		return false;
	}

	$.addClass = function(el, cls) {
		try {
			if (!el.classList.contains(cls)) {
				el.classList.add(cls);
			}
		} catch (e) {}
	}

	function _removeClass(el, cls) {
		try {
			if (el.classList.contains(cls)) {
				el.classList.remove(cls);
			}
		} catch (e) {}
	}

	$.removeClass = function(el, cls) {
		try {
			if (cls.indexOf(' ') == -1) {
				_removeClass(el, cls);
			} else {
				var cs = cls.split(' ');
				for (var i = 0, l = cs.length; i < l; ++ i) {
					var c = cs[i];
					if (c != '') {
						_removeClass(el, c);
					}
				}
			}
		} catch (e) {}
	}

	$.isChild = function(c, p) {
		try {
			while (c != null) {
				if (c == p) {
					return true;
				}
				c = c.parentNode;
			}
		} catch (e) {}
		return false;
	}

	$.isPointInElement = function(el, x, y) {
		var rc = el.getBoundingClientRect();
		return rc.left <= x && rc.right > x && rc.top <= y && rc.bottom > y;
	}

	$.getPosition = function(el) {
		var x = 0, y = 0;
		if (el.offsetParent) {
			do {
				x += el.offsetLeft;
				y += el.offsetTop;
			} while (el = el.offsetParent);
		}

		return [x, y];
	}

	$.offset = function(el) {
		var o = {left: 0, top: 0};
		while(el) {
			o.left += el.offsetLeft;
			o.top += el.offsetTop;
			el = el.offsetParent;
		}
		return o;
	}

	$.offsetTop = function(el) {
		var t = 0;
		while(el) {
			t += el.offsetTop;
			el = el.offsetParent;
		}
		return t;
	}

	$.offsetLeft = function(el) {
		var l = 0;
		while(el) {
			l += el.offsetLeft;
			el = el.offsetParent;
		}
		return l;
	}

	// return [width, height] of the element
	$.getElementDimension = function(el, cs) {
		try {
			cs = cs || window.getComputedStyle(el, null);
			return [
				cs.getPropertyValue('width').replace(/px/, '') - 0,
				cs.getPropertyValue('height').replace(/px/, '') - 0
				];
		} catch (e) {
			return [0, 0];
		}
	}

	// margin + border + padding
	$.getElementExtensionalY = function(el, cs) {
		try {
			cs = cs || window.getComputedStyle(el, null);
			return (cs.getPropertyValue('margin-top').replace(/px/, '') - 0) +
				(cs.getPropertyValue('margin-bottom').replace(/px/, '') - 0) +
				(cs.getPropertyValue('border-top-width').replace(/px/, '') - 0) +
				(cs.getPropertyValue('border-bottom-width').replace(/px/, '') - 0) +
				(cs.getPropertyValue('padding-top').replace(/px/, '') - 0) +
				(cs.getPropertyValue('padding-bottom').replace(/px/, '') - 0);
		} catch (e) {
			return 0;
		}
	}

	$.getElementFullHeight = function(el, cs) {
		try {
			cs = cs || window.getComputedStyle(el, null);
			return this.getElementExtensionalY(el, cs) + (cs.getPropertyValue('height').replace(/px/, '') - 0);
		} catch (e) {
			return 0;
		}
	}
	
	$.getElementMargin = function(el, cs) {
		try {
			cs = cs || window.getComputedStyle(el, null);
			return [
				cs.getPropertyValue('margin-top').replace(/px/, '') - 0,
				cs.getPropertyValue('margin-right').replace(/px/, '') - 0,
				cs.getPropertyValue('margin-bottom').replace(/px/, '') - 0,
				cs.getPropertyValue('margin-left').replace(/px/, '') - 0
				];
		} catch (e) {
			return [0, 0, 0, 0];
		}
	}
	
	$.getElementBorder = function(el, cs) {
		cs = cs || window.getComputedStyle(el, null);
		try {
			return [
				cs.getPropertyValue('border-top-width').replace(/px/, '') - 0,
				cs.getPropertyValue('border-right-width').replace(/px/, '') - 0,
				cs.getPropertyValue('border-bottom-width').replace(/px/, '') - 0,
				cs.getPropertyValue('border-left-width').replace(/px/, '') - 0
				];
		} catch (e) {
			return [0, 0, 0, 0];
		}
	}
	
	$.getElementPadding = function(el, cs) {
		cs = cs || window.getComputedStyle(el, null);
		try {
			return [
				cs.getPropertyValue('padding-top').replace(/px/, '') - 0,
				cs.getPropertyValue('padding-right').replace(/px/, '') - 0,
				cs.getPropertyValue('padding-bottom').replace(/px/, '') - 0,
				cs.getPropertyValue('padding-left').replace(/px/, '') - 0
				];
		} catch (e) {
			return [0, 0, 0, 0];
		}
	}

	$.getCSSRule = function(selector, what) {
		var result = '';
		for (var idx = 0; idx < document.styleSheets.length; ++ idx) {
			try {
				var ss = document.styleSheets[idx];
				var rs = ss.cssRules;
				for (var i = 0, l = rs.length; i < l; ++ i) {
					var r = rs[i];
					if (!r.selectorText) {
						continue;
					}
					var s = r.selectorText;

					if (s == selector) {
						if (r.style[what] != undefined) {
							result = r.style[what];
						}
					}
				}
			} catch (e) {
			}
		}

		return result;
	}
	
	$.escapeHTML = function(str) {
		return str.replace(/[&"<>]/g, function (m) {
				return "&" +
					({
						"&" : "amp",
						'"' : "quot",
						"<" : "lt",
						">" : "gt"
					})[m] + ";"
				});
	}

	/**
	 format:
	 ELEMENT :=
	 {
	 	'tag' : tag,
		'attr' : {
			'name' : value,
			'name' : value,
			...
		},
		'children" : [
			ELEMENT, ...
		]
	 }
	 */
	$.obj2Element = function(obj) {
		if (obj.tag == null) {
			return null;
		}
		var e = document.createElement(obj.tag);
		if (e) {
			if (obj.attr) {
				var a = obj.attr;
				for (var name in a) {
					if (name == 'text') {
						var t = document.createTextNode(a[name]);
						e.appendChild(t);
					} else {
						e.setAttribute(name, a[name]);
					}
				}
			}

			if (obj.children) {
				var cs = obj.children;
				for (var i = 0, l = cs.length; i < l; ++ i) {
					var c = $.obj2Element(cs[i]);
					if (c) {
						e.appendChild(c);
					}
				}
			}
		}
		return e;
	}

	const Ci = Components.interfaces;
	$.getMainWindow = function() {
		return window.QueryInterface(Ci.nsIInterfaceRequestor)
			.getInterface(Ci.nsIWebNavigation)
			.QueryInterface(Ci.nsIDocShellTreeItem)
			.rootTreeItem
			.QueryInterface(Ci.nsIInterfaceRequestor)
			.getInterface(Ci.nsIDOMWindow);
	}
})($);
