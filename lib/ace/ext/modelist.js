define(function(require, exports, module) {
    'use strict';

    var supportedModes = {
        ABAP: ['abap'],
        ABC: ['abc'],
        ActionScript: ['as'],
        ADA: ['ada|adb'],
        Apache_Conf: ['^htaccess|^htgroups|^htpasswd|^conf|htaccess|htgroups|htpasswd'],
        AsciiDoc: ['asciidoc|adoc'],
        Assembly_x86: ['asm|a'],
        AutoHotKey: ['ahk'],
        BatchFile: ['bat|cmd'],
        Bro: ['bro'],
        C_Cpp: ['cpp|c|cc|cxx|h|hh|hpp|ino'],
        C9Search: ['c9search_results'],
        Cirru: ['cirru|cr'],
        Clojure: ['clj|cljs'],
        Cobol: ['CBL|COB'],
        coffee: ['coffee|cf|cson|^Cakefile'],
        ColdFusion: ['cfm'],
        CSharp: ['cs'],
        Csound_Document: ['csd'],
        Csound_Orchestra: ['orc'],
        Csound_Score: ['sco'],
        CSS: ['css'],
        Curly: ['curly'],
        D: ['d|di'],
        Dart: ['dart'],
        Diff: ['diff|patch'],
        Dockerfile: ['^Dockerfile'],
        Dot: ['dot'],
        Drools: ['drl'],
        Eiffel: ['e|ge'],
        EJS: ['ejs'],
        Elixir: ['ex|exs'],
        Elm: ['elm'],
        Erlang: ['erl|hrl'],
        Forth: ['frt|fs|ldr|fth|4th'],
        Fortran: ['f|f90'],
        FTL: ['ftl'],
        Gcode: ['gcode'],
        Gherkin: ['feature'],
        Gitignore: ['^.gitignore'],
        Glsl: ['glsl|frag|vert'],
        Gobstones: ['gbs'],
        golang: ['go'],
        GraphQLSchema: ['gql'],
        Groovy: ['groovy'],
        HAML: ['haml'],
        Handlebars: ['hbs|handlebars|tpl|mustache'],
        Haskell: ['hs'],
        Haskell_Cabal: ['cabal'],
        haXe: ['hx'],
        Hjson: ['hjson'],
        HTML: ['html|htm|xhtml|vue|we|wpy'],
        HTML_Elixir: ['eex|html.eex'],
        HTML_Ruby: ['erb|rhtml|html.erb'],
        INI: ['ini|conf|cfg|prefs'],
        Io: ['io'],
        Jack: ['jack'],
        Jade: ['jade|pug'],
        Java: ['java'],
        JavaScript: ['js|jsm|jsx'],
        JSON: ['json'],
        JSONiq: ['jq'],
        JSP: ['jsp'],
        JSSM: ['jssm|jssm_state'],
        JSX: ['jsx'],
        Julia: ['jl'],
        Kotlin: ['kt|kts'],
        LaTeX: ['tex|latex|ltx|bib'],
        LESS: ['less'],
        Liquid: ['liquid'],
        Lisp: ['lisp'],
        LiveScript: ['ls'],
        LogiQL: ['logic|lql'],
        LSL: ['lsl'],
        Lua: ['lua'],
        LuaPage: ['lp'],
        Lucene: ['lucene'],
        Makefile: ['^Makefile|^GNUmakefile|^makefile|^OCamlMakefile|make'],
        Markdown: ['md|markdown'],
        Mask: ['mask'],
        MATLAB: ['matlab'],
        Maze: ['mz'],
        MEL: ['mel'],
        MIXAL: ['mixal'],
        MUSHCode: ['mc|mush'],
        MySQL: ['mysql'],
        Nix: ['nix'],
        NSIS: ['nsi|nsh'],
        ObjectiveC: ['m|mm'],
        OCaml: ['ml|mli'],
        Pascal: ['pas|p'],
        Perl: ['pl|pm'],
        pgSQL: ['pgsql'],
        PHP: ['php|phtml|shtml|php3|php4|php5|phps|phpt|aw|ctp|module'],
        Pig: ['pig'],
        Powershell: ['ps1'],
        Praat: ['praat|praatscript|psc|proc'],
        Prolog: ['plg|prolog'],
        Properties: ['properties'],
        Protobuf: ['proto'],
        Python: ['py'],
        R: ['r'],
        Razor: ['cshtml|asp'],
        RDoc: ['Rd'],
        Red: ['red|reds'],
        RHTML: ['Rhtml'],
        RST: ['rst'],
        Ruby: ['rb|ru|gemspec|rake|^Guardfile|^Rakefile|^Gemfile'],
        Rust: ['rs'],
        SASS: ['sass'],
        SCAD: ['scad'],
        Scala: ['scala'],
        Scheme: ['scm|sm|rkt|oak|scheme'],
        SCSS: ['scss'],
        SH: ['sh|bash|^.bashrc'],
        SJS: ['sjs'],
        Smarty: ['smarty|tpl'],
        snippets: ['snippets'],
        Soy_Template: ['soy'],
        Space: ['space'],
        SQL: ['sql'],
        SQLServer: ['sqlserver'],
        Stylus: ['styl|stylus'],
        SVG: ['svg'],
        Swift: ['swift'],
        Tcl: ['tcl'],
        Tex: ['tex'],
        Text: ['txt'],
        Textile: ['textile'],
        Toml: ['toml'],
        TSX: ['tsx'],
        Twig: ['twig|swig'],
        Typescript: ['ts|typescript|str'],
        Vala: ['vala'],
        VBScript: ['vbs|vb'],
        Velocity: ['vm'],
        Verilog: ['v|vh|sv|svh'],
        VHDL: ['vhd|vhdl'],
        Wollok: ['wlk|wpgm|wtest'],
        XML: ['xml|rdf|rss|wsdl|xslt|atom|mathml|mml|xul|xbl|xaml'],
        XQuery: ['xq'],
        YAML: ['yaml|yml'],
        Django: ['html']
    };

    var nameOverrides = {
        ObjectiveC: 'Objective-C',
        CSharp: 'C#',
        golang: 'Go',
        C_Cpp: 'C and C++',
        Csound_Document: 'Csound Document',
        Csound_Orchestra: 'Csound',
        Csound_Score: 'Csound Score',
        coffee: 'CoffeeScript',
        HTML_Ruby: 'HTML (Ruby)',
        HTML_Elixir: 'HTML (Elixir)',
        FTL: 'FreeMarker'
    };

    var modes = [];
    var modesByName = {};

    var Mode = function(name, caption, extensions) {
        this.name = name;
        this.caption = caption;
        this.mode = 'ace/mode/' + name;

        this.setExtensions(extensions);
    };

    Mode.prototype.setExtensions = function(extensions) {
        this.extensions = extensions;

        var re;
        if (/\^/.test(extensions)) {
            re =
                extensions.replace(/\|(\^)?/g, function(a, b) {
                    return '$|' + (b ? '^' : '^.*\\.');
                }) + '$';
        } else {
            re = '^.*\\.(' + extensions + ')$';
        }

        this.extRe = new RegExp(re, 'gi');
    };

    Mode.prototype.supportsFile = function(filename) {
        return filename.match(this.extRe);
    };

    /**
     * Add a new mode, if the name doesn't already exist.
     *
     * For pre-existing modes, use the updateMode function.
     *
     * @param {string} name the name of the mode
     * @param {string} extensions a | separated list of extensions
     * @param {string?} caption an optional caption for the mode
     */
    function addMode(name, extensions, caption) {
        var modeName = name.toLowerCase();
        if (modesByName.hasOwnProperty(modeName)) {
            return;
        }

        caption = caption || (nameOverrides[name] || name).replace(/_/g, ' ');
        var mode = new Mode(modeName, caption, extensions);

        modesByName[mode.name] = mode;
        modes.push(mode);
    }

    /**
     * Update an existing mode to support additional extensions.
     *
     * @param {string} name the name of the mode
     * @param {string} extensions a | separated list of extensions to append
     */
    function updateMode(name, extensions) {
        var mode = modesByName[name];
        if (mode) {
            mode.setExtensions(mode.extensions + '|' + extensions);
        }
    }

    /**
     * Suggests a mode based on the file extension present in the given path
     * @param {string} path The path to the file
     * @returns {object} Returns an object containing information about the
     *  suggested mode.
     */
    function getModeForPath(path) {
        var mode = modesByName.text;
        var fileName = path.split(/[\/\\]/).pop();
        for (var i = 0; i < modes.length; i++) {
            if (modes[i].supportsFile(fileName)) {
                mode = modes[i];
                break;
            }
        }
        return mode;
    }

    for (var name in supportedModes) {
        addMode(name, supportedModes[name][0]);
    }

    module.exports = {
        modes: modes,
        modesByName: modesByName,

        addMode: addMode,
        updateMode: updateMode,
        getModeForPath: getModeForPath
    };
});
