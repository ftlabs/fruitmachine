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

    browserify: {
      build: {
        src: 'lib/index.js',
        dest: 'build/<%= pkg.name %>.js'
      },
      options: {
        standalone: '<%= pkg.name %>'
      }
    },

    readme: {
      dest: {
        code: [
          { path: 'lib/define.js', ctx: { receiver: 'fruitmachine', name: 'define', type: 'method' }},
          { path: 'lib/module/index.js', ctx: { cons: 'Module' }},
          { path: 'lib/module/events.js', ctx: { cons: 'Module' }}
        ],
        output: {
          'docs/templates/api.hogan': 'docs/api.md',
          'docs/templates/readme.hogan': 'README.md'
        }
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
    }
  });

  grunt.loadNpmTasks('grunt-buster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-version');

  // Default task.
  grunt.registerTask('default', ['browserify', 'uglify', 'readme']);
};
