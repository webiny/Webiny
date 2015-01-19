/**
 *  var fn = () => {
 * 	 	return 4;
 *  }
 *
 *  var api = () => {
 * 	 	return Http.get(_apiUrl+'/Todo/Todo/Item');
 *  }
 *
 *  Q.when(fn()).then((res) => {
 * 	 	console.log(res)
 *  });
 *
 *  Q.all([api(), fn()]).then((resolves) => {
 * 	 	console.log(resolves)
 *  });
 */

class Q {

	/**
	 * Returns a promise
	 *
	 * @param workers
	 * @returns {*}
	 */
	static when(param) {

		if (param instanceof Promise) {
			return param;
		}

		return Promise.all([param]).then((res) => {
			return res[0];
		}, (res) => {
			return res[0];
		});
	}

	/**
	 * Returns a promise that resolves when all of the promises in the iterable argument have resolved.
	 *
	 * @param workers
	 * @returns {*}
	 */
	static all(workers) {
		return Promise.all(workers);
	}

	/**
	 * Returns a promise that resolves or rejects as soon as one of the promises in
	 * the iterable resolves or rejects, with the value or reason from that promise.
	 *
	 * @param workers
	 * @returns {*}
	 */
	static race(workers) {
		return Promise.race(workers);
	}
}

export default Q;