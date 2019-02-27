#!/bin/bash
echo "Warning deleting last what-a-bind"
touch ../what-a-bind && rm -r ../what-a-bind
mkdir ../what-a-bind && cd ../what-a-bind
npm init -y
npm i live-server
npm i https://github.com/bangbangsoftware/binder -D
echo "<html>"  > index.html
echo "      <style>"  >> index.html
echo "            .source { " >> index.html
echo "                 background-color: #131212;" >> index.html
echo "                 color: #27ec27;" >> index.html
echo "            } " >> index.html
echo "            .swap-selected { " >> index.html
echo "                 background-color:red;" >> index.html
echo "            } " >> index.html
echo "            body { " >> index.html
echo "              font-family: monospace;" >> index.html
echo "            } " >> index.html
echo "            .main { " >> index.html
echo "                 display: grid;" >> index.html
echo "                 grid-template-columns: 50% 50%" >> index.html
echo "            } " >> index.html
echo "            button { " >> index.html
echo "                 width: 100px;" >> index.html
echo "                 height: 80px;" >> index.html
echo "            } " >> index.html
echo "            .row { " >> index.html
echo "                 display: grid;" >> index.html
echo "                 grid-template-columns: auto auto auto;" >> index.html
echo "            } " >> index.html
echo "            .same { " >> index.html
echo "                 display: grid;" >> index.html
echo "                 grid-template-columns: auto auto auto;" >> index.html
echo "            } " >> index.html
echo "      </style>" >> index.html
echo "      <body>" >> index.html
echo "      <div class='main'>" >> index.html
echo "        <div>" >> index.html
echo "         <H1>THE BINDER</H1>" >> index.html
echo "         <div class='same'>" >> index.html
echo "          <button name='name' id='label0'></button>" >> index.html
echo "          <input placeholder='go on, type in here....' name='name' id='name' autofocus></input>" >> index.html
for i in `seq 1 25`;
do
    echo "          <div name='name' id='label$i'></div>" >> index.html
done
echo "         </div>" >> index.html
echo "         <H1>GOOD EH?</H1>" >> index.html
echo "         <div>Press refresh (F5)</div>" >> index.html
echo "         <div>Look in local storage!</div>" >> index.html
echo "         <H1>Plug ins...</H1>" >> index.html
echo "         Please, click away...." >> index.html
echo "         <div class='same'>" >> index.html
echo "          <div>" >> index.html
echo "              <H3>Swapper</H3>" >> index.html
echo "              <div class='row'>" >> index.html
echo "                  <button swapper='jumper' name='swap1' id='swap1'>HERE</button>" >> index.html
echo "                  <button swapper='jumper' name='swap2' id='swap2'>THERE</button>" >> index.html
echo "                  <button swapper='jumper' name='swap3' id='swap3'> </button>" >> index.html
echo "              </div>" >> index.html
echo "         </div>" >> index.html
echo "         <div>" >> index.html
echo "              <H3>Toggler</H3>" >> index.html
echo "              <button toggle='BANG,SLIP,TEETH,WALLPAPER' name='jumping' id='jumping'>BANG</button>" >> index.html
echo "         </div>" >> index.html
echo "         <script type='module' src='../node_modules/binder/go.js'></script>" >> index.html
echo "      </div>" >> index.html
echo "      </div>" >> index.html
echo "      <div class='source'>" >> index.html
echo "      <xmp>" >> index.html
cp index.html pre
cat pre >> index.html
rm pre
echo "</body></html>" >> index.html
echo "      </xmp>" >> index.html
echo "      </div>" >> index.html
echo "      </body>" >> index.html
echo "</html>" >> index.html
node ./node_modules/.bin/live-server