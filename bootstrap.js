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
	myServices.sss.loadAndRegisterSheet(cssUri, myServices.sss.USER_SHEET);
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) return;
	
	myServices.sss.unregisterSheet(cssUri, myServices.sss.USER_SHEET);
}

function install() {}

function uninstall() {}
