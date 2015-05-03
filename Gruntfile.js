module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		'concat': {
			js: {
				src: [
					'src/CacheRequest.js'
				],
				dest: 'dist/cacherequest.js'
			}
		},
		'jshint': {
			all: ['Gruntfile.js', 'src/**/*.js']
		},
		'uglify': {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					'dist/cacherequest.min.js': ['dist/cacherequest.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	grunt.registerTask('default', ['jshint','concat','uglify']);

};