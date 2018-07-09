#! /bin/bash

# This script works on a theme that was started by copying bene_child.
# If the theme still has the name bene_child sprinkled throughout, this does the
# job of changing those instances of 'bene_child' to the new theme name. For
# example bene_cori had a bunch of places where it was still named bene_child.
# This script goes through the bene_cori directory and replaces those with
# bene_cori and does so in place. (Does _not_ create a new directory or a new copy.)
#
# call like this:
# > cd directory/above/theme/directory
# > update_theme.sh my_new_theme_name
#

  THEME_NAME=$1
  echo Theme name is $THEME_NAME
  THEME_DEST=$THEME_NAME
  echo "Theme will be placed in $THEME_DEST"

  # go through files and edit them replacing bene_child with the new theme name
  sed "s/bene_child_/${THEME_NAME}_/g" $THEME_DEST/bene_child.theme >$THEME_DEST/$THEME_NAME.theme
  rm $THEME_DEST/bene_child.theme

  sed "s/name: Bene Child/name: ${THEME_NAME}/g" $THEME_DEST/bene_child.info.yml | sed "s/bene_child/${THEME_NAME}/g" >$THEME_DEST/$THEME_NAME.info.yml
  rm $THEME_DEST/bene_child.info.yml

  sed "s/bene_child/${THEME_NAME}/g" $THEME_DEST/bene_child.libraries.yml >$THEME_DEST/$THEME_NAME.libraries.yml
  rm $THEME_DEST/bene_child.libraries.yml

  mv $THEME_DEST/composer.json $THEME_DEST/composer.child
  sed "s/bene_child/${THEME_NAME}/g" $THEME_DEST/composer.child >$THEME_DEST/composer.json
  rm $THEME_DEST/composer.child

  mv $THEME_DEST/package.json $THEME_DEST/package.child
  sed "s/bene_child/${THEME_NAME}/g" $THEME_DEST/package.child >$THEME_DEST/package.json
  rm $THEME_DEST/package.child

  mv $THEME_DEST/package.json $THEME_DEST/package.child
  sed "s/bene_child/${THEME_NAME}/g" $THEME_DEST/package.child >$THEME_DEST/package.json
  rm $THEME_DEST/package.child

  mv $THEME_DEST/README.md $THEME_DEST/README.md.child
  sed "s/Bene Child/${THEME_NAME}/g" $THEME_DEST/README.md.child | sed "s/Bene_child/${THEME_NAME}/g" | sed "s:/new-project-name/web/profiles/contrib/bene/themes/bene_child where new-project-name is your project.:${THEME_DEST}:g" >$THEME_DEST/README.md
  rm $THEME_DEST/README.md.child

