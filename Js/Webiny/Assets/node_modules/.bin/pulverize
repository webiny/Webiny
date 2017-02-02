#!/usr/bin/env node

var program = require('commander'),
    pulverizr = require('./pulverizr'),
    util = require('util'),
    Log = require('coloured-log'),
    log;

program
  .version(require('./package').version)
  .usage('[options] <file...>')
  .option('-a, --aggressive', 'Uses more aggressive compression algorithms (takes longer, works better)')
  .option('--dry-run', 'Print summary but don\'t actually modify files')
  .option('-q, --quiet', 'Pulverizer will not report')
  .option('-R, --recursive', 'Recurse through directories')
  .option('-v, --verbose', 'Verbose mode');

program.on('--help', function () {
  console.log('  Examples:');
  console.log('');
  console.log('    Single File');
  console.log('     pulverize image.png');
  console.log('');
  console.log('    Single Directory');
  console.log('     pulverize /var/www/mysite.com/images/products/backgrounds');
  console.log('');
  console.log('    Multiple Files');
  console.log('     pulverize foo.png bar.png baz.png qux.png');
  console.log('');
  console.log('    Recursive Directory');
  console.log('     pulverize -R -- /var/www/mysite.com/images');
  console.log('');
});

program.parse(process.argv);

if (program.quiet) {
  log = new Log(-1);
} else if (program.verbose) {
  log = new Log(Log.DEBUG);
} else {
  log = new Log(Log.INFO);
}

var job = pulverizr.createJob(program.args, program);

job.on('start', function () {
  log.info('Beginning compressiong job');
});

job.on('compression', function (data) {
  log.debug(data.filename + ': ' + parseInt(data.oldSize - data.newSize, 10) + ' byte difference');
});

job.on('error-compression', function (err) {
  var error = err.error;
  
  log.warning('Couldn\'t compress "' + err.filename + '" with ' + err.compressor);
  
  if (error) {
    error = error.split('\n');
    error.forEach(function (line) {
      if (line) {
        log.error(line);
      }
    });
  }
});

job.on('error-compressor', function (err) {
  log.notice('Couldn\'t find "' + err.compressor + '". Skipping on: ' + err.filename);
});

job.on('finish', function (report) {
  if (program.dryRun) {
    log.info('Files were not modified because this was a dry run.');
  }
  
  log.info('Finished compressiong job');
  log.info('Scanned ' + report.fileCount + ' files');
  log.info('Saved ' + Math.ceil((r.size.start - r.size.end) / 1024) + 'kb');
});

job.run();
