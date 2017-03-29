var webpack = require('webpack');

module.exports ={
    entry: {
        app: ['webpack/hot/dev-server', './components/entry.js']
    },

    output: {
        path: './public/built',
        filename: 'bundle.js',
        publicPath: 'https://localhost:8080/built/'
    },

    devServer: {
        contentBase: './public',
        publicPath: 'https://localhost:8080/build/'
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react', 'stage-2']
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/, loader: 'style-loader!css-loader'
            }
        ]
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.IgnorePlugin(new RegExp("^(fs|ipc)$"))
    ]
}
