const path = require('path')
	, webpack = require('webpack');

//продвинутый вариант rimraf (rimraf удаляет папки)
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(  options, NODE_ENV, BUILD_DIR, SRC_DIR, ASSETS_PATH){
	"use strict";
	
	Object.assign( options, {
		context: path.resolve(__dirname, '..', SRC_DIR) //Чтобы не писать постоянно путь к папке исходников при динамической подгрузке ( require.resolve и похожие), задаем префикс для путей к исходникам
		, output: {
			path: path.resolve(__dirname, '..', BUILD_DIR) //Куда сохранять сборку
			, publicPath: '/' //Путь к модулям с интернета, нужен для того чтобы вебпак правильно генерировал ссылки на фронте
			, filename: '[name].js' //Сохраняй точки входа под именем файла совпадающим с именем точки входа
			, library: '[name]' //Сделай точки входа доступными с глобальных переменных, по названию совпадающих с именем точки входа
		}

		, watch: NODE_ENV == 'development' //следи за изменениями файлов, на продакшене следить не надо

		, devtool: NODE_ENV == 'development' ? 'cheap-inline-module-source-map' : null //создавать соурсмапы в модулях вебпака, для продакшена создавать не надо

		, noParse: [/node_modules/] //не обрабатывай вебпаком файлы внутри node_modules, там обычно все уже собрано. Ускоряет сборку проекта

		, resolveLoader: { //Поиск лоадеров модулей
			moduleDirectories: ['node_modules'] // где искать
			, moduleTemplates: ['*-loader', '*']
			, extensions: ['', '.js']
		}
	});

	options.module.loaders.push([{
		test: /\.js$/ //JS модули
		, exclude: [/node_modules/] //библиотеки в node_modules обычно уже кроссбраузерны, потому исключаем с бабеля чтобы ускорить сборку проэкта вебпаком
		, include: [] //если надо что-то включить, исключенное в exclude
		, loaders: ['babel?presets[]=es2015'] //прогонять JS через бабель
	}, {
		test: /\.json$/, //json файлы
		loaders: ['json'] //учит webpack понимать модули c json
	}, {
		test: /\.(ttf|eoq|woff|woff2)$/ //шрифты и возможно еще какие файлы которые просто копируються без обработки, дописать если что-то надо еще
		, loaders: [`file?name=${ASSETS_PATH}.[ext]`] //file-loader, копирует файлы запрошеные через url
	}]);

	options.plugins.push(
		new webpack.NoErrorsPlugin() //чтобы не пересобирало при ощибке
		, new CleanWebpackPlugin([ BUILD_DIR], {
			root: __dirname //корень проэкта
			,verbose: false, //не пишы уведомления в консоль
			dry: false,
			exclude: []
		})
		, new webpack.DefinePlugin({NODE_ENV: JSON.stringify(NODE_ENV)}) //расшарить переменную NODE_ENV на все модули (development или production)
		//, new webpack.ContextReplacementPlugin( /node_modules\/moment\/locale/, /ru|en-gb/) //если внутри модуля ошибочно сработал контекстный require, можно модифицыровать его фильтр не меняя код модуля. Тут первый аргшумент "что запросили", второй собственно фильтр. Кантор https://youtu.be/XY2NLKCrjJ4
		, new webpack.optimize.CommonsChunkPlugin({ //создание файла с общим для всех JS модулей кодом
			name: 'common' //имя файла
			//, chunks: [ 'app'] //взять общие куски из конкрентых точек входа. Если надо, CommonsChunkPlugin можно использовать несколько раз
			//, minChunks: 3 //По умолчанию общий код должен быть у всех точек входа чтобы его вынесли отдельно, этот параметр говорит у скольки точек входа должен быть общий код, чтобы его вынесли в отдельный файл. Удобно для больших приложений.
		})
		//,new webpack.IgnorePlugin() //игнор динамических рекваеров для сторонних модулей, Кантор https://youtu.be/vHRvO4jn6Oc
	);
}