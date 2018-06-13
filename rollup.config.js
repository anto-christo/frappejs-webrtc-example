const path = require('path');
const { getJSConfig, getCSSConfig } = require('frappejs/config/rollup');

module.exports = [
    getJSConfig({
        input: path.resolve(__dirname, 'src/index.js'),
        output: path.resolve(__dirname, 'dist/bundle.js'),
    })
]