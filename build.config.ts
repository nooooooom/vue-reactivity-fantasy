export default {
  entries: ['./src/index'],
  clean: true,
  declaration: true,
  externals: ['vue'],
  rollup: {
    emitCJS: true
  }
}
