#!/usr/bin/env bash

BRANCH=feature-`date +%y/%m/%d-%H.%M.%S`
echo $BRANCH
git checkout -b $BRANCH
echo "node_modules/ npm-debug.log *.js.swp .idea/" > .gitignore
npm run build
git status
git add .
git status
git commit -m "release"
git push --force heroku $BRANCH:master
git reset --hard HEAD^
git checkout development
git branch -D $BRANCH
