#!/bin/sh
#
# utility to install reactioncommcere:* packages
# packages are cloned, or pulled to env PACKAGE_DIRS
#
# used by the circle build scripts to test the complete reaction
# release with latest development branch packages.
#
# Getting file doesn't exist errors?
# See:  http://stackoverflow.com/questions/14820329/mkdir-home-error
#
# Use:
# cp bin/clone-packages.sh /usr/local/bin
#
# set default meteor packages dir to tmp
: ${PACKAGE_DIRS:="packages"}

# we'll clone to the package dir
PKGDST=$PACKAGE_DIRS
set -u
set -e

# ensure repos not cached by using .meteor folder
mkdir -p $PKGDST

echo "*****************************************************************"
echo "checking the default branches for reactioncommerce:* packages    "
echo "*****************************************************************"
PKGLIST=$(grep "^reactioncommerce:" .meteor/packages)
VERLIST=$(grep "reactioncommerce:" .meteor/versions)
REACTIONPACKAGES=$VERLIST || $PKGLIST

# loop through packages file and get the reactioncommerce package repos
while read -r PACKAGE; do
  PACKAGE="$(echo $PACKAGE | sed -e 's/@.*//')"
  echo "fetching meteor package info ---> $PACKAGE"
  GITURL=$(meteor show $PACKAGE --show-all |grep 'Git: ' | sed -e 's/Git: //g')
  REPO=$(basename "$GITURL" ".${GITURL##*.}")

  if [ -n "$PACKAGE" ]; then
    # if we've not checked it, now would be a good time
    if [ "$REPO" ]; then
      if [ ! -d "$PKGDST/$REPO" ]; then
       echo "Git clone: $PACKAGE @ $GITURL TO $PKGDST/$REPO"
       git -C $PKGDST clone $GITURL
      else
        # check if we're actually a git repo, we might be a local that been published
        if [ -d "$PKGDST/$REPO/.git" ]; then
          # yeah, we've got local repos already. let's just pull
          echo "Git pull: $PACKAGE IN $PKGDST/$REPO"
          git -C $PKGDST/$REPO pull
        else
          echo "Skipping: $PACKAGE IN $PKGDST/$REPO"
        fi
     fi
    else
      echo "Skipping: $PACKAGE IN local"
    fi
  fi
done <<< "$REACTIONPACKAGES"

# just a little eye candy fun after spitting out some code spray
echo "*****************************************************************"
echo "reactioncommerce:* packages updated in $PACKAGE_DIRS             "
echo "use: export PACKAGE_DIRS=$PACKAGE_DIRS                           "
echo "*****************************************************************"
exit
