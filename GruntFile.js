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
        src: 'lib/fruitmachine.js',
        dest: 'README.md'
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'lib/<%= pkg.name %>.js',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load local tasks.
  grunt.loadNpmTasks('grunt-readme');
  grunt.loadNpmTasks('grunt-version');

  // Default task.
  grunt.registerTask('default', ['uglify', 'readme']);

};
