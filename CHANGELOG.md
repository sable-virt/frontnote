<a name="2.0.4"></a>
## [2.0.4](https://github.com/frontainer/frontnote/compare/v2.0.3...v2.0.4) (2016-10-08)


### fix

* 対象のcssがない場合にpathエラーになる ([acd94b2b1bd3340459285dce57820f2fa9cacaec](https://github.com/frontainer/frontnote/commit/acd94b2b1bd3340459285dce57820f2fa9cacaec))



<a name="2.0.3"></a>
## [2.0.3](https://github.com/frontainer/frontnote/compare/v2.0.2...v2.0.3) (2016-10-08)


### fix

* verbose出力をcliではなくlib/frontnote.jsで ([bcabc34af550e6de20510ef890c304179ea80dea](https://github.com/frontainer/frontnote/commit/bcabc34af550e6de20510ef890c304179ea80dea))



<a name="2.0.2"></a>
## [2.0.2](https://github.com/frontainer/frontnote/compare/v2.0.1...v2.0.2) (2016-10-08)


### fix

* includeAssetPathがデフォルトだと正しく複製されない ([aa8d9f141106b9d0c61cbcf48281b6f0df41e406](https://github.com/frontainer/frontnote/commit/aa8d9f141106b9d0c61cbcf48281b6f0df41e406))



<a name="2.0.1"></a>
## [2.0.1](https://github.com/frontainer/frontnote/compare/v2.0.0...v2.0.1) (2016-10-08)


### fix

* render関数が配列を許容できるように ([db68cc249348e254a6e6a5826215a9a51c160cd4](https://github.com/frontainer/frontnote/commit/db68cc249348e254a6e6a5826215a9a51c160cd4))



<a name="2.0.0"></a>
# [2.0.0](https://github.com/frontainer/frontnote/compare/1.1.2...v2.0.0) (2016-10-08)


### add

* CLIで実行できるように ([c9708bf30cc1de9ad49eb03e91b5082025e523ab](https://github.com/frontainer/frontnote/commit/c9708bf30cc1de9ad49eb03e91b5082025e523ab))
* ejsに任意の値を渡せるオプションparamsを追加 #7 ([c9e4b88f48fe7af01c4106320350296ad04dbfeb](https://github.com/frontainer/frontnote/commit/c9e4b88f48fe7af01c4106320350296ad04dbfeb))

### breaking

* 動作環境をNode.js 5以上に ([34a01c45deb4d9664d3bec63503459a56c7ee5c5](https://github.com/frontainer/frontnote/commit/34a01c45deb4d9664d3bec63503459a56c7ee5c5))

### feat

* 非同期処理をRxに置き換え、記法をES6に ([8d27e28f12f0288a35af1209d32adf5d2cad75d4](https://github.com/frontainer/frontnote/commit/8d27e28f12f0288a35af1209d32adf5d2cad75d4))



## Difference of version 2.x and 1.x - バージョン1.xと0.xの違い

- Some breaking changes - いくつかの仕様変更
- FrontNode Class return `Rx.Observable` - FrontNoteクラスはRx.Observableを返すように
- Add new option `params` - paramsオプションが追加
- Minor bug fix - 軽微な不具合の修正
- Add CLI - CLIでも実行できるように

## Difference of version 1.x and 0.x - バージョン1.xと0.xの違い

- Some breaking changes - いくつかの仕様変更
- New public function - 新しい関数の追加
 - render(filepath,callback);
- Refactor to Testable code(Mocha testing) - テスタブルなコードにリファクタリング(Mochaによるテスト)
- Enabled callback function - コールバック関数を実行できるようになった
- Check coverage - カバレッジのチェックを追加
- Minor bug fix - 軽微な不具合の修正

### Breaking changes - 仕様変更

#### Rx.Observable instead of callback function

##### version 2.x

```
var FrontNote = require('frontnote');
var note = new FrontNote({
	out: './docs'
});
note.render('path/**/*.css').subscribe(function {
	//callback
});
```

##### version 1.x

```
var FrontNote = require('frontnote');
var note = new FrontNote({
    out: './docs'
});
note.render('path/**/*.css',function() { //<- callback function
	// callback
});
```

#### Change timing of output files.

##### version 0.x

```
var frontNote = require('frontnote');
frontNote('path/**/*.css',{
    out: './docs'
});	// <- Immediately output files.
```

##### version 1.x

```
var FrontNote = require('frontnote');
var note = new FrontNote({
    out: './docs'
});
note.render('path/**/*.css',function() { //<- output files.
	// callback
});
```