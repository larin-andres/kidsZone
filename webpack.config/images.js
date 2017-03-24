module.exports = function(  options, NODE_ENV, BUILD_DIR, SRC_DIR, ASSETS_PATH){

	options.module.loaders.push({
		test: /\.(png|jpg|jpeg|gif|tiff|webp|ico|svg)$/ //картинки
		, loaders: [`url?name=${ASSETS_PATH}.[ext]&limit=${1024*10}`] //тоже самое что и file-loader, но подставляет в урл картинки base64 для файлов меньше размера указанного в limit
		//следующие два оставлены для примера
		//, loaders: ['file?name=assets/[1].[ext]&regExp=node_modules.(.*)'] //file-loader, копирует файлы запрошеные через url или аналоги в модулях, удаляет node_modules в пути если он есть. Чтобы небыло конфликтов имен, закидывает в папку assets. Обязательно добавить exclude: /\/node_modules\//
		//, loaders: ['file?name=[path][name].[ext]'] //file-loader, копирует файлы запрошеные через url или аналоги в модулях.
	});
}