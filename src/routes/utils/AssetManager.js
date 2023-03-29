const { isDevEnv } = require('../../common/env-utils');
const { getFileUrl } = require('./asset-helper');
const isDev = isDevEnv();

const fundamentalScripts = [
    { name: 'react', file: isDev ? 'react.development.js' : 'react.production.min.js' },
    { name: 'react-dom', file: isDev ? 'react-dom.development.js' : 'react-dom.production.min.js' },
    { name: 'mobx', file: isDev ? 'mobx.umd.development.js' : 'mobx.umd.production.min.js' },
    {
        name: 'mobx-react-lite',
        file: isDev ? 'mobxreactlite.umd.development.js' : 'mobxreactlite.umd.production.min.js'
    }
];

class AssetManager {
    constructor() {
        this._fundamentalScripts = [];
        this._fundamentalStyles = [];
        this._featureScripts = [];
        this._featureStyles = [];
    }

    // Load external modules
    init() {
        fundamentalScripts.forEach((script) => {
            this._addScripts(this._fundamentalScripts, getFileUrl(script));
        });
    }

    addFeatureAsset(name) {
        // Add local feature assets
        if (name === this._projectPackageName) {
            const localFeatureScript = { name, file: isDev ? '/assets/bundle.js' : '/assets/bundle.min.js' };
            const localFeatureStyle = { name, file: '/assets/index.css' };
            this._addScripts(this._featureScripts, localFeatureScript);
            this._addStyles(this._featureStyles, localFeatureStyle);
            return;
        }

        // Add remote feature assets
        const remoteFeatureScript = { name, file: isDev ? 'bundle.js' : 'bundle.min.js' };
        const remoteFeatureStyle = { name, file: 'index.css' };
        this._addScripts(this._featureScripts, remoteFeatureScript);
        this._addStyles(this._featureStyles, remoteFeatureStyle);
    }

    _addScripts(scripts, url) {
        if (url && scripts.indexOf(url) < 0) {
            scripts.push(url);
        }
    }

    _addStyles(styles, url) {
        if (url && styles.indexOf(url) < 0) {
            styles.push(url);
        }
    }

    getStylesUrls() {
        return [...this._fundamentalStyles, ...this._featureStyles];
    }

    getScriptsUrls() {
        return [...this._fundamentalScripts, ...this._featureScripts];
    }
}

module.exports = AssetManager;
