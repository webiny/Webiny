class FileUploader {

    constructor(api) {
        this.api = api;
        this.pending = [];
        this.inProgress = null;
        this.request = null;
    }

    upload(file, progress = _.noop, done = _.noop, error = _.noop) {
        if (!progress) {
            progress = _.noop;
        }
        this.pending.push({file, progress, done, error});
        this.process();
    }

    process() {
        if (this.inProgress || !this.pending.length) {
            return;
        }

        this.inProgress = this.pending.shift();

        const image = this.inProgress.file;
        const progressHandler = (pe) => {
            const percentage = Math.round(pe.loaded / pe.total * 100);
            this.inProgress.progress(percentage, pe);
        };
        const done = this.inProgress.done;
        const error = this.inProgress.error || _.noop;

        const uploadDone = (apiResponse) => {
            this.inProgress = null;
            if (!apiResponse.isError()) {
                done(apiResponse.getData());
            } else {
                error(apiResponse);
            }
            this.process();
        };

        if (image.id) {
            this.request = this.api.setBody(image).execute('PATCH', image.id, null, {}, {progress: progressHandler}).then(uploadDone);
        } else {
            this.request = this.api.setBody(image).execute('POST', '/', null, {}, {progress: progressHandler}).then(uploadDone);
        }
    }
}

export default FileUploader;