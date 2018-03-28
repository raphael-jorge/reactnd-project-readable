import uuid from 'uuid/v4';
import createSimpleId from './createSimpleId';

const api = 'http://localhost:3001';

let token = localStorage.token;
if (!token) {
  token = createSimpleId();
  localStorage.token = token;
}

const headers = {
  Authorization: token,
  Accept: 'application/json',
  'Content-Type': 'application/json',
};


/* Métodos para buscar dados no servidor. */
export const get = {
  /* Busca categorias no servidor. */
  categories: () =>
    fetch(`${api}/categories`, { headers })
      .then((res) => res.json()),

  /**
   * Busca posts no servidor.
   * @param {string} [category] Uma categoria específica de posts.
   */
  posts: (category) => {
    let path = '/posts';
    if (category) {
      path = `/${category}` + path;
    }
    return fetch(`${api}${path}`, { headers })
      .then((res) => res.json());
  },

  /**
   * Busca um post específico no servidor.
   * @param  {string} postId O id do post.
   */
  post: (postId) =>
    fetch(`${api}/posts/${postId}`, { headers })
      .then((res) => res.json()),

  /**
   * Busca comentários de um post específico no servidor.
   * @param  {string} postId O id do post.
   */
  postComments: (postId) =>
    fetch(`${api}/posts/${postId}/comments`, { headers })
      .then((res) => res.json()),

  /**
   * Busca um comentário específico no servidor.
   * @param  {string} commentId O id do comentário.
   */
  comment: (commentId) =>
    fetch(`${api}/comments/${commentId}`, { headers })
      .then((res) => res.json()),
};


/* Métodos para adicionar dados ao servidor. */
export const add = {
  /**
   * Adiciona um novo post no servidor.
   * @param {object} newPostBody Um objeto com as informações do novo post.
   * @param {string} newPostBody.title O título do post.
   * @param {string} newPostBody.body A mensagem do post.
   * @param {string} newPostBody.author O autor do post.
   * @param {string} newPostBody.category A categoria do post.
   */
  post: (newPostBody) => {
    newPostBody.id = uuid();
    newPostBody.timestamp = Date.now();
    return fetch(`${api}/posts`, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(newPostBody),
    }).then((res) => res.json());
  },

  /**
   * Adiciona um novo voto em um post específico.
   * @param {string} postId O id do post.
   * @param {number} vote Se vote>0 adiciona um voto se não diminui um voto.
   */
  voteOnPost: (postId, vote) => {
    const voteStr = vote > 0 ? 'upVote' : 'downVote';
    return fetch(`${api}/posts/${postId}`, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify({ option: voteStr }),
    }).then((res) => res.json());
  },

  /**
   * Cria um novo comentário, vinculado a um post, no servidor.
   * @param {string} postId O id do post a receber o comentário.
   * @param {object} newComment Um objeto com as informações do novo comentário.
   * @param {string} newComment.body A mensagem do comentário.
   * @param {string} newComment.author O autor do comentário.
   */
  comment: (postId, newComment) => {
    newComment.id = uuid();
    newComment.timestamp = Date.now();
    newComment.parentId = postId;
    return fetch(`${api}/comments`, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify(newComment),
    }).then((res) => res.json());
  },

  /**
   * Cria um novo voto em um comentário específico.
   * @param {string} commentId O id do comentário.
   * @param {number} vote Se vote>0 adiciona um voto se não diminui um voto.
   */
  voteOnComment: (commentId, vote) => {
    const voteStr = vote > 0 ? 'upVote' : 'downVote';
    return fetch(`${api}/comments/${commentId}`, {
      headers: { ...headers },
      method: 'POST',
      body: JSON.stringify({ option: voteStr }),
    }).then((res) => res.json());
  },
};


/* Métodos para atualizar dados no servidor. */
export const update = {
  /**
   * Atualiza um post no servidor.
   * @param {string} postId O id do post a ser atualizado.
   * @param {object} updatedData Um objeto com as informações do post atualizadas.
   * @param {string} updatedData.title O título atualizado do post.
   * @param {string} updatedData.body A mensagem atualizada do post.
   */
  post: (postId, updatedData) =>
    fetch(`${api}/posts/${postId}`, {
      headers: { ...headers },
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }).then((res) => res.json()),

  /**
   * Atualiza um comentário no servidor.
   * @param {string} commentId O id do comentário a ser atualizado.
   * @param {object} updatedData Um objeto com as informações do comentário atualizadas.
   * @param {string} updatedData.body A mensagem atualizada do comentário.
   */
  comment: (commentId, updatedData) => {
    updatedData.timestamp = Date.now();
    return fetch(`${api}/comments/${commentId}`, {
      headers: { ...headers },
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }).then((res) => res.json());
  },
};


/* Métodos para remover dados do servidor. */
export const remove = {
  /**
   * Remove um post específico do servidor.
   * @param {string} postId O id do post.
   */
  post: (postId) =>
    fetch(`${api}/posts/${postId}`, {
      headers: { ...headers },
      method: 'DELETE',
    }).then((res) => res.json()),

  /**
   * Remove um comentário específico do servidor.
   * @param {string} commentId O id do comentário.
   */
  comment: (commentId) =>
    fetch(`${api}/comments/${commentId}`, {
      headers: { ...headers },
      method: 'DELETE',
    }).then((res) => res.json()),
};
