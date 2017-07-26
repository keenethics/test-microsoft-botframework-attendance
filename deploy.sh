BRANCH=feature-`date +%y/%m/%d-%H.%M.%S`
echo $BRANCH
git checkout -b $BRANCH
npm run build
git add .
git commit -m "release"
git push --force heroku master
git reset --hard HEAD^