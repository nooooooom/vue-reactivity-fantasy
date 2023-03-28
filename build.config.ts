export default {
  entries: ['./src/index'],
  clean: true,
  declaration: true,
  externals: ['vue', 'vue-module-demi'],
  rollup: {
    emitCJS: true
  }
}
