var PATTERNS = {
    comment: /\/\*\s*s?#styleguide([^*]|\*[^/])*\*\//g,
    overview: /\/\*\s*s?#overview([^*]|\*[^/])*\*\//g,
    colors: /\/\*\s*s?#colors([^*]|\*[^/])*\*\//g,
    color: /@(.+)\s{1}(.+)$/,
    splitter: /\n/,
    prefix: /^ *\/?\**(#styleguide|#overview)?\/? */gm,
    line: /^\s*$/gm,
    attr: /^@.+$/gm,
    attrPrefix: /^@/,
    code: /```(.|\s)+```/g,
    codeWrapper: /(```)\n?/g
};
module.exports = PATTERNS;