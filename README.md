# download git repo

down a git repository, support `github`, `gitlab`, `bitbucket`, `gitee(码云)`

## Installation

```bash
$ npm install get-git-repository
```
or:
```bash
$ yarn add get-git-repository
```

## Usage

```js
  const download = require('get-git-repository')
  // owner/repository  => download from github
  // github:owner/repository  => download from github
  // gitlab:owner/repository  => download from github
  // bitbucket:owner/name  => download from bitbucket
  const repo = '/huoqishi/x-html'
  download(repo, 'test/').then(() => {
    console.log('ok')
  })
```

## API

### download

`download(repo, savePath, [options])`

clone `repo` to `savePath`, return `promise` on completion.

### options

- `clone`: default false,  If true use `git clone` instead of an http download。

  > if download from gitee(码云),  api will auto set clone = true。

- `shallow`: when `true`, clone with depth 1 (optional).

- `checkout`: revision/branch/tag to check out (optional).

## Copyright & License

© huoqishi & 火骑士空空

Released under the [MIT](https://choosealicense.com/licenses/isc/).