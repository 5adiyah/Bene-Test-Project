#! /bin/bash

THEME_NAME=$1
echo Theme name is $THEME_NAME
THEME_DEST=bene_child
echo "Theme will be placed in $THEME_DEST"

cp -r $THEME_NAME $THEME_DEST

# go through files and edit them replacing bene_child with the new theme name
sed "s/${THEME_NAME}_/bene_child_/g" $THEME_DEST/$THEME_NAME.theme >$THEME_DEST/bene_child.theme
rm $THEME_DEST/$THEME_NAME.theme

sed "s/name: ${THEME_NAME}/name: Bene Child/g" $THEME_DEST/$THEME_NAME.info.yml | sed "s/${THEME_NAME}/bene_child/g" >$THEME_DEST/bene_child.info.yml
rm $THEME_DEST/${THEME_NAME}.info.yml

sed "s/${THEME_NAME}/bene_child/g" $THEME_DEST/$THEME_NAME.libraries.yml >$THEME_DEST/bene_child.libraries.yml
rm $THEME_DEST/${THEME_NAME}.libraries.yml

mv $THEME_DEST/composer.json $THEME_DEST/composer.child
sed "s/${THEME_NAME}/bene_child/g" $THEME_DEST/composer.child >$THEME_DEST/composer.json
rm $THEME_DEST/composer.child

mv $THEME_DEST/package.json $THEME_DEST/package.child
sed "s/${THEME_NAME}/bene_child/g" $THEME_DEST/package.child >$THEME_DEST/package.json
rm $THEME_DEST/package.child

mv $THEME_DEST/package.json $THEME_DEST/package.child
sed "s/${THEME_NAME}/bene_child/g" $THEME_DEST/package.child >$THEME_DEST/package.json
rm $THEME_DEST/package.child

mv $THEME_DEST/README.md $THEME_DEST/README.md.child
sed "s:${THEME_NAME}:Bene Child|Bene_child can be found in /new-project-name/web/profiles/contrib/bene/themes/bene_child where new-project-name is your project.:g" $THEME_DEST/README.md.child | tr '|' '\n' >$THEME_DEST/README.md
rm $THEME_DEST/README.md.child

