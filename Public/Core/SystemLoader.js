var TraceurLoader = traceur.runtime.TraceurLoader;
var webLoader = traceur.runtime.webLoader;

var traceurSystem = System;
class SystemLoader extends TraceurLoader {
	constructor() {
		super(webLoader, window.location.href);
		this.componentsRegex = /Apps\/([\w+]*)\/Backend\/([\w+]*)\/Js\/Components\/([\w+]*)\/([\w+]*)/;
	}

	normalize(name, referrerName, referrerAddress) {
		if (this.componentsRegex.exec(name)){
			var newPath = name.replace(this.componentsRegex, 'Apps/$1/Build/Development/Backend/Components/$2/$3');
			//console.log(name+" => ", newPath);
			return newPath;
		}

		return super.normalize(name, referrerName, referrerAddress);
	}
}
System = new SystemLoader();