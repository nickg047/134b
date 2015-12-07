module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['js/**/*.js'],
        dest: 'js/concatJS.js'
      }
    },

    uglify: {
      build: {
		  src: 'js/welcome.js',
		  dest: 'js/welcome.js'
      }
    },
  htmlclean: {
	options: {
	  protect: /<\!--%fooTemplate\b.*?%-->/g,
	  edit: function(html) { return html.replace(/\begg(s?)\b/ig, 'omelet$1'); }
    },
	deploy: {
	  expand: true,
	  src: 'src/**/*.html',
	  dest: 'public_html/'
	}
  },
	cssmin: {
	  target: {
		files: [{
		  expand: true,
		  src: ['css/**/*.css', '!*.css'],
		  ext: '.css'
		}]
	  }
	},
	svgstore: {
	  options: {
		prefix : 'shape-', // This will prefix each <g> ID
		svg:{
			viewBox: '0 0 100 100'
			}
	  },
	  default : {
		  files: {
			'svg-defs.svg': ['img/**/*.svg'],
		  }
		}
	}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-htmlclean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-svgstore');

};