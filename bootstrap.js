// Imports
const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;
Cm.QueryInterface(Ci.nsIComponentRegistrar);
Cu.import('resource://gre/modules/devtools/Console.jsm');
const {TextDecoder, TextEncoder, OS} = Cu.import('resource://gre/modules/osfile.jsm', {});
Cu.import('resource://gre/modules/Services.jsm');
Cu.import('resource://gre/modules/XPCOMUtils.jsm');

// Globals
const core = {
	addon: {
		name: 'ZooniverseXpert',
		id: 'ZooniverseXpert@jetpack',
		path: {
			name: 'zooniversexpert',
			content: 'chrome://zooniversexpert/content/',
			images: 'chrome://zooniversexpert/content/resources/images/',
			locale: 'chrome://zooniversexpert/locale/',
			resources: 'chrome://zooniversexpert/content/resources/',
			scripts: 'chrome://zooniversexpert/content/resources/scripts/',
			styles: 'chrome://zooniversexpert/content/resources/styles/'
		},
		cache_key: Math.random() // set to version on release
	},
	os: {
		name: OS.Constants.Sys.Name.toLowerCase(),
		toolkit: Services.appinfo.widgetToolkit.toLowerCase(),
		xpcomabi: Services.appinfo.XPCOMABI
	},
	firefox: {
		pid: Services.appinfo.processID,
		version: Services.appinfo.version
	}
};

const JETPACK_DIR_BASENAME = 'jetpack';
const myPrefBranch = 'extensions.' + core.addon.id + '.';

// Lazy Imports
const myServices = {};
XPCOMUtils.defineLazyGetter(myServices, 'sb', function () { return Services.strings.createBundle(core.addon.path.locale + 'bootstrap.properties?' + core.addon.cache_key); /* Randomize URI to work around bug 719376 */ });

// START - Addon Functionalities					
// start - about module
var aboutFactory_page;
function AboutPage() {}
AboutPage.prototype = Object.freeze({
	classDescription: 'HTML5 Application for ZooniverseXpert', //myServices.sb.GetStringFromName('about-page_desc'),
	contractID: '@mozilla.org/network/protocol/about;1?what=zoo',
	classID: Components.ID('{add649d0-5b88-11e5-a837-0800200c9a66}'),
	QueryInterface: XPCOMUtils.generateQI([Ci.nsIAboutModule]),

	getURIFlags: function(aURI) {
		return Ci.nsIAboutModule.ALLOW_SCRIPT | Ci.nsIAboutModule.URI_MUST_LOAD_IN_CHILD;
	},

	newChannel: function(aURI, aSecurity) {

		var channel = Services.io.newChannel(core.addon.path.content + 'app.xhtml', null, null);
		channel.originalURI = aURI;
		return channel;
	}
});

function AboutFactory(component) {
	this.createInstance = function(outer, iid) {
		if (outer) {
			throw Cr.NS_ERROR_NO_AGGREGATION;
		}
		return new component();
	};
	this.register = function() {
		Cm.registerFactory(component.prototype.classID, component.prototype.classDescription, component.prototype.contractID, this);
	};
	this.unregister = function() {
		Cm.unregisterFactory(component.prototype.classID, this);
	}
	Object.freeze(this);
	this.register();
}
// end - about module
// END - Addon Functionalities


function install() {}
function uninstall(aData, aReason) {}

function startup(aData, aReason) {
	
	aboutFactory_page = new AboutFactory(AboutPage);
	
	if (aReason == ADDON_INSTALL) {
		// user just installed this, so lets open the app for them
		var cWin = Services.wm.getMostRecentWindow('navigator:browser');
		if (cWin) {
			cWin.gBrowser.loadOneTab('about:zoo', {inBackground:false});
		}
	}
	
}

function shutdown(aData, aReason) {
	if (aReason == APP_SHUTDOWN) { return }
	
	aboutFactory_page.unregister();
	
}