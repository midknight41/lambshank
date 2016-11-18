"use strict";

module.exports = function (grunt) {

  grunt.initConfig({
    lineending: {
      dist: {
        options: {
          overwrite: true
        },
        files: {
          '': ['**/*.ts', 'lib/**/*', '**/*.json']
        }
      }
    }

  });

  grunt.loadNpmTasks("grunt-lineending");

  grunt.registerTask("default", ["lineending"]);

}
