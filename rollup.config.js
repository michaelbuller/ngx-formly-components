export default {
    entry: 'lib/src/index.js',
    dest: 'lib/dist/index.js',
    sourceMap: true,
    format: 'umd',
    moduleName: 'ngx.formly.components',
    globals: {
        '@angular/core': 'ng.core',
        'rxjs/Observable': 'Rx',
        'rxjs/ReplaySubject': 'Rx',
        'rxjs/add/operator/map': 'Rx.Observable.prototype',
        'rxjs/add/operator/mergeMap': 'Rx.Observable.prototype',
        'rxjs/add/observable/fromEvent': 'Rx.Observable',
        'rxjs/add/observable/of': 'Rx.Observable',
        'moment': 'moment',
    }
}