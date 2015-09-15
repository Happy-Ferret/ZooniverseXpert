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
		
		MODULE.imgExts = [
			'JPG',
			'PNG'
		];
		MODULE.imgExtSelected = 'JPG';
		MODULE.id = '6076';
		MODULE.id_length = '6';
		MODULE.batch_size = 10;
		MODULE.url_prefix = 'http://zooniverse-export.s3-website-us-east-1.amazonaws.com/21484_1000_D35_Season%202_Set%201_EK';
		MODULE.thumb_width = 100;
		MODULE.thumb_height = 100;
		
		MODULE.gallery = [];
		/* entries are objects
			{
				url: ''
			}
		*/
		
		var idPreceededByZeroes = function(aId) {
			var str = aId + '';
			while (str.length < MODULE.id_length) {
				str = '0' + str;
			}
			return str;
		}
		
		MODULE.generate = function() {			
			MODULE.gallery = [];
			
			// push in target
			MODULE.gallery.push(
				{
					url: MODULE.url_prefix + idPreceededByZeroes(MODULE.id) + '.' + MODULE.imgExtSelected
				}
			);
			
			// find > id until find a broken image
			for (var i=1; i<=parseInt(MODULE.batch_size); i++) {
				MODULE.gallery.push(
					{
						url: MODULE.url_prefix + idPreceededByZeroes(parseInt(MODULE.id) + i) + '.' + MODULE.imgExtSelected
					}
				);
			}
		}
		
		MODULE.generateNext = function() {
			MODULE.id = parseInt(MODULE.id) + parseInt(MODULE.batch_size);
			MODULE.generate();
		}
		
		MODULE.showThumb = function($event, aEntry) {
			// alert($event);
			if ($event.ctrlKey || $event.shiftKey || $event.metaKey || $event.altKey) {
				// do nothing, user is probably shift + clickikng for new window OR ctrl + clicking for new tab OR ctrl + shift + clicking for new focused tab
			} else {
				prompt(myServices.sb.GetStringFromName('msg-on-what-i-would-do'), aEntry.url);
				// show gallery popup and prevent click so it doesnt navigate to the url
				$event.preventDefault();
			}
		}
	}]);

function onPageReady() {
	// alert(myServices.sb.GetStringFromName('welcome-msg'));
}
document.addEventListener('DOMContentLoaded', onPageReady, false);