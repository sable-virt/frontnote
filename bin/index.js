#!/usr/bin/env node
'use strict';

const extend = require('extend');
const program = require('commander');
const path = require('path');
const gaze = require('gaze');
const pkg = require('../package.json');
const DEFAULT_OPTION = require('../lib/const/options');
const frontnote = require('../lib/frontnote');

program._name = 'frontnote';
program
    .version(pkg.version)
    .description('Frontnote CLI')
    .usage('<pattern> <out> [options]')
    .option('-C, --clean', 'clean dest directory')
    .option('-c, --config [path]', 'config file path')
    .option('-t, --template [path]', 'template file path')
    .option('-a, --assets [path]', 'assets file path')
    .option('-v, --verbose', 'verbose')
    .option('-o, --overview [path]', 'overview markdown file path')
    .option('-w, --watch', 'watch files');
program.parse(process.argv);

let options = extend({},DEFAULT_OPTION);
if (program.config) {
    let file = require(path.join(process.cwd(),program.config));
    options = extend(options,file);
}

let args = program.args;
if (args.length < 1) throw new Error('At least one argument');
if (args[1]) options.out = args[1];
if (program.clean) options.clean = program.clean;
if (program.overview) options.overview = program.overview;
if (program.template) options.template = program.template;
if (program.assets) options.assets = program.assets;
if (program.verbose) options.verbose = program.verbose;

let fn = new frontnote(options);
let pattern = path.join(process.cwd(), args[0]);

if (program.watch) {
    gaze(pattern, (err, watcher) => {
        watcher.on('all', function(filepath) {
            fn.render(pattern).subscribe(() => {
            }, (e) => {
                console.error(e);
            });
        });
    });
} else {
    fn.render(pattern).subscribe((result) => {
    }, (e) => {
        console.error(e);
    });
}