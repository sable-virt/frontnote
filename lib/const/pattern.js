var PATTERNS = {
    comment: /\/\*+\s*#styleguide([^*]|\*[^/])*\*+\//g,
    overview: /\/\*+\s*#overview([^*]|\*[^/])*\*+\//g,
    colors: /\/\*+\s*#colors([^*]|\*[^/])*\*+\//g,
    color: /@(.+)\s+(.+)$/,
    splitter: /\n/,
    prefix: /^ *\/?\**(#styleguide|#overview)?\/? */gm,
    line: /^\s*$/gm,
    attr: /^@.+$/gm,
    attrPrefix: /^@/,
    code: /```(.|\s)+```/g,
    codeWrapper: /(```)\n?/g
};
module.exports = PATTERNS;