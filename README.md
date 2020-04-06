BetDuel UI project for Admin panel
==============


Dependencies
--------------

Java 8
Gradle


Build source code
--------------

npm i && npm start


Publish source code
--------------

# no preping env:

	sudo npm i && udo npm run prod

# OR prep env once:

	mkdir -p ~/.npm-global/bin
	npm config set prefix '~/.npm-global'
	echo '# set PATH so it includes user s private npm bin if it exists' >> ~/.profile
	echo 'if [ -d "$HOME/.npm-global" ] ; then' >> ~/.profile
	echo '    PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.profile
	echo 'fi' >> ~/.profile
	source ~/.profile 
	echo $PATH

# and build without sudo:

	npm i && npm run prod

	OR

	yarn && yarn prod

# push to nexus:
  # run npm commands
    npm run pack
    # command above generates tgz archive with bundle  from dist folder
    npm publish <tarball>
	TODO push to nexus here
	tar -cvpzf dist-1.3.tar.gz dist/

Change ENV
--------------

	src/app/api/const.js endpoint urls


To fix ENOSPC Node.js error on linux
--------------

	echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p


