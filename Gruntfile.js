module.exports = function(grunt) {
   'use strict';
   
   grunt.initConfig({
   
      pkg: grunt.file.readJSON('package.json'),
    
//    concat: {
//      options: {
//        separator: ';'
//      },
//      dist: {
//        src: ['src/**/*.js'],
//        dest: 'dist/<%= pkg.name %>.js'
//      }
//    },
//    
      uglify: {
         options: {
            banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyymmdd") %> */\n'
         }
         // target location handled by usemin
      },

      clean: [ 'dist', '.tmp' ], // '.tmp' is created by usemin

      cssmin: {
         main: {
            files: {
               'dist/css/all.css': [ 'src/css/all.css' ]
            }
         }
      },
      
      copy: {
         main: {
            expand: true,
            cwd: 'src/',
            src: [ 'api/**', 'directives/**', 'partials/*.html', '*.php', '.htaccess', '*.csv', '*.db' ],
            dest: 'dist/',
         },
      },
   
      useminPrepare: {
         html: 'src/index.php',
         options: {
            dest: 'dist'
         }
      },
      usemin: {
         html: 'dist/index.php'
      },
      
      jshint: {
         files: ['Gruntfile.js', 'src/js/*.js', 'test/**/*.js'],
//         options: {
//           // options here to override JSHint defaults
//           globals: {
//             jQuery: true,
//             console: true,
//             module: true,
//             document: true
//           }
//         }
      },
      
      'json-minify': {
         main: { // Minifies JSON in place
            files: 'dist/**/*.json'
         }
      }
   
   });

   grunt.loadNpmTasks('grunt-contrib-clean');
   grunt.loadNpmTasks('grunt-contrib-concat');
   grunt.loadNpmTasks('grunt-contrib-copy');
   grunt.loadNpmTasks('grunt-contrib-uglify');
   grunt.loadNpmTasks('grunt-contrib-jshint');
   grunt.loadNpmTasks('grunt-json-minify');
   grunt.loadNpmTasks('grunt-usemin');
   grunt.loadNpmTasks('grunt-contrib-cssmin');
   
   //grunt.registerTask('test', ['jshint', 'qunit']);
   grunt.registerTask('default', ['jshint', 'copy', 'cssmin', 'useminPrepare', 'concat', 'uglify', 'usemin', 'json-minify']);

};
