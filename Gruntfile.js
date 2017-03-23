module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        ts: {
            default: {
                src: ["src/**/*.ts", "!node_modules/**"],
                out: "dist/validator.js",
                options: {
                    module: "AMD",
                    removeComments: true
                },
            }
        },
        uglify: {
            compress: {
                options: {
                    sourceMap: true,
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                            '<%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                files: {
                    "dist/validator.min.js" : ["dist/validator.js"]
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-ts");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("default", ["ts", "uglify:compress"]);
};
