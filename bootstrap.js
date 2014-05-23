const {classes: Cc, interfaces: Ci, utils: Cu} = Components;
const self = {
	name: 'AustralisBookBar',
	path: {
		chrome: 'chrome://australisbookbar/content/'
	},
	aData: 0,
};

const myServices = {};
var cssUri;

Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');
XPCOMUtils.defineLazyGetter(myServices, 'as', function(){ return Cc['@mozilla.org/alerts-service;1'].getService(Ci.nsIAlertsService) });
XPCOMUtils.defineLazyGetter(myServices, 'sss', function(){ return Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService) });

/*start - windowlistener*/
var windowListener = {
	//DO NOT EDIT HERE
	onOpenWindow: function (aXULWindow) {
		// Wait for the window to finish loading
		let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
		aDOMWindow.addEventListener("load", function () {
			aDOMWindow.removeEventListener("load", arguments.callee, false);
			windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
		}, false);
	},
	onCloseWindow: function (aXULWindow) {},
	onWindowTitleChange: function (aXULWindow, aNewTitle) {},
	register: function () {
		// Load into any existing windows
		let XULWindows = Services.wm.getXULWindowEnumerator(null);
		while (XULWindows.hasMoreElements()) {
			let aXULWindow = XULWindows.getNext();
			let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
			windowListener.loadIntoWindow(aDOMWindow, aXULWindow);
		}
		// Listen to new windows
		Services.wm.addListener(windowListener);
	},
	unregister: function () {
		// Unload from any existing windows
		let XULWindows = Services.wm.getXULWindowEnumerator(null);
		while (XULWindows.hasMoreElements()) {
			let aXULWindow = XULWindows.getNext();
			let aDOMWindow = aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowInternal || Ci.nsIDOMWindow);
			windowListener.unloadFromWindow(aDOMWindow, aXULWindow);
		}
		//Stop listening so future added windows dont get this attached
		Services.wm.removeListener(windowListener);
	},
	//END - DO NOT EDIT HERE
	loadIntoWindow: function (aDOMWindow, aXULWindow) {
		if (!aDOMWindow) {
			return;
		}
		var PlacesToolbar = aDOMWndow.document.querySelector('#PlacesToolbar');
		if (PlacesToolbar && aDOMWndow.PlacesToolbar) {
			PlacesToolbar.removeAttribute('tooltip');
			PlacesToolbar.removeAttribute('popupsinherittooltip');
			aDOMWindow.PlacesToolbar.prototype._onMouseOver = function PT__onMouseOver(aEvent) {
			    let button = aEvent.target;
			    if (button.parentNode == this._rootElt && button._placesNode &&
			        PlacesUtils.nodeIsURI(button._placesNode))
			      aDOMWindow.XULBrowserWindow.setOverLink(aEvent.target._placesNode.title + ' (' + aEvent.target._placesNode.uri + ')', null);
			}
        		aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils).loadSheet(cssUri, 1);
		}
		
	},
	unloadFromWindow: function (aDOMWindow, aXULWindow) {
		if (!aDOMWindow) {
			return;
		}
		var PlacesToolbar = aDOMWndow.document.querySelector('#PlacesToolbar');
		if (PlacesToolbar && aDOMWndow.PlacesToolbar) {
			PlacesToolbar.setAttribute('tooltip', 'bhTooltip');
			PlacesToolbar.setAttribute('popupsinherittooltip', 'true');
			aDOMWindow.PlacesToolbar.prototype._onMouseOver = function PT__onMouseOver(aEvent) {
			    let button = aEvent.target;
			    if (button.parentNode == this._rootElt && button._placesNode &&
			        PlacesUtils.nodeIsURI(button._placesNode))
			      aDOMWindow.XULBrowserWindow.seOverLink(aEvent.target._placesNode.title + ' (' + aEvent.target._placesNode.uri + ')', null);
			}
			aXULWindow.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIDOMWindowUtils).removeSheet(cssUri, 1);
		}
	}
};
/*end - windowlistener*/

function startup(aData, aReason) {
	self.aData = aData;
	//var css = '';
	//css += '.bookmark-item .toolbarbutton-text, .bookmark-item .toolbarbutton-multiline-text { display:none !important; }';
	//css += '.bookmark-item .toolbarbutton-icon { -moz-margin-end:0 !important; }';
	//var cssEnc = encodeURIComponent(css);
	var newURIParam = {
		aURL: self.aData.resourceURI.spec + 'main.css', //'data:text/css,' + cssEnc,
		//aURL: 'data:text/css,' + cssEnc,
		aOriginCharset: null,
		aBaseURI: null
	}
	cssUri = Services.io.newURI(newURIParam.aURL, newURIParam.aOriginCharset, newURIParam.aBaseURI);
	//myServices.sss.loadAndRegisterSheet(cssUri, myServices.sss.USER_SHEET);
	
	windowListener.register();
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	
	windowListener.unregister();
	myServices.sss.unregisterSheet(cssUri, myServices.sss.USER_SHEET);
}

function install() {}

function uninstall() {}
