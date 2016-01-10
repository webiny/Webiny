class Injector {

	constructor() {
		this.container = new Bottle();
        this.description = 'Injector is a dependency injection micro container based on Bottle: https://github.com/young-steveo/bottlejs';
	}

	get(name) {
		return this.container.container[name];
	}

	constant(name, value) {
		this.container.constant(name, value);

		return this;
	}

	decorator(name, func) {
		this.container.decorator(name, func);

		return this;
	}

	digest(services) {
		this.container.digest(services);

		return this;
	}

	factory(name, factory) {
		this.container.factory(name, factory);

		return this;
	}

	middleware(name, func) {
		this.container.middleware(name, func);

		return this;
	}

	provider(name, provider) {
		this.container.provider(name, provider);

		return this;
	}

	service(name, construct, ...dependencies) {
		this.container.service(name, construct, ...dependencies);
	}

	value(name, value) {
		this.container.value(name, value);

		return this;
	}
}

export default new Injector;
