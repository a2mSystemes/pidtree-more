<h1 align="center">
  <b>pidtree</b>
</h1>
<p align="center">
  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/pidtree-more">
    <img src="https://img.shields.io/npm/v/pidtree-more.svg" alt="Latest version on npm" />
  </a>
  <!-- Downloads - npm -->
  <a href="https://npm-stat.com/charts.html?package=pidtree-more">
    <img src="https://img.shields.io/npm/dt/pidtree-more.svg" alt="Downloads on npm" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/a2msystemes/pidtree-more/tree/master/license">
    <img src="https://img.shields.io/github/license/a2msystemes/pidtree-more.svg" alt="Project license" />
  </a>

  <!-- <br/> -->

  <!-- Lint -->
  <!-- <a href="https://github.com/a2msystemes/pidtree-more/actions?query=workflow:lint+branch:master"> -->
  <!-- <img src="https://github.com/a2msystemes/pidtree-more/workflows/lint/badge.svg?branch=master" alt="Lint status" /> -->
  <!-- </a> -->
  <!-- Test - macOS -->
  <!-- <a href="https://github.com/simonepri/pidtree/actions?query=workflow:test-macos+branch:master"> -->
  <!-- <img src="https://github.com/simonepri/pidtree/workflows/test-macos/badge.svg?branch=master" alt="Test macOS status" /> -->
  <!-- </a> -->
  <!-- Test - Ubuntu -->
  <!-- <a href="https://github.com/simonepri/pidtree/actions?query=workflow:test-ubuntu+branch:master"> -->
  <!-- <img src="https://github.com/simonepri/pidtree/workflows/test-ubuntu/badge.svg?branch=master" alt="Test Ubuntu status" /> -->
  <!-- </a> -->
  <!-- Test - Windows -->
  <!-- <a href="https://github.com/simonepri/pidtree/actions?query=workflow:test-windows+branch:master"> -->
  <!-- <img src="https://github.com/simonepri/pidtree/workflows/test-windows/badge.svg?branch=master" alt="Test Windows status" /> -->
  <!-- </a> -->
  <!-- Coverage - Codecov -->
  <!-- <a href="https://codecov.io/gh/simonepri/pidtree"> -->
  <!-- <img src="https://img.shields.io/codecov/c/github/simonepri/pidtree/master.svg" alt="Codecov Coverage report" /> -->
  <!-- </a> -->
  <!-- DM - Snyk -->
  <!-- <a href="https://snyk.io/test/github/simonepri/pidtree?targetFile=package.json"> -->
  <!-- <img src="https://snyk.io/test/github/simonepri/pidtree/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" /> -->
  <!-- </a> -->

  <!-- <br/> -->

  <!-- Code Style - XO-Prettier -->
  <!-- <a href="https://github.com/xojs/xo"> -->
  <!-- <img src="https://img.shields.io/badge/code_style-XO+Prettier-5ed9c7.svg" alt="XO Code Style used" /> -->
  <!-- </a> -->
  <!-- Test Runner - AVA -->
  <!-- <a href="https://github.com/avajs/ava"> -->
  <!-- <img src="https://img.shields.io/badge/test_runner-AVA-fb3170.svg" alt="AVA Test Runner used" /> -->
  <!-- </a> -->
  <!-- Test Coverage - Istanbul -->
  <!-- <a href="https://github.com/istanbuljs/nyc"> -->
  <!-- <img src="https://img.shields.io/badge/test_coverage-NYC-fec606.svg" alt="Istanbul Test Coverage used" /> -->
  <!-- </a> -->
  <!-- Init - ni -->
  <!-- <a href="https://github.com/simonepri/ni"> -->
  <!-- <img src="https://img.shields.io/badge/initialized_with-ni-e74c3c.svg" alt="NI Scaffolding System used" /> -->
  <!-- </a> -->
  <!-- Release - np -->
  <!-- <a href="https://github.com/sindresorhus/np"> -->
  <!-- <img src="https://img.shields.io/badge/released_with-np-6c8784.svg" alt="NP Release System used" /> -->
  <!-- </a> -->
</p>


## Synopsis

This fork just that add to [pidtree](https://github.com/simonepri/pidtree) the opportunity to have the name of the process and to search with the process name, especially on Windows (not tested on other platforms).
It implements a watcher too.

## Usage

```js
var pidtree = require('pidtree');

// Get childs of current process
pidtree(process.pid, function (err, pids) {
  console.log(pids);
  // => []
});

// Include the given pid in the result array
pidtree(process.pid, {root: true}, function (err, pids) {
  console.log(pids);
  // => [727]
});

// Get all the processes of the System (-1 is a special value of this package)
pidtree(-1, function (err, pids) {
  console.log(pids);
  // => [530, 42, ..., 41241]
});

// Include PPID in the results
pidtree(1, {advanced: true}, function (err, pids) {
  console.log(pids);
  // => [{ppid: 1, pid: 530}, {ppid: 1, pid: 42}, ..., {ppid: 1, pid: 41241}]
});

// If no callback is given it returns a promise instead
const pids1 = await pidtree(1);
console.log(pids);
// => [141, 42, ..., 15242]

// you can also search a process by name
const pids2 = await pidtree("firefox");
console.log(pids);
// => [13899, 13900, ..., 15242]


// or with like to search by regexp
const pids3 = await pidtree(-1,{like:"firef"});
console.log(pids);
// => [13899, 13900, ..., 15242]


// you can also search a process by with like
const pids4 = await pidtree(-1,{like:"firef", withNames: true});
console.log(pids);
// => [{pid:13899, name:"firefox.exe"}, {pid:13900, name:"firefox.exe"}, ..., {pid:13913, name:"firefox.exe"}]

// note that searching with option withNames implies with root
const pids5 = await pidtree("myApp",{withNames: true});
console.log(pids);
// => [{pid:13899, name:"myApp"}]

```




## Authors

- [Ange-Marie MAURIN](https://github.com/a2msystemes/)

See also the list of [contributors][contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[new issue]: https://github.com/a2msystemes/pidtree-more/issues/new
[license]: https://github.com/a2msystemes/pidtree-more/tree/master/license
[contributors]: https://github.com/a2msystemes/pidtree-more/contributors
