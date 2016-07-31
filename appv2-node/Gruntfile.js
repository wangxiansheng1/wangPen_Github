// Generated on 2015-02-03 using
// generator-webapp 0.5.1
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  var generator = require('./apigen');

  // Configurable paths
  var config = {
    app: './',
    template: 'template',
    dist: 'dist',
    tmp: '.tmp',
    publish: 'publish',
    oss: 'web-oss',
    statics: 'web-static',
    timestamp: Date.now()
  };

  // var OSS_HOST = 'http://img.sfht.com/sfht';
  var OSS_DEMO_HOST = 'http://s1.ucaiyuan.com/pc_demo/lehuweb-oss';
  var OSS_PRD_HOST = 'http://s1.ucaiyuan.com/pc_prd/lehuweb-oss';


  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    shell: {
      options: {
        stderr: false
      },
      target: {
        command: 'git pull origin develop'
      }
    },

    replace: {
      config: {
        src: ['var/*.js'], // source files array (supports minimatch)
        dest: 'dist/var/', // destination directory or file
        replacements: [{
          from: /jsversion: [0-9]/, // regex replacement ('Fooo' to 'Mooo')
          to: 'jsversion: <%= config.timestamp %>'
        }]
      },
      headerDev: {
        src: ['dist/template/common/{,*/}*.html'], // source files array (supports minimatch)
        dest: 'dist/template/common/', // destination directory or file
        replacements: [{
          from: 'http://gw-dev.ucaiyuan.com', // regex replacement ('Fooo' to 'Mooo')
          to: 'http://gw-dev.ucaiyuan.com'
        }]
      },
      headerTest: {
        src: ['dist/template/common/{,*/}*.html'], // source files array (supports minimatch)
        dest: 'dist/template/common/', // destination directory or file
        replacements: [{
          from: 'http://gw-dev.ucaiyuan.com', // regex replacement ('Fooo' to 'Mooo')
          to: 'http://gw-test.ucaiyuan.com'
        }]
      },
      headerDemo: {
        src: ['dist/template/common/{,*/}*.html'], // source files array (supports minimatch)
        dest: 'dist/template/common/', // destination directory or file
        replacements: [{
          from: 'http://gw-dev.ucaiyuan.com', // regex replacement ('Fooo' to 'Mooo')
          to: 'http://gw-demo.ucaiyuan.com'
        }]
      },
      headerPrd: {
        src: ['dist/template/common/{,*/}*.html'], // source files array (supports minimatch)
        dest: 'dist/template/common/', // destination directory or file
        replacements: [{
          from: 'http://gw-dev.ucaiyuan.com', // regex replacement ('Fooo' to 'Mooo')
          to: 'http://gw.ucaiyuan.com'
        }]
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      js: {
        files: ['<%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      styles: {
        files: ['<%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'autoprefixer']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          // '<%= config.app %>/{,*/}*.html',
          'template/*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= config.app %>/images/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use('/bower_components', connect.static('./bower_components')),
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%= config.dist %>',
          livereload: false
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      package: 'lehuweb.tar',
      server: '.tmp',
      publish: {
        files: [{
          dot: true,
          src: [
            '<%= config.publish %>/*'
          ]
        }]
      },
      oss: {
        files: [{
          dot: true,
          src: [
            '<%= config.oss %>/*'
          ]
        }]
      },
      statics: {
        files: [{
          dot: true,
          src: [
            '<%= config.statics %>/*'
          ]
        }]
      },
      extra: {
        files: [{
          dot: true,
          src: [
            '<%= config.dist %>/index.html'
          ]
        }]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= config.app %>/scripts/{,*/}*.js',
        '!<%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js'
      ]
    },

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%= connect.test.options.hostname %>:<%= connect.test.options.port %>/index.html']
        }
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 10 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {
        ignorePath: /^\/|\.\.\//,
        src: ['<%= config.app %>/index.html'],
        exclude: ['bower_components/bootstrap/dist/js/bootstrap.js']
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= config.dist %>/scripts/{,*/}*.js',
            '<%= config.dist %>/styles/{,*/}*.css',
            '<%= config.dist %>/images/{,*/}*.*',
            '<%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%= config.dist %>/*.{ico,png}'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%= config.dist %>'
      },
      html: [
        'template/*.html',
        'template/common/header.html',
      ]
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%= config.dist %>',
          '<%= config.dist %>/img',
          '<%= config.dist %>/scripts',
          '<%= config.dist %>/styles'
        ],
        blockReplacements: {
          js: function(block) {
            if (config.env == 'demo') {
              if (block.dest[0] != '/') {
                return '<script src="' + OSS_DEMO_HOST + '/' + block.dest + '"></script>';
              } else {
                return '<script src="' + OSS_DEMO_HOST + block.dest + '"></script>';
              }
            } else if (config.env == 'prd') {
              if (block.dest[0] != '/') {
                return '<script src="' + OSS_PRD_HOST + '/' + block.dest + '"></script>';
              } else {
                return '<script src="' + OSS_PRD_HOST + block.dest + '"></script>';
              }
            } else {
              if (block.dest[0] != '/') {
                return '<script src="' + block.dest + '"></script>';
              } else {
                return '<script src="' + block.dest + '"></script>';
              }
            }
          }
        }
      },
      html: ['<%= config.dist %>/{,*/}*.html', '<%= config.dist %>/*/{,*/}*.html'],
      // css: ['<%= config.dist %>/styles/{,*/}*.css']
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= config.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true
        },
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%= config.dist %>'
        }]
      }
    },


    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          timestamp: true,
          cwd: '',
          dest: '<%= config.dist %>',
          src: [
            '*.{ico,png,txt}'
          ]
        }]
      },

      log: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: 'var',
        dest: '<%= config.dist %>/var',
        src: [
          'log'
        ],
        options: {
          process: function(content, srcpath) {
            return content;
          }
        }
      },

      extraFiles: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '',
        dest: '<%= config.dist %>',
        src: [
          'google142809d331386819.html'
        ],
        options: {
          process: function(content, srcpath) {
            return content;
          }
        }
      },

      html: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.template %>',
        dest: '<%= config.dist %>/template',
        src: [
          '*.html',
          'common/*.html'
        ],
        options: {
          process: function(content, srcpath) {
            return content;
          }
        }
      },

      image: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          'img/{,*/}*.*',
          'img/*/{,*/}*.*',
          'img/*/*/{,*/}*.*',
          'img/*/*/*/{,*/}*.*',
        ]
      },

      commonjs: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          'scripts/common/{,*/}*.*'
        ]
      },

      // @todo需要修改，自动笔变化图片
      templates: {
        expand: true,
        dot: true,
        timestamp: true,
        cwd: '<%= config.app %>',
        dest: '<%= config.dist %>',
        src: [
          'templates/{,*/}*.mustache'
        ],
        options: {
          process: function(content, srcpath) {
            // if (config.version) {
            //   return content.replace(/img\/recommend.jpg/g, OSS_HOST+ '/'+ config.version +'/img/recommend.jpg')
            // }else{
            //   return content;
            // }
            return content;
          }
        }
      },

      styles: {
        expand: true,
        dot: true,
        cwd: '.tmp/concat/styles',
        dest: '<%= config.dist %>/styles/',
        src: '{,*/}*.css'
      }
    },

    //app/**, autogen/**, html/**, node_modules/**, bower.json, apigen.js, build.sh,
    //build.xml, gruntfile.js, gulpfile.js, require_config.js, readme.MD
    compress: {
      dev: {
        options: {
          archive: 'publish/lehuweb-static.zip',
          store: true
        },
        files: [{
          expand: true,
          cwd: './',
          src: ['lib/**', 'scripts/common/**', 'images/**', 'scripts/top/**', 'scripts/lehu.require.config.js', 'views/**', 'app.js', 'favicon.ico', 'server.js', 'google142809d331386819.html'],
          dest: ''
        }, {
          expand: true,
          cwd: 'dist',
          src: ['scripts/*.js', 'styles/**'],
          dest: ''
        }, {
          expand: true,
          cwd: 'dist',
          src: ['var/**'],
          dest: ''
        }, {
          expand: true,
          cwd: 'dist',
          src: ['template/**', 'template/common/**'],
          dest: ''
        }]
      },
      prdstatic: {
        options: {
          archive: 'publish/lehuweb-static.zip',
          store: true
        },
        files: [{
          expand: true,
          cwd: './',
          src: ['lib/**', 'views/**', 'app.js', 'favicon.ico', 'server.js', 'google142809d331386819.html'],
          dest: ''
        }, {
          expand: true,
          cwd: 'dist',
          src: ['var/**'],
          dest: ''
        }, {
          expand: true,
          cwd: 'dist',
          src: ['template/**', 'template/common/**'],
          dest: ''
        }]
      },
      prdoss: {
        options: {
          archive: 'publish/lehuweb-oss.zip',
          store: true
        },
        files: [{
          expand: true,
          cwd: './',
          src: ['scripts/common/**', 'images/**', 'scripts/top/**', 'scripts/lehu.require.config.js'],
          dest: 'lehuweb-oss'
        }, {
          expand: true,
          cwd: 'dist',
          src: ['scripts/*.js', 'styles/**'],
          dest: 'lehuweb-oss'
        }]
      }
    },

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        // 'imagemin',
        'svgmin'
      ]
    },

    requirejs: {

      index: {
        options: {
          preserveLicenseComments: false,
          baseUrl: './',
          out: './<%= config.tmp %>/concat/scripts/lehu.h5.page.index.js',
          mainConfigFile: "./scripts/lehu.require.config.js",
          paths: {
            'placeholders': './bower_components/Placeholders/dist/placeholders',
            'moment': './bower_components/momentjs/min/moment.min',
            'moment-zh-cn': './bower_components/momentjs/locale/zh-cn',
            'text': './bower_components/text/text',
            'JSON': './bower_components/JSON-js/json2'
              // 'sf.b2c.mall.business.config': 'scripts/config/sf.b2c.mall.business.<%= config.target %>.config'
          },
          include: ["JSON", "lehu.h5.page.index"],
          insertRequire: ['lehu.h5.page.index']
        }
      }
    }
  });

  grunt.registerTask('package', function(target) {

    config.env = target;

    var taskArr = [
      'build:prd',
      'clean:package',
      'replace:config',
      'copy:log',
      'copy:extraFiles'
    ];

    var map = {
      "dev": function() {
        taskArr.push('replace:headerDev');
        taskArr.push('compress:dev');
      },

      "test": function() {
        taskArr.push('replace:headerTest');
        taskArr.push('compress:dev');
      },

      "demo": function() {
        taskArr.push('replace:headerDemo');
        // taskArr.push('compress:dev');
        taskArr.push('compress:prdstatic');
        taskArr.push('compress:prdoss');
      },

      "prd": function() {
        console.log("prd")
        taskArr.push('replace:headerPrd');
        // taskArr.push('compress:dev');

        taskArr.push('compress:prdstatic');
        taskArr.push('compress:prdoss');
      }
    }

    if (typeof map[target] != 'undefined') {
      map[target].apply(this);
    }

    grunt.task.run(taskArr);

  });

  grunt.registerTask('create', function() {
    var done = this.async();
    generator.autogen(grunt, done);
  });

  grunt.registerTask('build', function(target) {
    config.target = target;

    if (config.target) {
      grunt.task.run([
        'clean:dist',
        'wiredep',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'requirejs',
        //'cssmin',
        'uglify',
        'copy:dist',
        'copy:html',
        'copy:styles',
        'copy:commonjs',
        'usemin',
        // 'htmlmin',
        'clean:extra',
      ]);
    } else {
      grunt.fail.fatal('缺少环境参数!');
    }
  });

};