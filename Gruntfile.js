module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		'concat': {
			js: {
				src: [
					'src/CacheRequest.comp.js'
				],
				dest: 'dist/cacherequest.js'
			}
		},
		copy: {
			totest: {
				files: [
					{expand: true, src: ['dist/*'], dest: 'test/', filter: 'isFile'},
				]
			},
			beforeInsert: {
				src: 'src/CacheRequest.js',
				dest: 'src/CacheRequest.temp.js'
			}
		},
		rename: {
			toComp: {
				src: 'src/CacheRequest.js',
				dest: 'src/CacheRequest.comp.js'
			},
			fromTemp: {
				src: 'src/CacheRequest.temp.js',
				dest: 'src/CacheRequest.js'
			},
		},
		remove: {
			default_options: {
				fileList: ['src/CacheRequest.comp.js']
			}
		},
		insert: {
			main: {
				src: "src/CacheRequestProto.js",
				dest: "src/CacheRequest.js",
				match: "// insert: CacheRequestProto.js"
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
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-insert');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-remove');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// Default task(s).
	grunt.registerTask('default', ['jshint','copy:beforeInsert','insert','rename:toComp','rename:fromTemp','concat','uglify','copy:totest', 'remove']);

};
