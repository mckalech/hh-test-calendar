module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		compass: {
			dist: {
				options: {
					basePath:'public/styles/',
					sassDir:'sass',
					cssDir:'css',
					outputStyle:'compressed'
				}
			}
	 },
	 coffee:{
		compile:{ 
			expand: true,
			cwd: 'public/scripts/app-coffee',
			src: ['{,*/}*.coffee'],
			dest: 'public/scripts/app-js',
			ext: ".js"
		}
	 },
 
		watch: {
			compass: {
				files: 'public/styles/sass/*.sass', // следить за изменениями любых файлов с разширениями .scss
				tasks: ['compass'] // и запускать такую задачу при их изменении
			},
			coffee: {
				files: 'public/scripts/app-coffee/**/*.coffee', 
				tasks: ['coffee:compile'] 
			}
		}
 
	});
 
	//погружаем все необходимые модули
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-coffee');
 
	//забиваем в задачу по умолчению все наши задачи
	grunt.registerTask('default', ['compass', 'coffee', 'watch']);
};