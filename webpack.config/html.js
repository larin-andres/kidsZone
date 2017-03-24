//HtmlWebpackPlugin генерирует index файл для нашего приложения, очень умный и многое умеет
const HtmlWebpackPlugin = require('html-webpack-plugin');
//создает manifest файл для кеша. Позволяет открывать страницу на мобильных устройствах даже без интернета
const AppCachePlugin = require('appcache-webpack-plugin');

module.exports = function(  options, NODE_ENV, BUILD_DIR, SRC_DIR, ASSETS_PATH) {
	"use strict";

	//настройки HtmlWebpack для удобства отдельно
	let _options = {
		html: {
			title: 'Test App'
			, favicon: 'favicon.png' //имя файла с которого генерирует
			, template: 'index.jade'
			//, chanks
			//, minify: true //NODE_ENV != 'development'
		} ,appcache: {
			cache: [] //что из файлов добавить в кеш помимо автокеша
			, network: ['*'] //Файлы, указанные тут, всегда запрашиваются в обход кэша, даже если пользователь находится в режиме офлайн. * значит что все файлы кроме указаных в манифесте требуют запрос в обход кеша
			, fallback: [ //Если ресурс недоступен, попробует открыть эти страницы
				//'/ /offline.html' //Первый url указывает ресурс, а второй – его резервную страницу. Оба адреса должны быть относительными и находиться в том же домене что и файл манифеста
			], settings: [ //различные стандартные настройки appcache
				'prefer-online' //Если интернет есть, пробуй обновить кеш
			], exclude: []// Что исключить из кеша, понимает регулярки
			, output: 'app-manifest.appcache' //Имя файла кеша, общепринятое название имя_приложения-manifest.appcache
		} , favicon: {
			prefix: ASSETS_PATH //префикс пути, тут немного кривой путь будет, недостаток этого плагина но в целом все работает
			, emitStatsL: false //не добавлять файл настроек, у неас есть манифест
			, icons: {
				android: true,
				appleIcon: true,
				appleStartup: true,
				coast: true,
				favicons: true,
				firefox: true,
				opengraph: true,
				twitter: true,
				yandex: true,
				windows: true
			}
			, inject: true //Обрабатывается HtmlWebpackPlugin
		}
	}


	//синхронизация конфигов
	_options.favicon.title = _options.html.title; //тайтл для шейрингов фб и прочих
	_options.favicon.logo = _options.html.favicon //чтобы не писать два раза
	delete( _options.html.favicon);

	//Шаблоны обрабатывать jade
	options.module.loaders.push({
		test: /\.(jade|pug)$/ //jade переименовали в pug.
		, loaders: [
			, NODE_ENV == 'development' ? 'jade?pretty=true' : 'jade' //минифицыруй html только на продакшен
		]
	});
	
	options.plugins.push(
		new HtmlWebpackPlugin( _options.html)
		,new AppCachePlugin( _options.appcache)
	);


	//генерирует фавикон на все случаи жизни, иконки долго обрабатываются, потому набор генерируется только для продакшена
	const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
	if (NODE_ENV != 'development') {
		options.plugins.push( new FaviconsWebpackPlugin( _options.favicon));
	} else {

		for( let key in _options.favicon.icons) {
			if( key == 'favicons') {
				_options.favicon.icons[ key] = true;
			} else {
				_options.favicon.icons[ key] = false;
			}
		}

		options.plugins.push( new FaviconsWebpackPlugin( _options.favicon));
	}


}