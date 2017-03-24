const path = require('path')
	, webpack = require('webpack');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function( NODE_ENV) {
	//Константы

	NODE_ENV = NODE_ENV || process.env.NODE_ENV || 'development' //Если NODE_ENV не задан, то работаем в 'development', на реальном сервере надо указать 'production'

	//Путь к исходникам и
	const BUILD_DIR = NODE_ENV == 'development'? 'build' : 'dist';
	const SRC_DIR = 'src';

	//Куда складывать различные файлы, использует file-loader и подобные модули.
	// Одинаковые файлы имеют одинаковый хеш, хеш в названии помогает избежать дублирования.
	// Название и путь в build всеравно, главное что в соурсниках он читабельный.
	// [hash:6] для создания подпапок, при большом количестве файлов в одном каталоге, доступ к файлу сильно замедляеться, это особенность файловой системы, обычно это случается при 10к+ файлов в одной папке, что вполне возможно если все асеты в одной папке будут.
	const ASSETS_PATH = 'assets/[hash:6]/[hash]';

	var options = {
		entry: { //Точки входа, вебпак сделает в итоге один скрипт из указаного, добавив в него все зависимости
			//app: [ 'app'] //Это главный скрипт всего приложения
			app: [ 'webpack-dev-server/client', 'app'] //Это главный скрипт всего приложения
			//app: [ 'webpack/hot/dev-server', 'webpack-dev-server/client', 'app'] //Это главный скрипт всего приложения
			//app: [ 'webpack-dev-server/client', 'webpack/hot/dev-server', 'app'] //Это главный скрипт всего приложения
			//,app2: 'xyz/app2' //Просто пример

		}, externals: { //чтобы при require подставлять какую-то переменную, например let $ = require( 'jquery') в локальный $ подставит значение глобального $, который был создан подключеным вручную гдето в html библиотекой jquery
			//script(src = 'https://cdnjs.cloudflare.com/ajax/libs/angular-truncate/0.1.2/truncate.min.js')
			//script(src = 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.5.9/angular-route.min.js')
			//$: 'jquery' //
		}, plugins: [
			new CopyWebpackPlugin([ //копирует статичные файлы без их запроса где либо в require. Доки https://www.npmjs.com/package/copy-webpack-plugin
				//{ from: path.join( SRC_DIR, 'test.xyz')} //просто примеры
				//, { from: path.join( SRC_DIR, 'test.xyz')}
				//{ from: '123.html'}
			])
			, new webpack.ProvidePlugin({ //как externals только создает глобальные переменные, чтобы можно было использовать их без require
				//$: 'jquery',
				//jQuery: 'jquery',
				//, _: 'lodash'
			})
		], resolve: { //Где искать модули
			moduleDirectories: [
				'node_modules'
			]//, extensions: ['', '.js', 'css', 'sass', 'scss', 'jade', 'pug', 'html'] //Расширения файлов модулей. pug это новый jade
			, root: [ //Дополнительные места для поиска модулей
				path.resolve(__dirname, '..', SRC_DIR) //аналог NODE_PATH=.
			], alias: { //Алиасы для имен модулей
				//test: 'la_la_la/test'
				//angular: 'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.1/angular.js'
			}
		}, module: {
			//Лоадеры для различных модулей. Минификацию и соурс мапы делает сам webpack, в тот момент когда эти файлы еще его модули.
			loaders: []
		}
	}

	const optionsList = [
		'common'
		,'styles'
		,'images'
		,'html'
	]

	for( let val of optionsList) {
		require( `./${val}`)( options, NODE_ENV, BUILD_DIR, SRC_DIR, ASSETS_PATH);
	}

	if (NODE_ENV == 'production') {
		options.plugins.push(
			new webpack.optimize.UglifyJsPlugin({ //минификатор кода webpack
				compress: { //при минификации кода удали все console.log и неиспользуемый код
					warnings: false
					, drop_console: true
					, unsafe: true
				}
			})
		);
	}

	return options;
}