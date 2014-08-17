# FrontNote

![FrontNote](http://frontainer.com/images/frontnote.png)

StyleGuide Generator
Node.jsを使ったスタイルガイドジェネレーター

## Version - バージョン
0.0.1

## Usage - 使い方

First, install `frontnote`:

```shell
npm install frontnote --save
```

```shell
var frontNote = require('frontnote');
frontNote('path/to/**/*.css',{
	out: './docs'
});
```

## API

### FrontNote(pattern,options,callback);

#### files
@Required  
Type: `String | Array`  
Pattern to be matched.  
Please see the minimatch documentation for more details.

マッチさせたいパターン  
詳しくはminimatchのドキュメントをご覧ください。

#### options
Type: `Object`
Default value: `{}`

Option.  
Please see options section for more information.

オプション  
詳しくはオプションの項をご覧ください。

#### callback
Type: `Function`
Default value: `null`

Call this function when generated style guide.

スタイルガイドが生成された後に実行するされる関数

## Option - オプション

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

### options.includePath
Type: `String`
Default value: `assets/**/*`

The path of the file you want to copy the generated directory

生成されたディレクトリにコピーしたいファイルパス

### options.out
Type: `String`
Default value: `./frontnote`

Directory in which to generate a style guide.

スタイルガイドを生成するディレクトリ

### options.verbose
Type: `Boolean`
Default value: `false`

Display a detailed log

ログを詳細に表示します