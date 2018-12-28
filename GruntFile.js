module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      build: {
        src: 'lib/index.js',
        dest: 'build/<%= pkg.name %>.js'
      },
      test: {
        src: 'coverage/lib/index.js',
        dest: 'coverage/build/<%= pkg.name %>.js'
      },
      options: {
        standalone: '<%= pkg.name %>'
      }
    },

    run: {
      test: {
        cmd: 'npm',
        args: [ 'test' ],
      }
    },

    uglify: {
      build: {
        src: 'build/<%= pkg.name %>.js',
        dest: 'build/<%= pkg.name %>.min.js'
      }
    },

    watch: {
      scripts: {
        files: ['lib/**/*.js'],
        tasks: ['browserify']
      }
    },

    instrument: {
      files: 'lib/**/*.js',
      options: {
        basePath: 'coverage/'
      }
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-run');

  // Default task.
  grunt.registerTask('default', ['browserify:build', 'uglify']);
  grunt.registerTask('test', ['browserify:test', 'run:test']);
};
