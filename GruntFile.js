module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    buster: {},

    version: {
      src: [
        'component.json',
        'package.json',
        'lib/index.js'
      ]
    },

    readme: {
      dest: {
        code: [
          'lib/view/index.js',
          { path: 'lib/view/events.js', cons: 'View' },
          'lib/model.js'
        ],
        partials: [
          'docs/templates/intro.hogan'
        ],
        output: {
          'docs/templates/api.hogan': 'docs/api.md',
          'docs/templates/readme.hogan': 'README.md'
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
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
    }
  });

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-version');

  // Load local tasks
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['browserify', 'uglify', 'readme']);
};
