/**
 * RouterEvent instance is passed to all Router generated processes:
 * - beforeStart
 * - routeWillChange
 */
class RouterEvent {
	constructor(route) {
		this.route = route;
		this.stopped = false;
		this.goTo = null;
		this.goToParams = null;
	}

	stop() {
		this.stopped = true;
		return this;
	}

	isStopped() {
		return this.stopped;
	}

	goToRoute(route, params = null) {
		this.goTo = route;
		this.goToParams = params;
		return this;
	}
}

export default RouterEvent;