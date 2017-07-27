#!/usr/bin/env bash

BRANCH=feature-`date +%y/%m/%d-%H.%M.%S`
echo $BRANCH
git checkout -b $BRANCH
git status
settings=$(<settings.json)
git add .
git add -f settings.json
git status
git commit -m "release"
git push --force heroku $BRANCH:master
git reset --hard HEAD^
git checkout development
echo $settings >> settings.json
git branch -D $BRANCH
