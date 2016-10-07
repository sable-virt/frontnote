module.exports = {
    comment: /\/\*+\s*#styleguide([^*]|\*[^/])*\*+\//g,
    overview: /\/\*+\s*#overview([^*]|\*[^/])*\*+\//g,
    colors: /\/\*+\s*#colors([^*]|\*[^/])*\*+\//g,
    color: /@(.+)\s+(.+)$/,
    splitter: /\n|\r/,
    prefix: /(^\/\*+\s*\n*(#styleguide|#overview)?)|(\n*\s*\*+\/$)/gm,
    line: /^\s*$/gm,
    attr: /^\s*\t*@.+$/gm,
    attrPrefix: /^\s*\t*@/,
    code: /```(.|\s)+```/g,
    codeWrapper: /(```)\n?/g
};