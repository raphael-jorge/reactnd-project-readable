/** @module PostsAPI */
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


/**
 * @description Métodos para buscar dados no servidor.
 * @namespace get
 */
export const get = {
  /**
   * @description Busca categorias no servidor.
   * @return {Promise} Retorna uma array com as categorias obtidas quando resolvida.
   */
  categories: () =>
    fetch(`${api}/categories`, { headers })
      .then((res) => res.json()),

  /**
   * @description Busca posts no servidor.
   * @param {string} [category] Uma categoria específica de posts.
   * @return {Promise} Retorna uma array com os posts obtidos quando resolvida.
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
   * @description Busca um post específico no servidor.
   * @param  {string} postId O id do post.
   * @return {Promise} Retorna o objeto post obtido quando resolvida.
   */
  post: (postId) =>
    fetch(`${api}/posts/${postId}`, { headers })
      .then((res) => res.json()),

  /**
   * @description Busca comentários de um post específico no servidor.
   * @param  {string} postId O id do post.
   * @return {Promise} Retorna uma array com os comentários obtidos.
   */
  postComments: (postId) =>
    fetch(`${api}/posts/${postId}/comments`, { headers })
      .then((res) => res.json()),

  /**
   * @description Busca um comentário específico no servidor.
   * @param  {string} commentId O id do comentário.
   * @return {Promise} Retorna o objeto comentário obtido quando resolvida.
   */
  comment: (commentId) =>
    fetch(`${api}/comments/${commentId}`, { headers })
      .then((res) => res.json()),
};


/**
 * @description Métodos para criar dados no servidor.
 * @namespace add
 */
export const add = {
  /**
   * @description Cria um novo post no servidor.
   * @param {object} newPostBody Um objeto com as informações do novo post.
   * @param {string} newPostBody.title O título do post.
   * @param {string} newPostBody.body A mensagem do post.
   * @param {string} newPostBody.author O autor do post.
   * @param {string} newPostBody.category A categoria do post.
   * @return {Promise} Retorna o objeto post criado no servidor quando resolvida.
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
   * @description Cria um novo voto em um post específico.
   * @param {string} postId O id do post.
   * @param {number} vote Se vote>0 adiciona um voto se não diminui um voto.
   * @return {Promise} Retorna o objeto post atualizado quando resolvida.
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
   * @description Cria um novo comentário vinculado a um post no servidor.
   * @param {string} postId O id do post a receber o comentário.
   * @param {object} newComment Um objeto com as informações do novo comentário.
   * @param {string} newComment.body A mensagem do comentário.
   * @param {string} newComment.author O autor do comentário.
   * @return {Promise} Retorna o objeto comentário criado no servidor quando resolvida.
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
   * @description Cria um novo voto em um comentário específico.
   * @param {string} commentId O id do comentário.
   * @param {number} vote Se vote>0 adiciona um voto se não diminui um voto.
   * @return {Promise} Retorna o objeto comentário atualizado quando resolvida.
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


/**
 * @description Métodos para atualizar dados no servidor.
 * @namespace update
 */
export const update = {
  /**
   * @description Atualiza um post no servidor.
   * @param {string} postId O id do post a ser atualizado.
   * @param {object} updatedData Um objeto com as informações do post atualizadas.
   * @param {string} updatedData.title O título atualizado do post.
   * @param {string} updatedData.body A mensagem atualizada do post.
   * @return {Promise} Retorna o objeto post atualizado quando resolvida.
   */
  post: (postId, updatedData) =>
    fetch(`${api}/posts/${postId}`, {
      headers: { ...headers },
      method: 'PUT',
      body: JSON.stringify(updatedData),
    }).then((res) => res.json()),

  /**
   * @description Atualiza um comentário no servidor.
   * @param {string} commentId O id do comentário a ser atualizado.
   * @param {object} updatedData Um objeto com as informações do comentário atualizadas.
   * @param {string} updatedData.body A mensagem atualizada do comentário.
   * @return {Promise} Retorna o objeto comentário atualizado quando resolvida.
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


/**
 * @description Métodos para apagar dados do servidor.
 * @namespace remove
 */
export const remove = {
  /**
   * @description Apaga um post específico do servidor.
   * @param {string} postId O id do post.
   * @return {Promise} Retorna o objeto post atualizado quando resolvida.
   */
  post: (postId) =>
    fetch(`${api}/posts/${postId}`, {
      headers: { ...headers },
      method: 'DELETE',
    }).then((res) => res.json()),

  /**
   * @description Apaga um comentário específico do servidor.
   * @param {string} commentId O id do comentário.
   * @return {Promise} Retorna o objeto comentário atualizado quando resolvida.
   */
  comment: (commentId) =>
    fetch(`${api}/comments/${commentId}`, {
      headers: { ...headers },
      method: 'DELETE',
    }).then((res) => res.json()),
};
