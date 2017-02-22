/**
 * Configuration for Webpack bandler.
 * Based on Webpack 2 documentation
 */

var webpack = require('webpack');
var path = require('path');

var config = require('../../config.json');
var mode = require('./mode.js');

const JS_DEV = path.resolve(config.root.dev, config.js.dev);
const JS_DIST = path.resolve(config.root.dist, config.js.dist);

module.exports = function(extractVendorLibs){
	var webpackConfig = {
		context: JS_DEV,
		entry: {
			app: [
				"./main.js"
			]
		},
		module: {
			loaders: [
			    {
			      test: /\.js$/,
			      exclude: /node_modules/,
			      loader: 'babel-loader',
			      query: {
			        presets: ["es2015"]
			      }
			    }
		  	]
		},
		output: { 
			path: JS_DIST,
			filename: 'bundle.js',
			publicPath: config.js.dist
		},
		resolve: {
			modules: [JS_DEV, "node_modules", "bower_components"],
		    extensions: config.js.extensions
		},
		plugins: [
			new webpack.ProvidePlugin({
		        jQuery: 'jquery',
		        $: 'jquery',
		        jquery: 'jquery'
		    })
		]
	};

	if (mode.production) {
		webpackConfig.plugins.push(
			new webpack.optimize.UglifyJsPlugin({
			    compress: { warnings: false }
	    	}),
		 	new webpack.NoEmitOnErrorsPlugin()
		)
	}else {
		webpackConfig.devtool = 'inline-source-map'
		webpackConfig.entry.app.unshift('webpack-hot-middleware/client?reload=true')
		webpackConfig.plugins.push(
			new webpack.HotModuleReplacementPlugin()
		)
	}

	if(extractVendorLibs) {
		webpackConfig.plugins.push(
			new webpack.optimize.CommonsChunkPlugin({
				name: 'vendor',
				filename: 'vendor.js'
			})
		);
    }
    return webpackConfig;
};