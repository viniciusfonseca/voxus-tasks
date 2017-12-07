# Teste Voxus - Plataforma de Tasks

## Requisitos mínimos para fazer a build do projeto

Node >= 6.

## Tecnologias usadas

 - SQLite (camada de modelo)
 - Express + Redux (camada de negócios)
 - React + Redux (camada de apresentação)

 Esse projeto foi feito utilizando como base o código-fonte [deste repositório](https://github.com/cullenjett/react-ssr-boilerplate)

## Comandos para testar o código

```
git clone https://github.com/viniciusfonseca/voxus-tasks
cd voxus-tasks
npm install
npm run build
npm run start-prod
```

Com isso o servidor subirá na porta 3000.
Acesse em seu browser: `http://localhost:3000`

## Visão geral

Eu já trabalhei com um gerente de tarefas ([Runrun.it](https://runrun.it/)), conheço um pouco da regra de negócio como usuário, e portanto decidi ir um pouco além do que pedia o desafio e agrupei as tasks em filas (queues), pensando numa implementação em um ambiente corporativo e que é dividido em diversos departamentos. Assim o setor de produção cria uma fila, o financeiro cria outra fila, o RH possui outra fila, e por aí vai. O sistema deve ter pelo menos uma fila, que é a principal, e as tasks podem ser transferidas entre filas.

## Parte 1 - CRUD

Foi bem simples implementar essa parte, primeiro foram feitas as camadas de Model na pasta `server` para integrar com o banco SQLite, depois foram implementadas os endpoints REST no arquivo `server/api.js`. Depois, foi só fazer a interface com React, que requisita esses endpoints via AJAX. Essa tarefa demorou mais ou menos dez horas pois também englobou outras duas partes do desafio (3 e 4).

## Parte 2 - Google Login

Também não foi surpresa, no caso eu usei um componente em React (`react-google-login`) que implementa autenticação do Google em Web client. Depois da autenticação bem sucedida o token JWT é armazenado no cookie (pode não ser uma boa prática em questão de segurança, mesmo assim temos a criptografia do Google). Dessa forma utilizo apenas um middleware no Express para parsear o cookie e validá-lo. Essa parte demorou em torno de uma hora.

## Parte 3 - Tasks complexas

Esses atributos já haviam sido implementados no CRUD de Tasks.

## Parte 4 - Tasks Completas

Atributos também já implementados no CRUD de Tasks.

## Parte 5 - Suporte Robusto para Anexos e Busca

Demorou ao menos uma hora e meia.
