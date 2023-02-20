module.exports = {
    env: {
        browser: true,
        node: true,
        es2021: true
    },
    extends: ['aribnb', 'plugin:react/recommended'],
    parser: '@babel/eslint-parser',
    parserOption: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugin: ['react'],
    rules: {
        'class-method-use-this': 0,
        'comma-dangle': [2, 'never'],
        'func-names': 0,
        'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
        'linebreak-style': [0, 'unix']
    }
};
