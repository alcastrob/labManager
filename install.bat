@echo off
@echo Installation Prerrequisites:
@echo python 2.7.18
@echo Visual Studio 2019 Community
@echo nvm 1.1.0
@echo

nvm install 11.15.0
nvm use 11.15.0
npm install -g node-gyp@7.0.0

set path="C:\Program Files\Python27";%path%
node-gyp configure --msvs-version=2017
npm config set msvs_version 2017
npm config set msbuild_path "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\MSBuild\Current\Bin\MSBuild.exe"
node-gyp rebuild

npm i
npm i electron@7.2.4
npm i node-sass@4.14.1