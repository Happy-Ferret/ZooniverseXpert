// Imports
const {classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu, Constructor: CC} = Components;

// Cu.import('resource://gre/modules/devtools/Console.jsm');
Cu.import('resource://gre/modules/osfile.jsm');
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
var gAngScope;
// var gAngInjector;

var myServices = {};
XPCOMUtils.defineLazyGetter(myServices, 'sb', function () { return Services.strings.createBundle(core.addon.path.locale + 'app.properties?' + core.addon.cache_key); /* Randomize URI to work around bug 719376 */ });

var	ANG_APP = angular.module('zooniversexpert', [])
	.controller('BodyController', ['$scope', function($scope) {
		
		var MODULE = this;
		
		var gAngBody = angular.element(document.body);
		gAngScope = gAngBody.scope();
		// gAngInjector = gAngBody.injector();
		
		
	}]);

function onPageReady() {
	alert(myServices.sb.GetStringFromName('welcome-msg'))
}
document.addEventListener('DOMContentLoaded', onPageReady, false);