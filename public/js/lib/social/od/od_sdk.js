function API_initialized() {
	FAPI.setInitialized();
	window.fapi_success(FAPI.useHtml5 ? "HTML5" : "FLASH");
}
var FAPI = {useHtml5: false, initialized: false, init: function (e, g, h, f) {
	this.useHtml5 = FAPI.Util.isFunc(window.postMessage);
	if (this.useHtml5) {
		this.invokeUIMethod = FAPI.HTML5.invokeUIMethod;
		FAPI.HTML5.init(e, g, h, f);
	} else {
		this.invokeUIMethod = FAPI.FLASH.invokeUIMethod;
		FAPI.FLASH.init(e, g, h, f);
	}
}, setInitialized: function () {
	FAPI.initialized = true;
	if (this.useHtml5) {
		FAPI.HTML5.initialized = true;
	} else {
		FAPI.FLASH.initialized = true;
	}
}, HTML5: {initialized: false, webServerUrl: "", serverUrl: "", apiConnectionName: "", attachRetryCounter: 0, init: function (e, g, h, f) {
	this.webServerUrl = window.location.origin;
	this.serverUrl = e;
	this.apiConnectionName = g;
	this.attachRetryCounter = 0;

	if (!this.initialized) {
		window.fapi_failure = FAPI.Util.isFunc(f) ? f : function () {
		};
		window.fapi_success = FAPI.Util.isFunc(h) ? h : function () {
		};
		if (FAPI.Util.isFunc(window.postMessage)) {
			if (FAPI.Util.isFunc(window.addEventListener)) {
				window.addEventListener("message", this.onPostMessage, false);
			} else {
				window.attachEvent("onmessage", this.onPostMessage);
			}
			this.doAttach();
		} else {
			window.fapi_failure("HTML5 not supported");
		}
	}
}, doAttach: function () {
	if (!FAPI.HTML5.initialized) {
		if (FAPI.HTML5.attachRetryCounter++ < 20) {
			FAPI.HTML5.invokeUIMethod("attach");
			setTimeout(FAPI.HTML5.doAttach, 500);
		} else {
			window.fapi_failure("Failed to init.");
		}
	}
}, onPostMessage: function (g) {
	var f = g.data.split("$");
	if (f.length != 3 || FAPI.HTML5.webServerUrl != g.origin) {
		return;
	}
	var e = decodeURIComponent(f[0]);
	if (e == "attach") {
		API_initialized();
	} else {
		API_callback(e, decodeURIComponent(f[1]), decodeURIComponent(f[2]));
	}
}, invokeUIMethod: function () {
	var g = "";
	for (var f = 0; f < arguments.length; f++) {
		var e = arguments[f];
		if (f > 0) {
			g += "$";
		}
		if (e != null) {
			g += encodeURIComponent(String(e));
		}
	}
	parent.postMessage("__FAPI__" + g, FAPI.HTML5.webServerUrl);
}}, FLASH: {flash: null, initialized: false, swfCallback: function (f) {
	if (f.success) {
		FAPI.FLASH.flash = document.getElementById("FAPI_Flash");
	} else {
		window.fapi_failure("Failed  to embed flash");
	}
}, embedFlash: function (m, g) {
	var h = document.createElement("span");
	h.id = "FAPI_Flash_wrap";
	h.style.position = "absolute";
	h.style.marginTop = "-10px";
	document.body.appendChild(h);
	var l = {apiconnection: this.apiConnectionName};
	var f = {menu: "false", scale: "noScale", allowScriptAccess: "always", bgcolor: "#FFFFFF"};
	var k = {id: "FAPI_Flash"};
	window.fapi_success = FAPI.Util.isFunc(m) ? m : function () {
	};
	window.fapi_failure = FAPI.Util.isFunc(g) ? g : function () {
	};
	var e = function () {
		var aq = "undefined", aD = "object", ab = "Shockwave Flash", X = "ShockwaveFlash.ShockwaveFlash", aE = "application/x-shockwave-flash", ac = "SWFObjectExprInst", ax = "onreadystatechange", af = window, aL = document, aB = navigator, aa = false, Z = [aN], aG = [], ag = [], al = [], aJ, ad, ap, at, ak = false, aU = false, aH, an, aI = true, ah = function () {
			var n = typeof aL.getElementById != aq && typeof aL.getElementsByTagName != aq && typeof aL.createElement != aq, r = aB.userAgent.toLowerCase(), p = aB.platform.toLowerCase(), u = p ? /win/.test(p) : /win/.test(r), w = p ? /mac/.test(p) : /mac/.test(r), t = /webkit/.test(r) ? parseFloat(r.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, "$1")) : false, q = !+"\v1", s = [0, 0, 0], y = null;
			if (typeof aB.plugins != aq && typeof aB.plugins[ab] == aD) {
				y = aB.plugins[ab].description;
				if (y && !(typeof aB.mimeTypes != aq && aB.mimeTypes[aE] && !aB.mimeTypes[aE].enabledPlugin)) {
					aa = true;
					q = false;
					y = y.replace(/^.*\s+(\S+\s+\S+$)/, "$1");
					s[0] = parseInt(y.replace(/^(.*)\..*$/, "$1"), 10);
					s[1] = parseInt(y.replace(/^.*\.(.*)\s.*$/, "$1"), 10);
					s[2] = /[a-zA-Z]/.test(y) ? parseInt(y.replace(/^.*[a-zA-Z]+(.*)$/, "$1"), 10) : 0;
				}
			} else {
				if (typeof af.ActiveXObject != aq) {
					try {
						var v = new ActiveXObject(X);
						if (v) {
							y = v.GetVariable("$version");
							if (y) {
								q = true;
								y = y.split(" ")[1].split(",");
								s = [parseInt(y[0], 10), parseInt(y[1], 10), parseInt(y[2], 10)];
							}
						}
					} catch (o) {
					}
				}
			}
			return{w3: n, pv: s, wk: t, ie: q, win: u, mac: w};
		}(), aK = function () {
			if (!ah.w3) {
				return;
			}
			if ((typeof aL.readyState != aq && aL.readyState == "complete") || (typeof aL.readyState == aq && (aL.getElementsByTagName("body")[0] || aL.body))) {
				aP();
			}
			if (!ak) {
				if (typeof aL.addEventListener != aq) {
					aL.addEventListener("DOMContentLoaded", aP, false);
				}
				if (ah.ie && ah.win) {
					aL.attachEvent(ax, function () {
						if (aL.readyState == "complete") {
							aL.detachEvent(ax, arguments.callee);
							aP();
						}
					});
					if (af == top) {
						(function () {
							if (ak) {
								return;
							}
							try {
								aL.documentElement.doScroll("left");
							} catch (n) {
								setTimeout(arguments.callee, 0);
								return;
							}
							aP();
						})();
					}
				}
				if (ah.wk) {
					(function () {
						if (ak) {
							return;
						}
						if (!/loaded|complete/.test(aL.readyState)) {
							setTimeout(arguments.callee, 0);
							return;
						}
						aP();
					})();
				}
				aC(aP);
			}
		}();

		function aP() {
			if (ak) {
				return;
			}
			try {
				var o = aL.getElementsByTagName("body")[0].appendChild(ar("span"));
				o.parentNode.removeChild(o);
			} catch (n) {
				return;
			}
			ak = true;
			var q = Z.length;
			for (var p = 0; p < q; p++) {
				Z[p]();
			}
		}

		function aj(n) {
			if (ak) {
				n();
			} else {
				Z[Z.length] = n;
			}
		}

		function aC(n) {
			if (typeof af.addEventListener != aq) {
				af.addEventListener("load", n, false);
			} else {
				if (typeof aL.addEventListener != aq) {
					aL.addEventListener("load", n, false);
				} else {
					if (typeof af.attachEvent != aq) {
						aM(af, "onload", n);
					} else {
						if (typeof af.onload == "function") {
							var o = af.onload;
							af.onload = function () {
								o();
								n();
							};
						} else {
							af.onload = n;
						}
					}
				}
			}
		}

		function aN() {
			if (aa) {
				Y();
			} else {
				am();
			}
		}

		function Y() {
			var q = aL.getElementsByTagName("body")[0];
			var o = ar(aD);
			o.setAttribute("type", aE);
			var n = q.appendChild(o);
			if (n) {
				var p = 0;
				(function () {
					if (typeof n.GetVariable != aq) {
						var r = n.GetVariable("$version");
						if (r) {
							r = r.split(" ")[1].split(",");
							ah.pv = [parseInt(r[0], 10), parseInt(r[1], 10), parseInt(r[2], 10)];
						}
					} else {
						if (p < 10) {
							p++;
							setTimeout(arguments.callee, 10);
							return;
						}
					}
					q.removeChild(o);
					n = null;
					am();
				})();
			} else {
				am();
			}
		}

		function am() {
			var t = aG.length;
			if (t > 0) {
				for (var u = 0; u < t; u++) {
					var p = aG[u].id;
					var z = aG[u].callbackFn;
					var n = {success: false, id: p};
					if (ah.pv[0] > 0) {
						var v = aS(p);
						if (v) {
							if (ao(aG[u].swfVersion) && !(ah.wk && ah.wk < 312)) {
								ay(p, true);
								if (z) {
									n.success = true;
									n.ref = av(p);
									z(n);
								}
							} else {
								if (aG[u].expressInstall && au()) {
									var r = {};
									r.data = aG[u].expressInstall;
									r.width = v.getAttribute("width") || "0";
									r.height = v.getAttribute("height") || "0";
									if (v.getAttribute("class")) {
										r.styleclass = v.getAttribute("class");
									}
									if (v.getAttribute("align")) {
										r.align = v.getAttribute("align");
									}
									var s = {};
									var q = v.getElementsByTagName("param");
									var y = q.length;
									for (var w = 0; w < y; w++) {
										if (q[w].getAttribute("name").toLowerCase() != "movie") {
											s[q[w].getAttribute("name")] = q[w].getAttribute("value");
										}
									}
									ae(r, s, p, z);
								} else {
									aF(v);
									if (z) {
										z(n);
									}
								}
							}
						}
					} else {
						ay(p, true);
						if (z) {
							var o = av(p);
							if (o && typeof o.SetVariable != aq) {
								n.success = true;
								n.ref = o;
							}
							z(n);
						}
					}
				}
			}
		}

		function av(o) {
			var q = null;
			var p = aS(o);
			if (p && p.nodeName == "OBJECT") {
				if (typeof p.SetVariable != aq) {
					q = p;
				} else {
					var n = p.getElementsByTagName(aD)[0];
					if (n) {
						q = n;
					}
				}
			}
			return q;
		}

		function au() {
			return !aU && ao("6.0.65") && (ah.win || ah.mac) && !(ah.wk && ah.wk < 312);
		}

		function ae(s, q, u, r) {
			aU = true;
			ap = r || null;
			at = {success: false, id: u};
			var n = aS(u);
			if (n) {
				if (n.nodeName == "OBJECT") {
					aJ = aO(n);
					ad = null;
				} else {
					aJ = n;
					ad = u;
				}
				s.id = ac;
				if (typeof s.width == aq || (!/%$/.test(s.width) && parseInt(s.width, 10) < 310)) {
					s.width = "310";
				}
				if (typeof s.height == aq || (!/%$/.test(s.height) && parseInt(s.height, 10) < 137)) {
					s.height = "137";
				}
				aL.title = aL.title.slice(0, 47) + " - Flash Player Installation";
				var o = ah.ie && ah.win ? "ActiveX" : "PlugIn", p = "MMredirectURL=" + af.location.toString().replace(/&/g, "%26") + "&MMplayerType=" + o + "&MMdoctitle=" + aL.title;
				if (typeof q.flashvars != aq) {
					q.flashvars += "&" + p;
				} else {
					q.flashvars = p;
				}
				if (ah.ie && ah.win && n.readyState != 4) {
					var t = ar("div");
					u += "SWFObjectNew";
					t.setAttribute("id", u);
					n.parentNode.insertBefore(t, n);
					n.style.display = "none";
					(function () {
						if (n.readyState == 4) {
							n.parentNode.removeChild(n);
						} else {
							setTimeout(arguments.callee, 10);
						}
					})();
				}
				aA(s, q, u);
			}
		}

		function aF(n) {
			if (ah.ie && ah.win && n.readyState != 4) {
				var o = ar("div");
				n.parentNode.insertBefore(o, n);
				o.parentNode.replaceChild(aO(n), o);
				n.style.display = "none";
				(function () {
					if (n.readyState == 4) {
						n.parentNode.removeChild(n);
					} else {
						setTimeout(arguments.callee, 10);
					}
				})();
			} else {
				n.parentNode.replaceChild(aO(n), n);
			}
		}

		function aO(o) {
			var q = ar("div");
			if (ah.win && ah.ie) {
				q.innerHTML = o.innerHTML;
			} else {
				var r = o.getElementsByTagName(aD)[0];
				if (r) {
					var n = r.childNodes;
					if (n) {
						var s = n.length;
						for (var p = 0; p < s; p++) {
							if (!(n[p].nodeType == 1 && n[p].nodeName == "PARAM") && !(n[p].nodeType == 8)) {
								q.appendChild(n[p].cloneNode(true));
							}
						}
					}
				}
			}
			return q;
		}

		function aA(r, t, p) {
			var q, n = aS(p);
			if (ah.wk && ah.wk < 312) {
				return q;
			}
			if (n) {
				if (typeof r.id == aq) {
					r.id = p;
				}
				if (ah.ie && ah.win) {
					var s = "";
					for (var v in r) {
						if (r[v] != Object.prototype[v]) {
							if (v.toLowerCase() == "data") {
								t.movie = r[v];
							} else {
								if (v.toLowerCase() == "styleclass") {
									s += ' class="' + r[v] + '"';
								} else {
									if (v.toLowerCase() != "classid") {
										s += " " + v + '="' + r[v] + '"';
									}
								}
							}
						}
					}
					var u = "";
					for (var w in t) {
						if (t[w] != Object.prototype[w]) {
							u += '<param name="' + w + '" value="' + t[w] + '" />';
						}
					}
					n.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + s + ">" + u + "</object>";
					ag[ag.length] = r.id;
					q = aS(r.id);
				} else {
					var o = ar(aD);
					o.setAttribute("type", aE);
					for (var y in r) {
						if (r[y] != Object.prototype[y]) {
							if (y.toLowerCase() == "styleclass") {
								o.setAttribute("class", r[y]);
							} else {
								if (y.toLowerCase() != "classid") {
									o.setAttribute(y, r[y]);
								}
							}
						}
					}
					for (var z in t) {
						if (t[z] != Object.prototype[z] && z.toLowerCase() != "movie") {
							aQ(o, z, t[z]);
						}
					}
					n.parentNode.replaceChild(o, n);
					q = o;
				}
			}
			return q;
		}

		function aQ(o, q, p) {
			var n = ar("param");
			n.setAttribute("name", q);
			n.setAttribute("value", p);
			o.appendChild(n);
		}

		function aw(n) {
			var o = aS(n);
			if (o && o.nodeName == "OBJECT") {
				if (ah.ie && ah.win) {
					o.style.display = "none";
					(function () {
						if (o.readyState == 4) {
							aT(n);
						} else {
							setTimeout(arguments.callee, 10);
						}
					})();
				} else {
					o.parentNode.removeChild(o);
				}
			}
		}

		function aT(n) {
			var o = aS(n);
			if (o) {
				for (var p in o) {
					if (typeof o[p] == "function") {
						o[p] = null;
					}
				}
				o.parentNode.removeChild(o);
			}
		}

		function aS(n) {
			var p = null;
			try {
				p = aL.getElementById(n);
			} catch (o) {
			}
			return p;
		}

		function ar(n) {
			return aL.createElement(n);
		}

		function aM(n, p, o) {
			n.attachEvent(p, o);
			al[al.length] = [n, p, o];
		}

		function ao(n) {
			var o = ah.pv, p = n.split(".");
			p[0] = parseInt(p[0], 10);
			p[1] = parseInt(p[1], 10) || 0;
			p[2] = parseInt(p[2], 10) || 0;
			return(o[0] > p[0] || (o[0] == p[0] && o[1] > p[1]) || (o[0] == p[0] && o[1] == p[1] && o[2] >= p[2])) ? true : false;
		}

		function az(o, s, n, p) {
			if (ah.ie && ah.mac) {
				return;
			}
			var r = aL.getElementsByTagName("head")[0];
			if (!r) {
				return;
			}
			var t = (n && typeof n == "string") ? n : "screen";
			if (p) {
				aH = null;
				an = null;
			}
			if (!aH || an != t) {
				var q = ar("style");
				q.setAttribute("type", "text/css");
				q.setAttribute("media", t);
				aH = r.appendChild(q);
				if (ah.ie && ah.win && typeof aL.styleSheets != aq && aL.styleSheets.length > 0) {
					aH = aL.styleSheets[aL.styleSheets.length - 1];
				}
				an = t;
			}
			if (ah.ie && ah.win) {
				if (aH && typeof aH.addRule == aD) {
					aH.addRule(o, s);
				}
			} else {
				if (aH && typeof aL.createTextNode != aq) {
					aH.appendChild(aL.createTextNode(o + " {" + s + "}"));
				}
			}
		}

		function ay(n, p) {
			if (!aI) {
				return;
			}
			var o = p ? "visible" : "hidden";
			if (ak && aS(n)) {
				aS(n).style.visibility = o;
			} else {
				az("#" + n, "visibility:" + o);
			}
		}

		function ai(o) {
			var n = /[\\\"<>\.;]/;
			var p = n.exec(o) != null;
			return p && typeof encodeURIComponent != aq ? encodeURIComponent(o) : o;
		}

		var aR = function () {
			if (ah.ie && ah.win) {
				window.attachEvent("onunload", function () {
					var n = al.length;
					for (var o = 0; o < n; o++) {
						al[o][0].detachEvent(al[o][1], al[o][2]);
					}
					var q = ag.length;
					for (var p = 0; p < q; p++) {
						aw(ag[p]);
					}
					for (var r in ah) {
						ah[r] = null;
					}
					ah = null;
					for (var s in e) {
						e[s] = null;
					}
					e = null;
				});
			}
		}();
		return{registerObject: function (n, r, p, o) {
			if (ah.w3 && n && r) {
				var q = {};
				q.id = n;
				q.swfVersion = r;
				q.expressInstall = p;
				q.callbackFn = o;
				aG[aG.length] = q;
				ay(n, false);
			} else {
				if (o) {
					o({success: false, id: n});
				}
			}
		}, getObjectById: function (n) {
			if (ah.w3) {
				return av(n);
			}
		}, embedSWF: function (y, r, u, s, p, n, o, v, t, w) {
			var q = {success: false, id: r};
			if (ah.w3 && !(ah.wk && ah.wk < 312) && y && r && u && s && p) {
				ay(r, false);
				aj(function () {
					u += "";
					s += "";
					var E = {};
					if (t && typeof t === aD) {
						for (var C in t) {
							E[C] = t[C];
						}
					}
					E.data = y;
					E.width = u;
					E.height = s;
					var B = {};
					if (v && typeof v === aD) {
						for (var D in v) {
							B[D] = v[D];
						}
					}
					if (o && typeof o === aD) {
						for (var z in o) {
							if (typeof B.flashvars != aq) {
								B.flashvars += "&" + z + "=" + o[z];
							} else {
								B.flashvars = z + "=" + o[z];
							}
						}
					}
					if (ao(p)) {
						var A = aA(E, B, r);
						if (E.id == r) {
							ay(r, true);
						}
						q.success = true;
						q.ref = A;
					} else {
						if (n && au()) {
							E.data = n;
							ae(E, B, r, w);
							return;
						} else {
							ay(r, true);
						}
					}
					if (w) {
						w(q);
					}
				});
			} else {
				if (w) {
					w(q);
				}
			}
		}, switchOffAutoHideShow: function () {
			aI = false;
		}, ua: ah, getFlashPlayerVersion: function () {
			return{major: ah.pv[0], minor: ah.pv[1], release: ah.pv[2]};
		}, hasFlashPlayerVersion: ao, createSWF: function (n, o, p) {
			if (ah.w3) {
				return aA(n, o, p);
			} else {
				return undefined;
			}
		}, showExpressInstall: function (o, n, q, p) {
			if (ah.w3 && au()) {
				ae(o, n, q, p);
			}
		}, removeSWF: function (n) {
			if (ah.w3) {
				aw(n);
			}
		}, createCSS: function (o, n, p, q) {
			if (ah.w3) {
				az(o, n, p, q);
			}
		}, addDomLoadEvent: aj, addLoadEvent: aC, getQueryParamValue: function (o) {
			var n = aL.location.search || aL.location.hash;
			if (n) {
				if (/\?/.test(n)) {
					n = n.split("?")[1];
				}
				if (o == null) {
					return ai(n);
				}
				var p = n.split("&");
				for (var q = 0; q < p.length; q++) {
					if (p[q].substring(0, p[q].indexOf("=")) == o) {
						return ai(p[q].substring((p[q].indexOf("=") + 1)));
					}
				}
			}
			return"";
		}, expressInstallCallback: function () {
			if (aU) {
				var n = aS(ac);
				if (n && aJ) {
					n.parentNode.replaceChild(aJ, n);
					if (ad) {
						ay(ad, true);
						if (ah.ie && ah.win) {
							aJ.style.display = "block";
						}
					}
					if (ap) {
						ap(at);
					}
				}
				aU = false;
			}
		}};
	}();
	e.embedSWF(this.serverUrl + "flash/ForticomAPIJS.swf?v=19", "FAPI_Flash_wrap", "1", "1", "9.0.0", this.serverUrl + "flash/expressInstall.swf", l, f, k, this.swfCallback);
}, init: function (e, g, h, f) {
	this.serverUrl = e;
	this.apiConnectionName = g;
	this.flash = document.getElementById("FAPI_Flash");
	if (this.flash == null) {
		this.embedFlash(h, f);
	} else {
		API_initialized();
	}
}, isFunc: function (e) {
	return Object.prototype.toString.call(e) === "[object Function]";
}, getFlash: function () {
	if (!this.initialized) {
		throw"Forticom API was not initialized properly";
	}
	return this.flash;
}, invokeUIMethod: function () {
	for (var f = 0; f < arguments.length; f++) {
		var e = arguments[f];
		if (e != null) {
			arguments[f] = String(e);
		}
	}
	FAPI.FLASH.getFlash().FAPI_send.apply(FAPI.FLASH.getFlash(), arguments);
}}, UI: {showInvite: function (g, f, e) {
	FAPI.invokeUIMethod("showInvite", g, f, e);
}, showNotification: function (g, f, e) {
	FAPI.invokeUIMethod("showNotification", g, f, e);
}, showPermissions: function (e, f) {
	FAPI.invokeUIMethod("showPermissions", e, f);
}, showPayment: function (e, m, f, h, o, g, l, n, k) {
	FAPI.invokeUIMethod("showPayment", e, m, f, h, o, g, l, n, k);
}, showPortalPayment: function () {
	FAPI.invokeUIMethod("showPortalPayment");
}, showConfirmation: function (g, f, e) {
	FAPI.invokeUIMethod("showConfirmation", g, f, e);
}, showProfileEmail: function () {
	FAPI.invokeUIMethod("showProfileEmail");
}, setWindowSize: function (f, e) {
	FAPI.invokeUIMethod("setWindowSize", f, e);
}, scrollToTop: function () {
	FAPI.invokeUIMethod("scrollToTop");
}, getPageInfo: function () {
	FAPI.invokeUIMethod("getPageInfo");
}, navigateTo: function (e) {
	FAPI.invokeUIMethod("navigateTo", e);
}, postMediatopic: function (f, e) {
	FAPI.invokeUIMethod("postMediatopic", JSON.stringify(f), e ? "on" : "off");
}, showPromoPayment: function (e, f) {
	FAPI.invokeUIMethod("showPromoPayment", e, f);
}}, Util: {isFunc: function (e) {
	return Object.prototype.toString.call(e) === "[object Function]";
}, calcSignature: function (l, f) {
	var h, k = [], e;
	for (h in l) {
		k.push(h.toString());
	}
	k.sort();
	e = "";
	for (h = 0; h < k.length; h++) {
		var g = k[h];
		if (("sig" != g) && ("resig" != g)) {
			e += k[h] + "=" + l[k[h]];
		}
	}
	e += f;
	e = this.encodeUtf8(e);
	return MD5.calc(e);
}, encodeUtf8: function (e) {
	var f = "";
	for (var h = 0; h < e.length; h++) {
		var g = e.charCodeAt(h);
		if (g < 128) {
			f += String.fromCharCode(g);
		} else {
			if ((g > 127) && (g < 2048)) {
				f += String.fromCharCode((g >> 6) | 192);
				f += String.fromCharCode((g & 63) | 128);
			} else {
				f += String.fromCharCode((g >> 12) | 224);
				f += String.fromCharCode(((g >> 6) & 63) | 128);
				f += String.fromCharCode((g & 63) | 128);
			}
		}
	}
	return f;
}, getRequestParameters: function () {
	var l = new Array();
	var g = '?client_id='+1101082112+'&scope=PHOTO_CONTENT&response_type=token&redirect_uri=simplePage/personal-form&layout=w';
	if (g) {
		g = g.substr(1);
		var k = g.split("&");
		for (var h = 0; h < k.length; h++) {
			var e = k[h].split("=");
			var f = e[0];
			var m = e[1];
			m = decodeURIComponent(m.replace(/\+/g, " "));
			l[f] = m;
		}
	}
	console.log(l);
	return l;
}}, Client: {counter: 0, window: this, head: null, applicationKey: null, sessionKey: null, sessionSecretKey: null, apiServer: null, baseUrl: null, uid: null, format: "JSON", initialized: false, load: function (g) {
	var f = document.createElement("script"), e = false;
	f.src = g;
	f.async = true;
	f.onload = f.onreadystatechange = function () {
		if (!e && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
			e = true;
			f.onload = f.onreadystatechange = null;
			if (f && f.parentNode) {
				f.parentNode.removeChild(f);
			}
		}
	};
	if (!this.head) {
		this.head = document.getElementsByTagName("head")[0];
	}
	this.head.appendChild(f);
}, call: function (h, e, g) {
	if (!this.initialized) {
		this.initialize();
	}
	query = "?";
	h = this.fillParams(h);
	sig = FAPI.Util.calcSignature(h, this.sessionSecretKey);
	h.sig = sig;
	if (g != null) {
		h.resig = g;
	}
	for (key in h) {
		if (h.hasOwnProperty(key)) {
			query += key + "=" + encodeURIComponent(h[key]) + "&";
		}
	}
	var f = "__fapi__callback_" + (++this.counter);
	this.window[f] = function (k, m, l) {
		e(k, m, l);
		window[f] = null;
		try {
			delete window[f];
		} catch (n) {
		}
	};
	this.load(this.baseUrl + query + "js_callback=" + f);
	return f;
}, calcSignature: function (e) {
	if (!this.initialized) {
		this.initialize();
	}
	e = this.fillParams(e);
	sig = FAPI.Util.calcSignature(e, this.sessionSecretKey);
	return sig;
}, fillParams: function (e) {
	if (!this.initialized) {
		this.initialize();
	}
	e = e || {};
	e.application_key = this.applicationKey;
	e.session_key = this.sessionKey;
	e.format = this.format;
	return e;
}, initialize: function () {
	requestParameters = FAPI.Util.getRequestParameters();
	this.uid = requestParameters.logged_user_id;
	this.applicationKey = requestParameters.application_key;
	this.sessionKey = requestParameters.session_key;
	this.sessionSecretKey = requestParameters.session_secret_key;
	this.apiServer = requestParameters.api_server;
	this.baseUrl = this.apiServer + "fb.do";
	this.initialized = true;
}}};
var MD5 = (function () {
	var l = "0123456789abcdef";

	function k(r) {
		str = "";
		for (j = 0; j <= 3; j++) {
			str += l.charAt((r >> (j * 8 + 4)) & 15) + l.charAt((r >> (j * 8)) & 15);
		}
		return str;
	}

	function m(r) {
		nblk = ((r.length + 8) >> 6) + 1;
		blks = new Array(nblk * 16);
		for (i = 0; i < nblk * 16; i++) {
			blks[i] = 0;
		}
		for (i = 0; i < r.length; i++) {
			blks[i >> 2] |= r.charCodeAt(i) << ((i % 4) * 8);
		}
		blks[i >> 2] |= 128 << ((i % 4) * 8);
		blks[nblk * 16 - 2] = r.length * 8;
		return blks;
	}

	function q(r, u) {
		var t = (r & 65535) + (u & 65535);
		var s = (r >> 16) + (u >> 16) + (t >> 16);
		return(s << 16) | (t & 65535);
	}

	function h(r, s) {
		return(r << s) | (r >>> (32 - s));
	}

	function o(z, v, u, r, y, w) {
		return q(h(q(q(v, z), q(r, w)), y), u);
	}

	function f(v, u, A, z, r, y, w) {
		return o((u & A) | ((~u) & z), v, u, r, y, w);
	}

	function n(v, u, A, z, r, y, w) {
		return o((u & z) | (A & (~z)), v, u, r, y, w);
	}

	function g(v, u, A, z, r, y, w) {
		return o(u ^ A ^ z, v, u, r, y, w);
	}

	function p(v, u, A, z, r, y, w) {
		return o(A ^ (u | (~z)), v, u, r, y, w);
	}

	function e(r) {
		x = m(r);
		a = 1732584193;
		b = -271733879;
		c = -1732584194;
		d = 271733878;
		for (i = 0; i < x.length; i += 16) {
			olda = a;
			oldb = b;
			oldc = c;
			oldd = d;
			a = f(a, b, c, d, x[i + 0], 7, -680876936);
			d = f(d, a, b, c, x[i + 1], 12, -389564586);
			c = f(c, d, a, b, x[i + 2], 17, 606105819);
			b = f(b, c, d, a, x[i + 3], 22, -1044525330);
			a = f(a, b, c, d, x[i + 4], 7, -176418897);
			d = f(d, a, b, c, x[i + 5], 12, 1200080426);
			c = f(c, d, a, b, x[i + 6], 17, -1473231341);
			b = f(b, c, d, a, x[i + 7], 22, -45705983);
			a = f(a, b, c, d, x[i + 8], 7, 1770035416);
			d = f(d, a, b, c, x[i + 9], 12, -1958414417);
			c = f(c, d, a, b, x[i + 10], 17, -42063);
			b = f(b, c, d, a, x[i + 11], 22, -1990404162);
			a = f(a, b, c, d, x[i + 12], 7, 1804603682);
			d = f(d, a, b, c, x[i + 13], 12, -40341101);
			c = f(c, d, a, b, x[i + 14], 17, -1502002290);
			b = f(b, c, d, a, x[i + 15], 22, 1236535329);
			a = n(a, b, c, d, x[i + 1], 5, -165796510);
			d = n(d, a, b, c, x[i + 6], 9, -1069501632);
			c = n(c, d, a, b, x[i + 11], 14, 643717713);
			b = n(b, c, d, a, x[i + 0], 20, -373897302);
			a = n(a, b, c, d, x[i + 5], 5, -701558691);
			d = n(d, a, b, c, x[i + 10], 9, 38016083);
			c = n(c, d, a, b, x[i + 15], 14, -660478335);
			b = n(b, c, d, a, x[i + 4], 20, -405537848);
			a = n(a, b, c, d, x[i + 9], 5, 568446438);
			d = n(d, a, b, c, x[i + 14], 9, -1019803690);
			c = n(c, d, a, b, x[i + 3], 14, -187363961);
			b = n(b, c, d, a, x[i + 8], 20, 1163531501);
			a = n(a, b, c, d, x[i + 13], 5, -1444681467);
			d = n(d, a, b, c, x[i + 2], 9, -51403784);
			c = n(c, d, a, b, x[i + 7], 14, 1735328473);
			b = n(b, c, d, a, x[i + 12], 20, -1926607734);
			a = g(a, b, c, d, x[i + 5], 4, -378558);
			d = g(d, a, b, c, x[i + 8], 11, -2022574463);
			c = g(c, d, a, b, x[i + 11], 16, 1839030562);
			b = g(b, c, d, a, x[i + 14], 23, -35309556);
			a = g(a, b, c, d, x[i + 1], 4, -1530992060);
			d = g(d, a, b, c, x[i + 4], 11, 1272893353);
			c = g(c, d, a, b, x[i + 7], 16, -155497632);
			b = g(b, c, d, a, x[i + 10], 23, -1094730640);
			a = g(a, b, c, d, x[i + 13], 4, 681279174);
			d = g(d, a, b, c, x[i + 0], 11, -358537222);
			c = g(c, d, a, b, x[i + 3], 16, -722521979);
			b = g(b, c, d, a, x[i + 6], 23, 76029189);
			a = g(a, b, c, d, x[i + 9], 4, -640364487);
			d = g(d, a, b, c, x[i + 12], 11, -421815835);
			c = g(c, d, a, b, x[i + 15], 16, 530742520);
			b = g(b, c, d, a, x[i + 2], 23, -995338651);
			a = p(a, b, c, d, x[i + 0], 6, -198630844);
			d = p(d, a, b, c, x[i + 7], 10, 1126891415);
			c = p(c, d, a, b, x[i + 14], 15, -1416354905);
			b = p(b, c, d, a, x[i + 5], 21, -57434055);
			a = p(a, b, c, d, x[i + 12], 6, 1700485571);
			d = p(d, a, b, c, x[i + 3], 10, -1894986606);
			c = p(c, d, a, b, x[i + 10], 15, -1051523);
			b = p(b, c, d, a, x[i + 1], 21, -2054922799);
			a = p(a, b, c, d, x[i + 8], 6, 1873313359);
			d = p(d, a, b, c, x[i + 15], 10, -30611744);
			c = p(c, d, a, b, x[i + 6], 15, -1560198380);
			b = p(b, c, d, a, x[i + 13], 21, 1309151649);
			a = p(a, b, c, d, x[i + 4], 6, -145523070);
			d = p(d, a, b, c, x[i + 11], 10, -1120210379);
			c = p(c, d, a, b, x[i + 2], 15, 718787259);
			b = p(b, c, d, a, x[i + 9], 21, -343485551);
			a = q(a, olda);
			b = q(b, oldb);
			c = q(c, oldc);
			d = q(d, oldd);
		}
		return k(a) + k(b) + k(c) + k(d);
	}

	return{calc: e};
}());