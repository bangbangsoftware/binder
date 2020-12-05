cp example/tutorial-setup-4.html footswell/index.html
cp example/tutorial-setup-4.css footswell/index.css
cp example/tutorial-setup-4.js footswell/index.js
cp -R dist footswell/.

cp "example/tutorial-setup-4-posrow.js" footswell/posrow.js
sed -i 's/tutorial-setup-4-posrow/posrow/' footswell/index.js

cp "example/tutorial-setup-4-posbench.js" footswell/posbench.js
sed -i 's/tutorial-setup-4-posbench/posbench/' footswell/index.js

cp "example/tutorial-setup-4-posgoal.js" footswell/posgoal.js
sed -i 's/tutorial-setup-4-posgoal/posgoal/' footswell/index.js

cp "example/tutorial-setup-4-formationedit.js" footswell/formationedit.js
sed -i 's/tutorial-setup-4-formationedit/formationedit/' footswell/index.js

cp "example/tutorial-setup-4-teamnames.js" footswell/teamnames.js
sed -i 's/tutorial-setup-4-teamnames/teamnames/' footswell/index.js

cp "example/tutorial-setup-4-eventslist.js" footswell/eventslist.js
sed -i 's/tutorial-setup-4-eventslist/eventslist/' footswell/index.js

cp "example/tutorial-kickoff-4.html" footswell/kickoff.html
sed -i 's/tutorial-kickoff-4.html/kickoff.html/' footswell/index.js

sed -i 's/tutorial-setup-4/index/' footswell/index.html



sed -i 's/tutorial-setup-4/index/' footswell/kickoff.html

cp "example/tutorial-kickoff-2.css" footswell/kickoff.css
sed -i 's/tutorial-kickoff-2.css/kickoff.css/' footswell/kickoff.html

cp "example/tutorial-kickoff-2.js" footswell/clock.js
sed -i 's/tutorial-kickoff-2.js/clock.js/' footswell/kickoff.html

cp "example/tutorial-kickoff-4.js" footswell/kickoff.js
sed -i 's/tutorial-kickoff-4.js/kickoff.js/' footswell/kickoff.html

sed -i 's/tutorial-kickoff-2.js/clock.js/' footswell/kickoff.js

cp "example/tutorial-kickoff-3-formation.js" footswell/formation.js
sed -i 's/tutorial-kickoff-3-formation.js/formation.js/' footswell/kickoff.js

cp "example/tutorial-kickoff-3-posrow.js" footswell/position.js
sed -i 's/tutorial-kickoff-3-posrow.js/position.js/' footswell/formation.js

cp "example/tutorial-kickoff-3-benchrow.js" footswell/benchrow.js
sed -i 's/tutorial-kickoff-3-benchrow.js/benchrow.js/' footswell/formation.js

sed -i 's/tutorial-setup-4.js/index.js/' footswell/clock.js

cp "example/tutorial-whistle-1.html" footswell/whistle.html
sed -i 's/tutorial-whistle-1.html/whistle.html/' footswell/clock.js

sed -i 's/tutorial-kickoff-2.css/kickoff.css/' footswell/whistle.html
sed -i 's/tutorial-setup-4.css/index.css/' footswell/whistle.html

cp "example/tutorial-whistle-1.js" footswell/whistle.js
sed -i 's/tutorial-whistle-1.js/whistle.js/' footswell/whistle.html

sed -i 's/tutorial-kickoff-4.js/kickoff.js/' footswell/whistle.js
sed -i 's/tutorial-kickoff-2.js/clock.js/' footswell/whistle.js
sed -i 's/tutorial-setup-4.js/index.js/' footswell/whistle.js
sed -i 's/tutorial-setup-4.html/index.html/' footswell/whistle.js


cp "example/tutorial-kickoff-1-teamplay.js" footswell/teamplay.js
sed -i 's/tutorial-kickoff-1-teamplay.js/teamplay.js/' footswell/clock.js

cp "example/tutorial-kickoff-2-scoreclock.js" footswell/scoreclock.js
sed -i 's/tutorial-kickoff-2-scoreclock.js/scoreclock.js/' footswell/clock.js

cp "example/time.js" footswell/time.js

cd footswell
../node_modules/.bin/live-servergit