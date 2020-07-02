# labManager

An electron-vue application for managing a dental prosthetic laboratory.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This application uses a [sqlite package](https://github.com/JoshuaWise/better-sqlite3) that requires a native compilation. In Windows, this will require to have both Visual Studio C++ core features and Python installed in order to generate the application .exe file.

You can achive this installing manually both of them. In the case of Visual Studio, you can use Visual Studio 2015, 2017 or 2019. The community versions are valid for this project due to the licence type we're using. In addition to that, you have to ensure that VS have installed the "Visual Studio C++ core features". Once installed, configure node which VS version you want to use with the following command:

```
npm config set msvs_version 2019
```

You can have more details (and workarounds) [here](https://simulatedgreg.gitbooks.io/electron-vue/content/en/getting_started.html#a-note-for-windows-users) and [here](https://stackoverflow.com/questions/57879150/how-can-i-solve-error-gypgyp-errerr-find-vsfind-vs-msvs-version-not-set-from-c).

You can also install both prerequisites using [npm-windows-upgrade](https://github.com/felixrieseberg/npm-windows-upgrade), a npm package that will install unattended all the required C++ and Python infraestructure in your system to build the project and generate the .exe file.

Due to some memory management issues, you need to update your nodejs version to 12.18.1.

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
Give the example
```

And repeat


#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# build better-sqlite3 dependency
node_modules/.bin/electron-rebuild -f -w better-sqlite3

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

## Built With

- [node 12.18.1](nodejs.org)
- [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935)

## Authors

- **Angel Castro** - *Main contributor* - [AngelCastro](https://github.com/alcastrob/)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.