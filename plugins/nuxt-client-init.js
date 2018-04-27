export default async (ctx) => {
  await ctx.store.dispatch('nuxtClientInit', ctx)
  await ctx.store.dispatch('auth/get_upload_token', ctx)
}
