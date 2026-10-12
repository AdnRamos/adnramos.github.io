# adnramos.github.io

Portfólio pessoal de **Adenilson Ramos** — graduando em Ciência da Computação (UFAPE), desenvolvedor full-stack.

🔗 https://adnramos.github.io

## Como funciona

HTML, CSS e JavaScript puros, sem build. Tema claro/escuro e PT/EN.

Os projetos vêm de dois arquivos:

| Arquivo | O que é | Quem atualiza |
|---|---|---|
| `data/repos.json` | Dados públicos do GitHub (descrição, estrelas, última atualização) | GitHub Action diário (`.github/workflows/sync-github.yml`) |
| `data/projects.json` | Projetos em destaque (textos PT/EN, projetos privados) e lista `exclude` | Manual, só quando quiser mudar um destaque |

- Repositório público **novo** com descrição aparece sozinho em "Mais no GitHub".
- Para esconder um repositório da lista automática, adicione o nome em `exclude`.
- Para rodar a sincronização na hora: aba **Actions → Sync GitHub data → Run workflow**.

## Rodando localmente

```bash
python -m http.server 8000
```

Abra http://localhost:8000 (o site usa `fetch`, então não funciona abrindo o arquivo direto).
