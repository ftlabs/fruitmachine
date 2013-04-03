module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    version: {
      src: [
        'component.json',
        'package.json',
        'lib/fruitmachine.js'
      ]
    },

    readme: {
      options: {
        comment: 'docs/comment.hogan',
        readme: 'docs/readme.hogan'
      },
      dist: {
        src: [
          'lib/view.js',
          'lib/model.js'
        ],
        dest: 'README.md'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'dist/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['lib/*.js'],
        tasks: ['browserify']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-version');


  // Load local tasks
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['browserify', 'uglify', 'readme']);
};
