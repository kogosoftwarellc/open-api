@ECHO OFF

SET nyc="%~dp0..\..\node_modules\.bin\nyc"
SET mocha="%~dp0cust_mocha"

%nyc% --extension=.ts -r lcov -r text-summary -r json -r html --instrument %mocha%
