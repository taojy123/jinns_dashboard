export default function ({ route, store }) {
  let title = ''
  route.meta.map(meta => {
    meta.title && (title = meta.title)
  })
  store.commit('header/setTitle', title)
}
