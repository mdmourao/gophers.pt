# Gophers Portugal

Site da comunidade de Go em Portugal: [gophers.pt](https://gophers.pt)

Feito com [Astro](https://astro.build) e deployed na [Cloudflare](https://www.cloudflare.com).

## Escrever um artigo

1. Faz fork do [repositório](https://github.com/mdmourao/gophers.pt) no GitHub e clona o teu fork.
2. Cria um ficheiro Markdown em [`src/content/blog/`](src/content/blog/). O nome do ficheiro define o URL do artigo. Por exemplo, `survey2026-announce.md` fica em `gophers.pt/blog/survey2026-announce/`.
3. Começa o ficheiro com o frontmatter:

   ```yaml
   ---
   title: Título do artigo
   description: Resumo curto, aparece na lista do blog e nos motores de busca
   date: 2026-10-23
   authors:
     - name: O teu nome
       x: o_teu_handle # opcional
   tags: [comunidade]
   ---
   ```

   Se não puseres `authors`, o artigo aparece como "Gophers Portugal".

4. Escreve o artigo em Markdown por baixo do frontmatter.
5. Corre `npm install` (só da primeira vez) e `npm run dev`, e abre `http://localhost:4321/blog/<nome-do-ficheiro>/` para ver como fica.
6. Quando estiver pronto, faz commit e push para o teu fork e abre um PR para este repositório.
