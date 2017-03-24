const path = require('path')
	, webpack = require('webpack');

//ExtractTextPlugin созраняет текст модулей в файлы, смотреть plugins и module
const ExtractTextPlugin = require('extract-text-webpack-plugin'); //конструктор

module.exports = function(  options, NODE_ENV, BUILD_DIR, SRC_DIR, ASSETS_PATH){
	"use strict";

	const extractStyle = new ExtractTextPlugin(`${ASSETS_PATH}.css`, {allChunks: true}) //для стилей, названия в assets ис хешем для удаления дубликатов
	//const extractCss = new ExtractTextPlugin('[name].css', {allChunks: true}) //вариант где названия и пути сохраняются, но в целом нет никакой разницы какие названия в build, главное в src читаемы

	options.module.loaders.push({
		test: /\.(css|sass|scss)$/ //sass или scss файлы, обычные css также хорошо воспринимаются.
		, loader: extractStyle.extract([ //extractCss это экземпляр  ExtractTextPlugin выносит css модули из webpack-а в файлы, смотри настройки модуля в разделе plugins. [].join('!') просто для удобства.
			NODE_ENV == 'development' ? 'css?sourceMap' : 'css' //учит webpack понимать модули c css подобным кодом
			, 'autoprefixer?browsers=last 2 versions' //самые обычные автопрефиксы
			, 'resolve-url' //webpack не видит манипуляции @import в sass, потому могут быть неверные пути в импортированых файлах после компиляции, resolve-url исправляет это.
			, 'sass?sourceMap' //компилируем sass, не удаляйте соурсмапы(!), resolve-url без них не работает
		].join('!')) //[].join('!') просто для удобства
	});

	options.plugins.push(
		extractStyle //Выносит css\sass\scss из webpack модуля в файл, названия совпадают с именем точки входа. Если у модуля несколько файлов стилей, он их склеит в один. allChunks: true говорит вынести и динамически подгружаемые стили тоже
	);
}