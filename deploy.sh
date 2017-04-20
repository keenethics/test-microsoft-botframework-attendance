DATE=date +"%m-%d-%y"
BRANCH=feature-$(DATE)

git checkout -b $BRANCH
npm run build
git add .
git commit -m "release"
git push heroku master
