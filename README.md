climatediff - Compares the climate of two cities
================================================
A simple web application that shows the climate difference between two cities.
If you're considering moving, this application will give you an idea
of day-to-day weather differences between where you are now and your new city.

I originally started writing this many moons ago to learn Angular, but set it aside unfinished.
Recently I decided to modernize it, and host it here for posterity, but there is still a lot of
cleanup to do and features to add.

## Hacking
First, install the tools we use for developing and building using `npm`, if you do not already have them:

```bash
npm install -g gulp-cli
npm install -g bower
```

Next, check out the project.  Install gulp and the project's JS and PHP dependencies with
`npm`, `bower` and `composer`:

```bash
git clone https://github.com/bobbylight/climatediff.git
cd climatediff
npm install
bower install
# On Windows, use Composer's installer; otherwise, just use curl
curl -sS https://getcomposer.org/installer | php
php composer.phar install
```

Then, [get a token to access the NCDC CDO web services](http://www.ncdc.noaa.gov/cdo-web/token). Create a new file named `src/init.php` from
`src/init.php.orig` with your token inserted appropriately.  This is necessary for the application to fetch historical data from the NOAA.

The development version of the application lives in `src/`.  Running `gulp watch` will set up watches and
`livereload` for real-time development and debugging.

You can build the production version of it into `dist/` by running `gulp`.

Non-Font-Awesome icons were grabbed from:

* http://www.clipartbest.com/free-printable-weather-symbols
