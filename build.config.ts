import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  externals: ['npm:uuid'],
  rollup: {
    emitCJS: false,
    esbuild: {
      minifySyntax: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minify: true,
      target: 'es2022',
    },
  },
})
