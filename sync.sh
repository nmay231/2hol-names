#!/bin/bash
set -eo pipefail; shopt -s failglob

if [ "a$1" == "a" ]; then
    echo "Please provide name to 2HOL repo directory"
    exit 1
fi

cp "$1"/server/firstNames.txt docs/
cp "$1"/server/lastNames.txt docs/


# TODO: This isn't fully correct since I actually jerry-rigged names.cpp to work
# without its dependencies. I'm not gonna copy them for now. The list of names
# will change more often than the code will.

#cp "$1"/server/names.cpp .
#cp "$1"/server/names.h .
