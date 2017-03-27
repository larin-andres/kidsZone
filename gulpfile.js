const gulp = require('gulp');
const webpack = require('webpack');
const gutil = require('gutil');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('./webpack.config');

//var config = require('./webpack.config_old');

const onBuild = (done) => {
	return function(err, stats) {
		if (err) {
			gutil.log('Error', err);
			if (done) {
				done();
			}
		} else {
			Object.keys(stats.compilation.assets).forEach(function(key) {
				gutil.log('Webpack: output ', key);
			});
			gutil.log('Webpack: ', 'finished ', stats.compilation.name);
			if (done) {
				done();
			}
		}
	}
}

gulp.task('webpack-dev-server', function( done) {


	let _webpackConfig = webpackConfig();

	let config = {
		host: 'localhost'
		, port: 9000
		, hot: false
		, historyApiFallback: true
		//, inline: true
		, stats: 'minimal'//{ colors: true }
		//, noInfo: true
		// , proxy: {
		// 	// '*': 'http://localhost:3000' //на стандартный порт Express
		// }
		, publicPath: _webpackConfig.output.publicPath
		, contentBase: _webpackConfig.context + '/**/*.*'
		, watchContentBase: true
	}

	//"serve": "webpack-dev-server --open --inline --progress --port 8080",
	//"build": "rimraf dist && webpack --config config/webpack.prod.js --progress --profile --bail"

	var server = new WebpackDevServer( webpack( _webpackConfig), config).listen( config.port, config.host, function( err) {
        if(err) throw new gutil.PluginError('webpack-dev-server', err);

		gutil.log('[webpack-dev-server]', `http://${config.host}:${config.port}/`);
		done();
    });
});

gulp.task( 'build', function( done){
	webpack( webpackConfig()).run(onBuild(done));
});

gulp.task( 'dist', function( done){
	webpack( webpackConfig('production')).run(onBuild(done));
});

gulp.task('default', [ 'build']);