module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		copy: {
			totest: {
				files: [
					{expand: true, src: ['dist/*'], dest: 'test/', filter: 'isFile'},
				]
			},
			beforeInsert: {
				src: 'src/CacheRequest.js',
				dest: 'src/CacheRequest.temp.js'
			},
			toDist: {
				src: 'src/CacheRequest.comp.js',
				dest: 'dist/cacherequest.js'
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
			async: {
				src: "src/AsyncReq.js",
				dest: "src/CacheRequest.js",
				match: "// insert AsyncReq"
			},
			proto: {
				src: "src/CacheRequestProto.js",
				dest: "src/CacheRequest.js",
				match: "// insert CacheRequestProto"
			}
		},
		'jshint': {
			all: ['Gruntfile.js', 'src/**/*.js']
		},
		'uglify': {
			options: {
				screwIE8: true
			},
			my_target: {
				files: {
					'dist/cacherequest.min.js': ['dist/cacherequest.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-insert');
	grunt.loadNpmTasks('grunt-rename');
	grunt.loadNpmTasks('grunt-remove');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');


	grunt.registerTask('injection', ['copy:beforeInsert','insert:async','insert:proto','rename:toComp','rename:fromTemp','copy:toDist']);
	grunt.registerTask('default', ['jshint','injection','uglify','copy:totest', 'remove']);
};
