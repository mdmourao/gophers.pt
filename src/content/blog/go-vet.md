---
title: Go toolchain - go vet
description: Vamos publicar alguns artigos sobre os comandos disponíveis no go. Começamos pelo go vet o comando de análise estática do Go.
date: 2026-10-29
authors:
  - name: mdmourao
    x: mdmourao
tags: [toolchain,go,vet]
---

# go vet

**go vet** Ferramenta de análise estática

> **Análise estática** 
>
> "A análise estática de código (SCA) é um método de verificação do código-fonte em busca de bugs, vulnerabilidades de segurança e código abaixo do ideal, sem executar o programa. Ela usa ferramentas automatizadas para varrer o código e realizar análises avançadas em tempo real."
>
> "Ao contrário da análise dinâmica de código, a análise estática de código acontece antes de o código ser executado."
>
> — [IBM, *O que é análise estática de código?*](https://www.ibm.com/br-pt/think/topics/static-code-analysis)

## Como usar

Na raiz do módulo (onde está o go.mod):

```go
go vet ./...
```

Para agentes pode ser mais interessante:

```go
go vet -json ./...
```

## Exemplos

Um programa com vários erros que o go vet apanha (o código completo está em [github.com/mdmourao/go-vet](https://github.com/mdmourao/go-vet)):

```go
type Counter struct {
	mu sync.Mutex
	n  int
}

func (c Counter) Inc() {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.n++
}

type User struct {
	Name  string `json:"name"`
	Email string `json:"name"`
}

func main() {
	nome := "Gophers"
	fmt.Printf("Olá %d\n", nome)

	ctx, _ := context.WithTimeout(context.Background(), time.Second)
	<-ctx.Done()

	resp, err := http.Get("https://gophers.pt")
	defer resp.Body.Close()
	if err != nil {
		panic(err)
	}

	_, err = os.Open("exemplo.txt")
	var pathErr *fs.PathError
	if errors.As(err, pathErr) {
		fmt.Println(pathErr.Path)
	}
}


```

```console
$ go vet
main.go:19:9: Inc passes lock by value: github.com/mdmourao/go-vet.Counter contains sync.Mutex

main.go:45:5: second argument to errors.As must be a non-nil pointer to either a type that implements error, or to any interface type

main.go:38:8: using resp before checking for errors

main.go:34:7: the cancel function returned by context.WithTimeout should be called, not discarded, to avoid a context leak

main.go:32:19: fmt.Printf format %d has arg nome of wrong type string

main.go:27:2: struct field Email repeats json tag "name" also at main.go:26
```

Erros apanhados:
- O método Inc() passa uma cópia de Counter e não o ponteiro e portanto o mutex não faz sentido
- Consegue validar erros de copy paste por exemplo nas tags na repetição de nomes
- Valida se os argumentos têm o tipo correto no printf
- Avisa quando a função cancel do context.WithTimeout é descartada, o que deixa o contexto por libertar (context leak)
- Verifica a ordem de uso vs validação do erro em respostas HTTP
- Consegue perceber que o segundo argumento tem de ser um ponteiro para a variável no errors.As

## Como configurar em CI/CD (GitHub Actions)

Para configurar numa github actions podemos criar a seguinte configuração:

```yaml
name: go vet

on:
  push:
  pull_request:

jobs:
  vet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-go@v5
        with:
          go-version-file: go.mod

      - name: Run go vet
        run: |
          set +e
          go vet ./... > vet.txt 2>&1
          status=$?
          cat vet.txt

          {
            echo "## go vet"
            if [ $status -eq 0 ]; then
              echo "no problems found"
            else
              echo '```'
              cat vet.txt
              echo '```'
            fi
          } >> "$GITHUB_STEP_SUMMARY"

          exit $status

```

Podes ver o resultado [nesta execução do workflow](https://github.com/mdmourao/go-vet/actions/runs/40925344190).

## Conclusão e casos de uso

É uma ferramenta útil para colocar em GitHub Actions para validar o nosso código. A maior parte dos IDEs como o VS Code já realiza estas validações e informa destes erros.