import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
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
