
import { useState, useEffect } from 'react';
import axios from 'axios';
import Comment from './comment';
import './App.css';
import LoginForm from './login';
import userImage from './img/user.png';
import { API_BASE_URL, COMMENTS_ENDPOINT } from './api';

const Get_comments = () => {
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [userName, setUsername] = useState('');
  const [userId, setUserId] = useState(Number);
  //const [userImg, setUserImg] = useState();

  const commentsUrl = `${API_BASE_URL}:3400${COMMENTS_ENDPOINT}`;
  
  useEffect(() => {
    axios
      .get(`${commentsUrl}?parentId=0`)
      .then(response => {
        const sortedComments = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(sortedComments);
        const user = JSON.parse(localStorage.getItem('user'));
        const userid = user.id
        const username = user.username
        //const username = user.username
        setUserId (userid)
        setUsername (username)
        
        //console.log(userId)
      })
      .catch(error => console.log(error));
    }, [userId, userName]);

  

  const toAuthorization = () => {
    localStorage.removeItem('user');
    if (!localStorage.getItem('user')) {
      setIsLoggedIn(false);
    }
  };

  const handleCommentSend = () => {
    const newComment = {
      text: newCommentText,
      userId: userId,
      username: userName,
      userImg: userImage,
      parentId: 0,
      repliesCount: 0,
      createdAt: new Date()
    };
    if(newCommentText.length > 0) {
      axios
      .post(commentsUrl, newComment)
      .then(response => {
        const newCommentResponse = response.data;
        setComments(prevComments => {
          const updatedComments = [...prevComments, newCommentResponse];
          return updatedComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
        setNewCommentText('');
      })
      .catch(error => console.log(error));
    }else 
      return
    };

  const handleDelete = (commentId) => {
    axios
      .delete(`http://localhost:3400/comments/${commentId}`)
      .then(response => {
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      })
      .catch(error => console.log(error));
  };

  const cancelComment = () => {
    setNewCommentText('');
  };

  return (
    <>
      {!isLoggedIn && <LoginForm />}
      {isLoggedIn && (
        <>
          <header>
            <div className='header-container'>
              <div className='header-area'>
                <button className='log-out-btn' onClick={() => toAuthorization()}>Log out</button>
              </div>
            </div>
          </header>
          <div className='bottom-line'></div>
          <div className='container'>
            <div className='comment-wrapper'>
              <div className='comment-field'>
                <div className='profile-comment-content'>
                  <div className='userImg-content'>
                    <img src={userImage} alt="userImg"/>
                  </div>
                  <div className='text-field-content'>
                    <input
                      type='text'
                      placeholder='write comment'
                      className='root-comment-text'
                      value={newCommentText}
                      onChange={e => setNewCommentText(e.target.value)}
                      spellCheck='false'
                    />
                  </div>
                </div>
                <div className='btn-column'>
                  <button className='cancel' onClick={cancelComment}>
                    cancel
                  </button>
                  <button className='send' onClick={handleCommentSend}>
                    comment
                  </button>
                </div>
              </div>
              {comments.map(comment => (
                <Comment key={comment.id} username={userName} userid={userId} comment={comment} handleDelete={handleDelete} />
              ))}
            </div>
          </div>
        </>
      )
    }
  </>
  );
};

export default Get_comments;