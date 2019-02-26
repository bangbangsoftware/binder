mkdir ../what-a-bind && cd ../what-a-bind
npm init -y
npm i live-server
npm i https://github.com/bangbangsoftware/binder -D
echo "<html>"  > index.html
echo "      <input placeholder='go on type in here' name='name' id='name'></input>" >> index.html
echo "      <div name='name' id='label'></div>" >> index.html
echo "      <script type='module' src='../node_modules/binder/go.js'></script>" >> index.html
echo "</html>" >> index.html
node ./node_modules/.bin/live-server