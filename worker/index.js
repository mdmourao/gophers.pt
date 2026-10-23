// Redireciona www.gophers.pt para gophers.pt e serve o resto a partir dos assets estáticos
export default {
  fetch(request, env) {
    const url = new URL(request.url);
    if (url.hostname === 'www.gophers.pt') {
      url.hostname = 'gophers.pt';
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
