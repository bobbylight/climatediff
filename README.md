climatediff - Compares the climate of two cities
================================================
A simple web application that compares the climate difference between two
cities.  If you're considering moving, this application will give you an idea
of day-to-day weather differences between where you are now and your new city.

## Hacking
First, install `grunt-cli` and `bower` using `npm` if you do not already have them:

    npm install -g grunt-cli
    npm install -g bower

Next, check out the project.  Install grunt and its JS and PHP dependencies with
`npm`, `bower` and `composer`:

    git clone https://github.com/bobbylight/climatediff.git
    cd climatediff
    npm install
    bower install
    # On Windows, use Composer's installer; otherwise, just use curl
    curl -sS https://getcomposer.org/installer | php
    php composer.phar install

The development version of the application lives in `src/`.  You can build the
production version of it into `dist/` by running `grunt`.
