import * as esbuild from 'esbuild-wasm'
import axios from 'axios'
import localforage from 'localforage'



export const fetchPlugin = (inputCode: string) => {
  return {
    name: 'fetch-plugin',
    setup(build: esbuild.PluginBuild) {

      //for index.js imports
      build.onLoad({ filter: /(^index\.js$)/ }, async () => {


        return {
          loader: 'jsx',
          contents: inputCode
        }
      })

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        const cachedResult = await localforage.getItem<esbuild.OnLoadResult>(args.path)
        if (cachedResult) {
          return cachedResult
        }

      })


      //for css imports
      build.onLoad({ filter: /.css$/ }, async (args: any) => {

        const { data, request } = await axios.get(args.path)


        const escaped = data
          .replace(/\n/g, '')
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'")
        const contents =
          `
        const style = document.createElement('style');
        style.innerText = '${escaped}'
        document.head.appendChild(style)
        `

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: contents,
          resolveDir: new URL('./', request.responseURL).pathname
        };

        await localforage.setItem(args.path, result)
        return result
      })


      //for all the imports
      build.onLoad({ filter: /.*/ }, async (args: any) => {

        const { data, request } = await axios.get(args.path)

        const result: esbuild.OnLoadResult = {
          loader: 'jsx',
          contents: data,
          resolveDir: new URL('./', request.responseURL).pathname
        };

        await localforage.setItem(args.path, result)
        return result


      });
    }
  }
}