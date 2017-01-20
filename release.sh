#!/bin/sh

set -e

npm test
git diff-index --quiet HEAD --
git checkout develop
git checkout -b release/$1
npm version --no-git-tag-version $1
npm run docs
git add DOCUMENTATION.md package.json
git commit -m "release version $1"
git checkout master
git merge --no-ff -m "merge release/$1 into master" release/$1
npm run changelog
git add CHANGELOG.md
git commit --amend -m "merge release/$1 into master" 
git tag v$1
git push
git checkout develop
git merge --no-ff -m "merge release/$1 into develop" release/$1
git diff develop master -- CHANGELOG.md > patchfile
git apply patchfile
rm patchfile
git add CHANGELOG.md
git commit --amend -m "merge release/$1 into develop"
git push
git branch -D release/$1
