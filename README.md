climatediff - Compares the climate of two cities
================================================
A simple web application that shows the climate difference between two cities.
If you're considering moving, this application will give you an idea
of day-to-day weather differences between where you are now and your new city.

## Hacking
First, install the tools we use for developing and building using `npm`, if you do not already have them:

    npm install -g gulp-cli
    npm install -g bower
    npm install -g typings

Next, check out the project.  Install gulp and the project's JS and PHP dependencies with
`npm`, `bower` and `composer`.  Install TypeScript definition files via `typings` for a
better development experience as well:

    git clone https://github.com/bobbylight/climatediff.git
    cd climatediff
    npm install
    bower install
    typings install
    # On Windows, use Composer's installer; otherwise, just use curl
    curl -sS https://getcomposer.org/installer | php
    php composer.phar install

The development version of the application lives in `src/`.  Running `gulp watch` will set up watches and
`livereload` for real-time development and debugging.

You can build the production version of it into `dist/` by running `gulp`.
