# Projeto Readable

Projeto final do curso **React e Redux** do [Udacity](https://br.udacity.com/).

## Introdução

Uma _single page application_, criada com [React](https://reactjs.org/), [Redux](https://redux.js.org/) e [React Router](https://reacttraining.com/react-router/), que interage com um servidor local para exibir e manipular posts e comentários.

Nessa aplicação, os usuários podem criar posts em categorias previamente definidas, adicionar comentários em qualquer um dos posts existentes e realizar operações de edição e remoção, tanto de posts como de comentários. Além disso, cada post ou comentário conta com a possibilidade de receber votos, positivos ou negativos.

O objetivo do projeto foi criar o _frontend_ da aplicação. Para isso, foi necessário estruturar e configurar a Redux _store_, desenvolver os componentes necessários em React, para gerar a interface especificada, e garantir a conexão entre esses elementos para que a aplicação operasse da maneira especificada.

O servidor _backend_, para armazenamento dos dados necessários, foi previamente fornecido e funciona de forma local.

## Instalação e Inicialização

Para realizar a instalação das dependências do projeto é necessário ter o [Node](https://nodejs.org/en/) instalado em uma versão superior à versão 6.

Primeiramente, clone o projeto com o [git](https://git-scm.com/).

`git clone https://github.com/raphael-jorge/reactnd-project-readable.git`

O projeto encontra-se dividido em duas partes: o servidor local e a aplicação em si.

  * ##### Servidor Local
    * Abra um terminal na raiz do projeto e navegue até a pasta do servidor:

      `cd api-server`

    * Instale as dependências necessárias:

      `npm install`

    * Inicialize o servidor local:

      `node server`

  * ##### A Aplicação Readable
    * Abra um novo terminal na raiz do projeto e navegue até a pasta da aplicação:

      `cd readable`

    * Instale as dependências necessárias:

      `npm install`

    * Inicialize a aplicação:

      `npm start`

    * Uma nova janela será aberta automaticamente no seu _browser_ após a inicialização da aplicação. Caso isso não ocorra, você pode acessa-la digitando a seguinte instrução na barra de endereços do seu browser:

      `localhost:3000`

## Servidor Local

Informações específicas sobre o servidor local fornecido e instruções referentes à sua utilização podem ser encontradas em seu [README](api-server/README.md) específico (em inglês).

## A Aplicação Readable

Informações específicas sobre o _frontend_ desenvolvido para a aplicação podem ser encontradas em seu [README](readable/README.md) específico.
