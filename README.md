![Logo of the project](./icon.svg)

#  The Binder 
> A tiny library for binding data on a web page and storing locally 

## Installing / Getting started

This is hosted on github pages [here](http://bangbangsoftware.github.io/binder/index.html)

You can run the bash script quick-bind.sh and this will do a quick project....

```shell
mkdir ../what-a-bind && cd ../what-a-bind
npm init -y
npm i live-server
npm i https://github.com/bangbangsoftware/binder -D
echo "<html>"  > index.html
echo "      <input placeholder='go on type in here' name='name' id='name' autofocus></input>" >> index.html
for i in `seq 1 25`;
do
    echo "      <div name='name' id='label$i'></div>" >> index.html
done
echo "      <div name='storage' id='slabel'>Look in local storage!</div>" >> index.html
echo "      <script type='module' src='../node_modules/binder/go.js'></script>" >> index.html
echo "</html>" >> index.html
node ./node_modules/.bin/live-server
```

## Security

Everything is stored locally, so as long as your local storage is safe, so is your data.

## Developing

A pure js application that makes great use of local storage. 

```shell
# Dependencies
None!

# serve with hot reload at [http://127.0.0.1:8080/](http://127.0.0.1:8080/)
npm start

# build for production with minification 
npm run build - yet to do (Might use rollup) 

# run unit tests
npm run unit - currently there are none

# run e2e tests
npm run e2e - currently there are none

# run all tests
npm test
```

### Built with
Nothing, just pure JS.

### Prerequisites
Nothing, no back end, no babel... just go.

### Building, Deploying / Publishing

To build the project...

```shell
npm run build
```
 This will build the site to dist, which can be commited and served by github
 pages

## To Do

* [ ] Documentation 
* [x] Swapper 
* [ ] Jest
* [x] Put on github pages
* [ ] Improve test page
* [ ] Typescript

## Versioning

Undecided.

## Configuration

There is zero configuration as of yet apart from setting up the inital team

## Style guide

Undecided.

## Api Reference

See JSON in local storage

## Licensing

GNU General Public License v3.0


