import {TraceurLoader} from 'traceur@0.0/src/runtime/TraceurLoader';
import {webLoader} from 'traceur@0.0/src/runtime/webLoader';
console.log('webLoader' , webLoader);
var traceurSystem = System;
class SystemLoader extends TraceurLoader {
	constructor() {
		super(webLoader, window.location.href);
	}
	normalize(name, referrerName, referrerAddress) {
		console.log(name);

		if (name == 'Foo/Bar'){
			return 'App/Foo/Module/Bar';
		}

		return super.normalize(name, referrerName, referrerAddress);
	}
}
System = new SystemLoader();

export default SystemLoader;

System.import('Foo/Bar').then(function() {
	console.log('yeah');
}, function(ex) {
	console.error(ex);
});
