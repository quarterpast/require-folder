require! [fs,path,callsite]

empty = (.length is 0)

concat-map = (f,[x,...xs]:list)-->
	| empty list => []
	| otherwise  => (f x) ++ concat-map f,xs

flatten = (arr)->
	| typeof! arr is \Array => concat-map flatten,arr
	| otherwise => [arr]

module.exports = (dir,{ignore = []}:opts,caller = __stack.1.get-file-name!)->
	resolved = (path.dirname caller) `path.resolve` dir

	for file in fs.readdir-sync resolved
		match full = path.join resolved,file
		| (== //#{(join '|' ignore) or '$^'}//) => console.debug? "ignoring #full"
		| fs.stat-sync>>(.is-directory!)        => module.exports (path.join dir,file), opts, caller
		| path.extname>>(of require.extensions) => require full
	|> flatten

if module is require.main
	console.log module.exports "test"