module.exports = function(grunt) {
  grunt.initConfig({
    watch: {
      all: {
        files: ["src/**/*.js"],
        tasks: ["jshint", "mochaTest"]
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      files: {
        src: ['src/**/*.js']
      },
    },
    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['src/spec/*.js']
    }
  });

  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-jshint");
};
