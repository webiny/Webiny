class FileUploader {

	constructor(api) {
		this.api = api;
		this.pending = [];
		this.inProgress = null;
	}

	upload(file, progress = _.noop, done = _.noop) {
		if(!progress){
			progress = _.noop;
		}
		this.pending.push({file, progress, done});
		this.process();
	}

	process() {
		if (this.inProgress || !this.pending.length) {
			return;
		}

		this.inProgress = this.pending.shift();

		var image = this.inProgress.file;
		var progressHandler = (pe) => {
			var percentage = Math.round(pe.loaded / pe.total * 100);
			this.inProgress.progress(percentage, pe);
		};
		var done = this.inProgress.done;

		var uploadDone = (apiResponse) => {
			this.inProgress = null;
			done(apiResponse.getData());
			this.process();
		};

		if (image.id) {
			this.api.patch(image.id, image, {}, {progress: progressHandler}).then(uploadDone);
		} else {
			this.api.post('', image, {}, {progress: progressHandler}).then(uploadDone);
		}
	}
}

export default FileUploader;