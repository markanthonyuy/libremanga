module.exports = function(grunt) {
	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		jsFolder: 'assets/js/',
		cssFolder: 'assets/css/',

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

		watch: {
			js: {
				files: '<%= jsFolder %>index.js',
				tasks: ['uglify']
			},
			css: {
				files: '<%= cssFolder %>index.css',
				tasks: ['cssmin']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['uglify', 'cssmin']);
	grunt.registerTask('server', ['watch']);
};