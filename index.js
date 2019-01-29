#!/usr/bin/env node

const { exec } = require('child_process');
const CURR_DIR = process.cwd();

const executeCommand = (name, options, pipe = false) => {
    return new Promise((resolve, reject) => {
        const child = exec(name, options, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            resolve(stdout || stderr);
        });
        if (pipe && child.stdout) {
            child.stdout.on('data', (data) => {
                console.log(data.toString());
            });
        }
    });
};

console.log('Installing required packages...');
executeCommand('composer install --quiet --no-interaction --ignore-platform-reqs', { cwd: CURR_DIR })
    .then((data) => {
        console.log(data);
        console.log('Required packages installed.');
    })
    .then(() => executeCommand('php artisan cache:clear', { cwd: CURR_DIR }))
    .then(() => console.log('Cache cleared.'))
    .then(() => executeCommand('php artisan migrate', { cwd: CURR_DIR }))
    .then(() => console.log('Database migrated.'))
    .then(() => console.log('Starting server'))
    .then(() => executeCommand('php artisan serve', { cwd: CURR_DIR }, true))
    .catch((err) => console.error(err));

