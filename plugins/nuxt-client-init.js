export default async (ctx) => {
  await ctx.store.dispatch('nuxtClientInit', ctx)
  try {
    const res_qiniu = await ctx.store.dispatch('auth/get_upload_token', ctx)
    const expires = res_qiniu.data.expires_in
    setInterval(() => {
      ctx.store.dispatch('auth/get_upload_token', ctx)
    }, expires * 1000)
  } catch(e) {
    console.log(e)
  }
}
