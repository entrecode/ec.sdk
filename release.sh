#!/bin/sh

set -e

git diff-index --quiet HEAD --
git checkout develop
npm test
git checkout -b release/$1
npm version --no-git-tag-version $1
npm run docs
npm run changelog
git add docs/* CHANGELOG.md package.json package-lock.json
git commit --no-verify  -m "release version $1"
git checkout master
git merge --no-ff --no-verify  -m "merge release/$1 into master" release/$1
git tag v$1
git push --no-verify
git push origin --no-verify v$1
git checkout develop
git merge --no-ff --no-verify  -m "merge release/$1 into develop" release/$1
git push --no-verify 
git branch -D release/$1
