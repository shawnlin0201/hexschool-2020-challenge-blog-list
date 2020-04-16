npm run build
cd ./dist
git init
git add -A
git commit -m 'deploy commit'
git push -f https://github.com/shawnlin0201/hexschool-2020-challenge-blog-list.git master:gh-pages
cd ..
