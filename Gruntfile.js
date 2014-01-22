module.exports = function(grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		jsFolder: 'assets/js/',
		cssFolder: 'assets/css/',
		imgFolder: 'assets/img/',
		jsonFolder: 'assets/json/',
		compressImgFolder: 'assets/img/compressed/',

		uglify: {
			options: {
				banner: '/* <%= pkg.name %> Javascript <%= grunt.template.today("yyyy-mm-dd") %> Develop and Maintain by Mark Anthony Uy. Email me at macmac.uy@gmail.com */'
			},
			build: {
				src: '<%= jsFolder %>index.js',
				dest: '<%= jsFolder %>index.min.js'
			}
		},

		cssmin: {
			add_banner: {
				options: {
					banner: '/* <%= pkg.name %> CSS <%= grunt.template.today("yyyy-mm-dd") %> Develop and Maintain by Mark Anthony Uy. Email me at macmac.uy@gmail.com */'
				},
				files: {
					'<%= cssFolder %>index.min.css': ['<%= cssFolder %>index.css']
				}
			}
		},

		imagemin: {
			static: {
				options: {
					optimazationLevel: 4
				},
				files: {
					'<%= compressImgFolder %>ajax-loader.gif'		: '<%= imgFolder %>ajax-loader.gif',
					'<%= compressImgFolder %>facebook_active.png'	: '<%= imgFolder %>facebook_active.png',
					'<%= compressImgFolder %>google_active.png'		: '<%= imgFolder %>google_active.png',
					'<%= compressImgFolder %>twitter_active.png'	: '<%= imgFolder %>twitter_active.png'
				}
			}
		},

		minjson: {
			compile: {
				files: {
					'<%= jsonFolder %>manga_list.min.json': '<%= jsonFolder %>manga_list.json'
				}
			}
		},

		watch: {
			js: {
				files: '<%= jsFolder %>index.js',
				tasks: ['uglify']
			},
			css: {
				files: '<%= cssFolder %>index.css',
				tasks: ['cssmin']
			},
			json: {
				files: '<%= jsonFolder %>manga_list.json',
				tasks: ['minjson']
			}
		}
	});

	// Load Plugins
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-minjson');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// Define Task
	grunt.registerTask('default', ['uglify', 'cssmin', 'minjson']);
	grunt.registerTask('image', ['imagemin']);
	grunt.registerTask('server', ['watch']);
};