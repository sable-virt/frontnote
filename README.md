# FrontNote
[![GitHub version](https://badge.fury.io/gh/frontainer%2Ffrontnote.svg)](http://badge.fury.io/gh/frontainer%2Ffrontnote)
[![Build Status](https://travis-ci.org/frontainer/frontnote.svg)](https://travis-ci.org/frontainer/frontnote)
[![Code Climate](https://codeclimate.com/github/frontainer/frontnote/badges/gpa.svg)](https://codeclimate.com/github/frontainer/frontnote)

![FrontNote](http://frontainer.com/images/frontnote.png)

StyleGuide Generator
Node.jsを使ったスタイルガイドジェネレーター

## Usage - 使い方

First, install `frontnote`:

```shell
npm install frontnote --save-dev
```

```js
var FrontNote = require('frontnote');
var note = new FrontNote({
	out: './docs'
});
note.render('path/**/*.css').subscribe(function() {
	//callback
});
```

## Plugins - プラグイン

* Grunt - [grunt-frontnote](https://www.npmjs.org/package/grunt-frontnote)
* Gulp - [gulp-frontnote](https://www.npmjs.org/package/gulp-frontnote)

## API

### FrontNote(options);

#### options
Type: `Object`
Default value: `{}`

Option.
Please see options section for more information.

オプション
詳しくはオプションの項をご覧ください。

### note.render(files,callback);

#### files
@Required  
Type: `String | Array`  
Pattern to be matched.  
Please see the [minimatch](https://github.com/isaacs/minimatch) documentation for more details.

マッチさせたいパターン  
詳しくは[minimatch](https://github.com/isaacs/minimatch)のドキュメントをご覧ください。

#### callback
Type: `Function`
Default value: `null`

Call this function when generated style guide.

スタイルガイドが生成された後に実行するされる関数

## Option - オプション

### options.title
Type: `String`
Default value: `StyleGuide`

Title of StyleGuide.

スタイルガイドのタイトル

ログを詳細に表示します

### options.overview
Type: `String`
Default value: `__dirname + '/styleguide.md''`

StyleGuide overview file's path.
Overview file is required Markdown format.  

index.htmlに表示するオーバービューファイル(マークダウン)のパス  
オーバービューファイルはマークダウン形式です。

### options.template
Type: `String`
Default value: `__dirname + '/template''`

StyleGuide template path.  

スタイルガイドのテンプレートパス

### options.includeAssetPath
Type: `String`
Default value: `assets/**/*`

The path of the file you want to copy the generated directory.

生成されたディレクトリにコピーしたいファイルパス

### options.out
Type: `String`
Default value: `./frontnote`

Directory in which to generate a style guide.

### options.css
Type: `String|Array`
Default value: `./style.css`

Path of CSS that you want to read in HTML. In the array or string.

HTMLに読み込みたいCSSのパス。文字列または配列で指定します。

### options.script
Type: `String|Array`
Default value: `null`

Path of JS that you want to read in HTML. In the array or string.

HTMLに読み込みたいJSのパス。文字列または配列で指定します。

### options.clean
Type: `Boolean`
Default value: `false`

Clean files and folder from options.out directory.

出力先ディレクトリとファイルを削除します。

### options.verbose
Type: `Boolean`
Default value: `false`

Display a detailed log

ログを詳細に表示します

### options.params
Type: `Object`
Default value: `{}`

Custom variables for using ejs templates.

ejsテンプレート内で使う任意の変数を定義できます。

## Template - テンプレート

[frontnote-template](https://github.com/frontainer/frontnote-template)

テンプレートはfrontnote-templateを参考にカスタマイズできます

## Comment Style - コメントの書き方

### File overview - ファイル概要

Only 1 comment block in a file.  
１ファイルに１つき１ブロックだけ記述できます。

	/*
	#overview
	fileoverview title
	
	fileoverview comment
	*/

### Section - セクション

Section of style guide.
'@' means attribute of this section. (ex. @deprecated @todo)

各スタイルごとに記述します。  
@をつけるとこのセクションに属性ラベルをつけることができます（例: @非推奨, @todo）

	/*
	#styleguide
	style title

	style comment.

	@deprecated
	@非推奨
	@todo
	@your-attribute

	```
	sample code here.
	```
	*/


### Color Pallet - カラーパレット

Create color guide
カラーガイドを作成します。

	/*
	#colors

	@primary #996600
	@secondary #333
	@color-name color-code
	*/

## Test

```
npm install
npm test
```