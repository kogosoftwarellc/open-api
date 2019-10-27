REM @ECHO OFF

SET mocha="%~dp0..\..\node_modules\.bin\mocha"

%mocha% -r source-map-support/register -r ts-node/register --recursive "%cd%/test/**/*.ts" %*
