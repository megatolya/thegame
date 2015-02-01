interface MD5fn {
    (source: any): string;
}

declare module 'MD5' {
    var fn: MD5fn;
    export = fn;
}
