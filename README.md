# climatediff - Compares the climate of two cities
![Build](https://github.com/bobbylight/climatediff/actions/workflows/build.yml/badge.svg)

A simple web application that shows the climate difference between two cities.
If you're considering moving, this application will give you an idea
of day-to-day weather differences between where you are now and your new city.

I originally started writing this many moons ago to learn Angular, but set it aside unfinished.
Recently I decided to modernize it, and host it here for posterity, but there is still a lot of
cleanup to do and features to add.

## Hacking
First, check out the project.  Install the project's JS and PHP dependencies with
`npm` and `composer`:

```bash
git clone https://github.com/bobbylight/climatediff.git
cd climatediff
npm install
# On Windows, use Composer's installer; otherwise, just use curl
curl -sS https://getcomposer.org/installer | php
php composer.phar install
```

Then, [get a token to access the NCDC CDO web services](http://www.ncdc.noaa.gov/cdo-web/token). Create a new file named `public/api/init.php` from
`public/api/init.php.orig` with your token inserted appropriately.  This is necessary for the application to fetch
historical data from the NOAA.

You can build the production version of it into `dist/` by running `npm run build`.

### npm Scripts
* _npm run clean_ - Delete the `dist/` and `coverage/` (for unit tests) folders
* _npm run build_ - Create a minified build in `dist/`
* _npm run dev_ - Runs a dev build, watches for and hotswaps changes
* _npm run test_ - Run unit tests (nothing yet)
* _npm run coverage_ - Run unit tests, generate coverage report (nothing yet)
* _npm run make-aws-archive_ - Builds `aws-archive.zip` from the current contents of `dist/`

## To Deploy to AWS
To deploy to AWS, as configured in `.elasticbeanstalk/config.yml`:
```sh
npm run make-aws-archive
eb deploy --label "label for new version"
```

## Miscellaneous
Non-Font-Awesome icons were grabbed from:

* http://www.clipartbest.com/free-printable-weather-symbols
