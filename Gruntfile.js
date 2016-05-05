module.exports = function(grunt) {
    
    var githubDirPath    = 'components/github/';
    var htmlDirPath      = 'components/html/';
    var scgDirPath       = 'components/scg/';
    var scsDirPath       = 'components/scs/';
    var webCoreCompPath  = 'client/js/'; 
    var clientJsDirPath  = 'client/static/components/js/';
    var clientCssDirPath = 'client/static/components/css/';
    
    grunt.initConfig({
        concat: {
            webcore: {
                src: [webCoreCompPath + 'Utils/sc_keynodes.js',
                      webCoreCompPath + 'Utils/utils.js',
                      webCoreCompPath + 'Utils/sc_helper.js',
                      webCoreCompPath + 'Utils/stringview.js',
                      webCoreCompPath + 'Utils/cache.js',
                      webCoreCompPath + 'Utils/sctp.js',
                      webCoreCompPath + 'Utils/fqueue.js',
                      webCoreCompPath + 'Utils/binary.js',
                      webCoreCompPath + 'Utils/triples.js',
                      webCoreCompPath + 'Core/namespace.js',
                      webCoreCompPath + 'Core/debug.js',
                      webCoreCompPath + 'Core/main.js',
                      webCoreCompPath + 'Core/server.js',
                      webCoreCompPath + 'Core/arguments.js',
                      webCoreCompPath + 'Core/componentsandbox.js',
                      webCoreCompPath + 'Core/translation.js',
                      webCoreCompPath + 'Core/componentmanger.js',
                      webCoreCompPath + 'Core/eventmanager.js',
                      webCoreCompPath + 'Ui/namespace.js',
                      webCoreCompPath + 'Ui/menu.js',
                      webCoreCompPath + 'Ui/langpanel.js',
                      webCoreCompPath + 'Ui/locker.js',
                      webCoreCompPath + 'Ui/core.js',
                      webCoreCompPath + 'Ui/searchpanel.js',
                      webCoreCompPath + 'Ui/KeyboardHandler.js',
                      webCoreCompPath + 'Ui/taskpanel.js',
                      webCoreCompPath + 'Ui/argumentspanel.js',
                      webCoreCompPath + 'Ui/windowmanager.js',
                      webCoreCompPath + 'Ui/userpanel.js'],
                dest: clientJsDirPath + 'sc-web-core.js',  
            },
            github: {
                src: [githubDirPath + 'src/*.js'],
                dest: githubDirPath + 'static/components/js/github/github.js'
            },
            html: {
                src: [htmlDirPath + 'src/*.js'],
                dest: htmlDirPath + 'static/components/js/html/html.js' 
            },
            scg: {
                src: [scgDirPath + '/src/gwf-file-loader.js',
                      scgDirPath + '/src/gwf-model-objects.js',
                      scgDirPath + '/src/gwf-object-info-reader.js',
                      scgDirPath + '/src/scg-object-builder.js',
                      scgDirPath + '/src/scg.js',
                      scgDirPath + '/src/scg-debug.js',
                      scgDirPath + '/src/scg-math.js',
                      scgDirPath + '/src/scg-model-objects.js',
                      scgDirPath + '/src/scg-alphabet.js',
                      scgDirPath + '/src/scg-render.js',
                      scgDirPath + '/src/scg-scene.js',
                      scgDirPath + '/src/scg-layout.js',
                      scgDirPath + '/src/scg-tree.js',
                      scgDirPath + '/src/scg-struct.js',
                      scgDirPath + '/src/scg-object-creator.js',
                      scgDirPath + '/src/scg-component.js',
                      scgDirPath + '/src/listener/*.js',
                      scgDirPath + '/src/command/command-manager.js',
                      scgDirPath + '/src/command/create-node.js',
                      scgDirPath + '/src/command/create-edge.js',
                      scgDirPath + '/src/command/create-bus.js',
                      scgDirPath + '/src/command/create-contour.js',
                      scgDirPath + '/src/command/create-link.js',
                      scgDirPath + '/src/command/change-idtf.js',
                      scgDirPath + '/src/command/change-content.js',
                      scgDirPath + '/src/command/change-type.js',
                      scgDirPath + '/src/command/delete-objects.js',
                      scgDirPath + '/src/command/move-object.js',
                      scgDirPath + '/src/command/move-line-point.js',
                      scgDirPath + '/src/command/get-node-from-memory.js',
                      scgDirPath + '/src/command/wrapper-command.js'],
                dest: scgDirPath + 'static/components/js/scg/scg.js'  
            },
            scs: {
                src: [scsDirPath + 'src/scs.js',
                      scsDirPath + 'src/scs-viewer.js',
                      scsDirPath + 'src/scs-output.js',
                      scsDirPath + 'src/scs-types.js',
                      scsDirPath + 'src/scn-output.js',
                      scsDirPath + 'src/scn-tree.js',
                      scsDirPath + 'src/scn-highlighter.js',
                      scsDirPath + 'src/scs-component.js'],
                dest: scsDirPath + 'static/components/js/scs/scs.js'
            },
        },
        copy: {
            github: {
                cwd: githubDirPath + 'static/components/js/github/',
                src: 'github.js',
                dest: clientJsDirPath + 'github/',
                expand: true,
                flatten: true   
            },
            html: {
                cwd: htmlDirPath + 'static/components/js/html/',
                src: 'html.js',
                dest: clientJsDirPath + 'html/',
                expand: true,
                flatten: true
            },
            scg: {
                cwd: scgDirPath + 'static/components/js/scg/',
                src: 'scg.js',
                dest: clientJsDirPath + 'scg/',
                expand: true,
                flatten: true
            },
            scs: {
                cwd: scsDirPath + 'static/components/js/scs/',
                src: 'scs.js',
                dest: clientJsDirPath + 'scs/',
                expand: true,
                flatten: true
            },
            githubcss: {
                cwd: githubDirPath + 'static/components/css/',
                src: 'github.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true 
            },
            htmlcss: {
                cwd: htmlDirPath + 'static/components/css/',
                src: 'html.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true 
            },
            scgcss: {
                cwd: scgDirPath + 'static/components/css/',
                src: 'scg.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true 
            },
            scscss: {
                cwd: scsDirPath + 'static/components/css/',
                src: 'scs.css',
                dest: clientCssDirPath,
                expand: true,
                flatten: true 
            } 
        },
        watch: {
            js: {
                files: [githubDirPath + 'src/*.js',
                        htmlDirPath + 'src/*.js',
                        scgDirPath + 'src/*.js',
                        scsDirPath + 'src/*.js',
                        webCoreCompPath + '**/*.js'],
                tasks: ['concat', 'copy'],
            },
        },
    });
  
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    
    grunt.registerTask('default', ['concat', 'copy', 'watch']);
    
};