import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index', 'src/transport'],
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
