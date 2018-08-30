#!/bin/bash
set -e
set -x
rm -rf var metadata export build

BRANCH=${BRANCH:-master}
GIT_CLONE_BRANCH=${GIT_CLONE_BRANCH:-HEAD}
RUN_TESTS=${RUN_TESTS:-false}
REPO=${REPO:-repo}

sed \
  -e "s|@BRANCH@|${BRANCH}|g" \
  -e "s|@GIT_CLONE_BRANCH@|${GIT_CLONE_BRANCH}|g" \
  -e "s|\"@RUN_TESTS@\"|${RUN_TESTS}|g" \
  com.endlessm.HackableApp.json.in \
  > com.endlessm.HackableApp.json

flatpak-builder build --ccache com.endlessm.HackableApp.json --repo=repo
flatpak build-bundle ${REPO} com.endlessm.HackableApp.flatpak com.endlessm.HackableApp
