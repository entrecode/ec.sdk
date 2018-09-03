#!/bin/sh

set -e

git diff-index --quiet HEAD --
git checkout develop
npm i
npm test
git checkout -b release/$1
npm version --no-git-tag-version $1
npm run docs
git add docs/* package.json package-lock.json
git commit --no-verify  -m "release version $1"
git checkout master
git merge --no-ff --no-verify  -m "merge release/$1 into master" release/$1
npm run changelog
git add CHANGELOG.md
npm run docs
git add docs/index.html
git commit --amend --no-verify  -m "merge release/$1 into master"
git tag v$1
git push --no-verify
git push origin --no-verify v$1
git checkout develop
git merge --no-ff --no-verify  -m "merge release/$1 into develop" release/$1
git diff develop master -- CHANGELOG.md > patchfile
git apply patchfile
rm patchfile
git diff develop master -- docs/index.html > patchfile
git apply patchfile
rm patchfile
git add CHANGELOG.md docs/index.html
git commit --amend --no-verify  -m "merge release/$1 into develop"
git push --no-verify
git branch -D release/$1
