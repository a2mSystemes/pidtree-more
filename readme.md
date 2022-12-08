<h1 align="center">
  <b>pidtree-more</b>
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

</p>


## Synopsis

This fork just that add to [pidtree](https://github.com/simonepri/pidtree) the opportunity to have the name of the process and to search with the process name, especially on Windows (not tested on other platforms).
It's a base module that help me implements [pidtree-watcher](https://github.com/a2msystemes/pidtree-watcher) ([on npmjs](https://www.npmjs.com/package/pidtree-watcher))

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

- original author [Simone Primarosa ](https://github.com/simonepri)
- [Ange-Marie MAURIN](https://github.com/a2msystemes/)

See also the list of [contributors][contributors] who participated in this project.

## License

This project is licensed under the MIT License - see the [license][license] file for details.

<!-- Links -->
[new issue]: https://github.com/a2msystemes/pidtree-more/issues/new
[license]: https://github.com/a2msystemes/pidtree-more/tree/master/license
[contributors]: https://github.com/a2msystemes/pidtree-more/contributors
