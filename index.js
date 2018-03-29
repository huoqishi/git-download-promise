const downloadUrl = require('download')
const gitclone = require('git-clone-promise')
const rm = require('rimraf').sync

/**
 * Expose `download`.
 */

module.exports = download

/**
 * Download `repo` to `dest` and callback `fn(err)`.
 * change to promise by huoqishi
 *
 * @param {String} repo
 * @param {String} dest
 * @param {Object} opts
 * @param {Function} fn
 */

function download (repo, dest, opts) {
  opts = opts || {}
  repo = normalize(repo)
  const clone = justClone || !!opts.clone
  const url = getUrl(repo, clone)
  return new Promise((resolve, reject) => {
    console.log(url)
    clone
      ? gitclone(url, dest, { checkout: repo.checkout, shallow: repo.checkout === 'master' }, function (err) {
          if (err) {
            return reject(err)
          }
          rm(dest + '/.git')
          resolve()
        })
      : downloadUrl(url, dest, { extract: true, strip: 1, mode: '666', headers: { accept: 'application/zip' } }).then(data => {
          resolve(data)
        }).catch(err => {
          reject(err)
        })
  })
}

/**
 * Normalize a repo string.
 * gitlab:mygitlab.com:flipxfx/download-git-repo-fixture#my-branch
 * gitee.com/huoqishi/fed-vue.git
 * add 码云 support
 * 
 * @param {String} repo
 * @return {Object}
 */

function normalize (repo) {
  const regex = /^((github|gitee|gitlab|bitbucket):)?((.+):)?([^/]+)\/([^#]+)(#(.+))?$/
  const match = regex.exec(repo)
  let type = match[2] || 'github'
  let origin = match[4] || null
  const owner = match[5]
  const name = match[6]
  const checkout = match[8] || 'master'
  let justClone = false

  if (origin == null) {
    if (type === 'github')
      origin = 'github.com'
    else if (type === 'gitlab')
      origin = 'gitlab.com'
    else if (type === 'bitbucket')
      origin = 'bitbucket.org'
    else if (type === 'gitee') {
      origin = 'gitee.com'
      justClone = true
    }
  }

  return {
    type: type,
    justClone: true,
    origin: origin,
    owner: owner,
    name: name,
    checkout: checkout
  }
}

/**
 * Adds protocol to url in none specified
 *
 * @param {String} url
 * @return {String}
 */

function addProtocol (origin, clone) {
  if (!/^(f|ht)tps?:\/\//i.test(origin)) {
    if (clone)
      origin = 'git@' + origin
    else
      origin = 'https://' + origin
  }

  return origin
}

/**
 * Return a zip or git url for a given `repo`.
 *
 * @param {Object} repo
 * @return {String}
 */

function getUrl (repo, clone) {
  const url

  // Get origin with protocol and add trailing slash or colon (for ssh)
  const origin = addProtocol(repo.origin, clone)
  if (/^git\@/i.test(origin))
    origin = origin + ':'
  else
    origin = origin + '/'

  // Build url
  if (clone) {
    url = origin + repo.owner + '/' + repo.name + '.git'
  } else {
    if (repo.type === 'github')
      url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip'
    else if (repo.type === 'gitee')
      url = origin + repo.owner + '/' + repo.name + '/archive/' + repo.checkout + '.zip'
    else if (repo.type === 'gitlab')
      url = origin + repo.owner + '/' + repo.name + '/repository/archive.zip?ref=' + repo.checkout
    else if (repo.type === 'bitbucket')
      url = origin + repo.owner + '/' + repo.name + '/get/' + repo.checkout + '.zip'
    else
      url = github(repo)
  }
  return url
}
