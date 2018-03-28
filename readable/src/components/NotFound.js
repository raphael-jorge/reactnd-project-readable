import React from 'react';
import FindIcon from 'react-icons/lib/md/find-in-page';
import Post from './Post';

/* Um componente para indicar que alguma página não foi encontrada */
export default function NotFound(props) {
  const notFoundData = {
    timestamp: Date.now(),
    author: 'Readable',
    title: '404: Not Found',
    body: 'We are sorry to post that we could not find the page you requested. =(',
  };

  return (
    <div>
      <div className="icon">
        <FindIcon size={75} />
      </div>

      <Post
        postData={notFoundData}
        readMode
      />

    </div>
  );
}
