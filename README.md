# An Electron React Example

This is an example of an Electron application using React bundled with [Webpack](https://webpack.js.org/). It is a part of my [blog post](https://stuckpointer.com/electron-and-react-part-3-a-project-template/) about using Electron with React.

The example aims to be as simple as possible, skipping the use of Webpack DLL and other speed optimisations. 
You might end up using these in your own application, however all might not, so I didn't want to make this example more complicated than it needs to be.

The example can be currently packaged for Linux and Windows. Windows builds are verified with Windows developer VMs provided by Microsoft. I don't own any Apple
products currently, so I can't verify the macOS builds. If you have a Mac and can verify the macOS builds, please feel free to create a pull request.

The example is not meant for production use, but rather as a starting point to understand how to use Electron with React. If you feel like it, however, you can use
the example as a basis for your own application and add missing "production" features, such as [DLLs](https://webpack.js.org/plugins/dll-plugin/), automatic updates, etc. yourself.

If you are looking for a more comprehensive (and a bit more involved) example with Typescript, I recommend checking out [electron-react-boilerplate](https://github.com/electron-react-boilerplate/electron-react-boilerplate).

## Running the example

Before you start, install the dependencies:

```bash
npm install
```

You can run the example in development mode with:

```bash
npm run dev
```
You can terminate the development mode with `Ctrl+C`. 

You can package the application into Linux AppImage with:

```bash
npm run package -- --linux
```

After packaging, the AppImage file should be available in the `release/build` directory.

To build a package for windows, run:

```bash
npm run package -- --win
```

After packaging, the setup exe file should be available in the `release/build` directory.

## White screen in the development mode
If you are running this example in development mode, and you see a white screen (nothing rendered), just select `View->Reload` in the example application menus (or press Ctrl+R). This
occurs because the Webpack dev server is not yet ready when the application is started. This is not an issue in production builds. 
Since this is a simple example, I have implemented a simple wait mechanism to wait for the Webpack dev server to start. Depending on the 
speed of your webpack build, the wait might not be long enough. If this is the case, you can increase the default wait time (2000ms) in the `package.json`'s sleep script.

```
"sleep": "node -e \"setTimeout(() => process.exit(0), 2000)\""
```
for example to wait 5 seconds, change the script to:

```
"sleep": "node -e \"setTimeout(() => process.exit(0), 5000)\""
```
