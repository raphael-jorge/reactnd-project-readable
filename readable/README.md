# A Aplicação Readable

Para instalar e iniciar a aplicação execute os seguintes comandos nesse diretório:

* `npm install`

* `npm start`

Antes de executar esses comandos, tenha certeza de que o servidor local, necessário para o correto funcionamento da aplicação, foi devidamente instalado e inicializado.

## Funcionalidades
* #### Exibição dos Posts

  A _homepage_ da aplicação (_localhost:3000_) exibe todos os posts armazenados no servidor. Cada post contém um _link_ para a sua página específica, de forma que mais informações sobre o post, e seus comentários, possam ser consultados.

* #### Exibição de Posts por Categoria

  Cada uma das categorias armazenadas no servidor conta com uma página dedicada (_localhost:3000/:category_). Nessa página são exibidos posts, assim como na _homepage_ da aplicação. Contudo, apenas os posts dessa categoria específica são exibidos.

* #### Exibição Detalhada e Comentários

  Cada post conta com uma página dedicada (_localhost:3000/:category/:postId_) para exibição detalhada de seu conteúdo, bem como de seus comentários.

* #### Adição de Posts

  As páginas de exibição de posts, seja a _homepage_ ou a página de uma categoria específica, contam com a funcionalidade de adição de um novo post.

* #### Adição de um Comentário

  Qualquer página de detalhe de um determinado post conta com a opção de adicionar um novo comentário à esse post.

* #### Operações de Edição/Remoção

  Qualquer post ou comentário exibido conta com a possibilidade de ser editado ou removido da aplicação. Essas funcionalidades ficam disponíveis em qualquer página da aplicação.

* #### Operações de Voto

  Posts e comentários contam com a possibilidade de receber votos, positivos ou negativos, do usuário. O número total de votos relativo a cada post ou comentário é exibido em conjunto com as outras informações de interesse.

* #### Opções de Exibição para Posts

  Qualquer página de exibição de posts, seja a _homepage_ ou a página de uma categoria específica, conta com um controle para determinar como os posts são exibidos. As funcionalidades desse controle são:

    * Ordenar os posts em função da data de criação ou do saldo de votos;

    * Filtrar os posts com base em algum termo de pesquisa. As opções de filtro disponíveis são autor e título.

* #### Carregamento

  A aplicação garante a exibição de ícones que indicam o carregamento ou processamento de dados para todas as operações disponíveis. Contudo, nem sempre esses ícones são exibidos. Uma vez que o servidor opera localmente, o tempo necessário para completar as operações é, geralmente, bastante curto. Por isso, os ícones de carregamento são exibidos apenas quando as operações tomam uma certa quantidade de tempo para serem processadas. Se quiser verificar essa funcionalidade experimente simular uma conexão lenta, configurando um _network throttling_.
