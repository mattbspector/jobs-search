
'use strict';

let atomizerConfig = {
    options: {
        namespace: null,
        configFile: './configs/atomizer-custom.json',
        configOutput: './configs/atomizer.json'
    },
    files: [
        {
            src: ['src/**/*.js'],
            dest: 'src/css/main.css'
        }
    ]
};

module.exports = function(grunt) {
    // Define the configuration for all the tasks
    grunt.config.merge({
        project: {
            src: './src',
            dist: './dist'
        },
        watch: {
            dev: {
                options: {
                    livereload: true
                },
                files: ['configs/atomizer-custom.json', 'src/**/*.js'],
                tasks: ['atomizer']
            }
        },

        atomizer: {
            dev: atomizerConfig,
            dist: atomizerConfig
        },

        shell: {
            'react-scripts-start': {
                command: 'react-scripts start'
            }
        },

        concurrent: {
            dev: {
                tasks: ['watch', 'shell:react-scripts-start'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-atomizer');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('dev', ['atomizer', 'concurrent:dev']);

    grunt.registerTask('default', ['build']);
};
