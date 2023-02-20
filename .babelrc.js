module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    esmodules: true
                },
                useBuildIns: 'usage'
            }
        ],
        '@babel/preset-react'
    ],
    plugins: [
        [
            '@babel/plugin-proposal-class-properties',
            {
                loose: false
            }
        ],
        [
            '@babel/plugin-transform-runtime',
            {
                helpers: true,
                regenerator: true
            }
        ]
    ]
};
