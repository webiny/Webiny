var TraceurLoader = traceur.runtime.TraceurLoader;
var webLoader = traceur.runtime.webLoader;

var traceurSystem = System;
class SystemLoader extends TraceurLoader {
	constructor() {
		super(webLoader, window.location.href);
		this.componentsRegex = /Apps\/([\w+]*)\/([\w+]*)\/Js\/Components\/([\w+]*)\/([\w+]*)/;
		this.storesRegex = /Apps\/([\w+]*)\/([\w+]*)\/Js\/Stores\/([\w+]*)/;
	}

	normalize(name, referrerName, referrerAddress) {
		if (this.componentsRegex.exec(name)){
			var newPath = name.replace(this.componentsRegex, 'Apps/$1/Build/Development/Backend/Components/$2/$3');
			return newPath;
		}

		if (this.storesRegex.exec(name)){
			var newPath = name.replace(this.storesRegex, 'Apps/$1/Backend/$2/Js/Stores/$3');
			return newPath;
		}

		return super.normalize(name, referrerName, referrerAddress);
	}
}
System = new SystemLoader();