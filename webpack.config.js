var webpack = require('webpack');

module.exports = {
    // entry and output options
    devtool: 'cheap-module-source-map',
    entry: getEntry(),
    output: {
        path: __dirname + '/dist',
        filename: "bundle.js",
        publicPath: '/static/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: getPresets()
                }
            },
            {
                test: /\.scss$/,
                loaders: ['style','css','sass']
            }
        ]
    },
    plugins: loadPlugins(),
    devServer: {
        hot: true,
        contentBase: './'
    }
}

function getEntry() {
    var entry = [];

    if(process.env.NODE_ENV !== 'production') {
        entry.push('webpack-dev-server/client?http://localhost:8080');
        entry.push('webpack/hot/only-dev-server');
    }

    entry.push('./src/js/index.js');

    console.log(entry);

    return entry;
}

function loadPlugins() {
    var vars = [];
    if(process.env.NODE_ENV !== 'production')
        vars.push(new webpack.HotModuleReplacementPlugin());
    else
        vars.push(new webpack.DefinePlugin({
            "process.env.NODE_ENV":JSON.stringify("production")
        }));

    console.log(vars);

    return vars;
}

function getPresets() {
    var presets = ['stage-0', 'es2015', 'react'];
    if(process.env.NODE_ENV !== 'production')
        presets.push('react-hmre');

    console.log(presets);
    return presets;
}