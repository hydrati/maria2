import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['index', 'transport'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
    esbuild: {
      minifySyntax: true,
      target: 'es2022',
    },
  },
})
