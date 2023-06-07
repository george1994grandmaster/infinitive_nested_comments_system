import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import { formatTimestamp } from './utils';
import './App.css';
import userImage from './img/user.png';
import { API_BASE_URL, COMMENTS_ENDPOINT } from './api';

const Comment = ({ username, userid, comment, depth = 0, handleDelete, btnCondition = false,}) => {
  const [comments, setComments] = useState([]);
  const [showReplies, setShowReplies] = useState(true);
  const [commentField, setCommentField] = useState(false);
  const [newReplyText, setNewReplyText] = useState('');
  const [authorizedUserId, setAuthorizedUserId] = useState(Number);
  const [isDefaultValue, setIsDefaultValue] = useState(true);
  const inputRef = useRef(null);

  const commentsUrl = `${API_BASE_URL}:3400${COMMENTS_ENDPOINT}`;

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [newReplyText]);

  useEffect(() => {
    const userStorage = JSON.parse(localStorage.getItem('user'));
    const userIdStorage = userStorage.id
    setAuthorizedUserId(userIdStorage)
  }, [authorizedUserId]);


  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setIsDefaultValue(inputValue === comment.username);
    setNewReplyText(inputValue);
  };

  const repliesExist = () => {
    if (comments.length === 0) {
      loadReplies();
      return 
    }
    setShowReplies(prevState => !prevState);
  };

  const loadReplies = () => {
    axios
      .get(`${commentsUrl}?parentId=${comment.id}`)
      .then(response => {
        const fetchedReplies = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setComments(fetchedReplies);
      })
      .catch(error => console.log(error));
    };

  const leaveReply = () => {
    setCommentField(true);
    setNewReplyText(comment.username);
  };

  const cancelReply = () => {
    setCommentField(false);
    setNewReplyText('');
    //console.log(authorizedUserId)
    //console.log(comment.userId)
  };

  const handleReplySend = () => {
    const newReply = {
      text: newReplyText,
      userId: userid,
      username: username,
      userImg: userImage,
      parentId: comment.id,
      repliesCount: 0,
      createdAt: new Date()
    };

    if(newReplyText.length > 0) {
      axios
      .post(commentsUrl, newReply)
      .then(response => {
        const newReplyResponse = response.data;
        setComments(prevReplies => {
          const updatedReplies = [...prevReplies, newReplyResponse];
          return updatedReplies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        });
        setCommentField(false);
        setNewReplyText('');
      })
      .catch(error => console.log(error));
    }else 
      return
   };

  const handleDeleteReply = (replyId) => {
    axios
      .delete(`${commentsUrl}/${replyId}`)
      .then(response => {
        setComments(prevReplies => prevReplies.filter(reply => reply.id !== replyId));
      })
      .catch(error => console.log(error));
  };

  const shouldApplyPadding = depth < 2;
  //const should = depth < 1;

  return (
<div className='comment-block' style={{ paddingLeft: shouldApplyPadding ? (window.innerWidth < 600 && depth === 1 ? '20px' : `${depth * 67}px`) : 0 }}>
      <div className='flexible-content'>
        <div className='userImg-content'>
          <img src={comment.userImg} alt="userImg"/>
        </div>
        <div className='user-info-container'>
          <div className='user-top-flexible'>
            <p className='username'>{comment.username}</p> 
            <em>
              <p className='created-at'>Posted on: {formatTimestamp(comment.createdAt)}</p>
            </em>
          </div>
          <p className='text'>{comment.text}</p>
          <div className='reply-remove-content'>
            <button className='reply' onClick={leaveReply}>
              reply
            </button>
            {comment.userId === authorizedUserId && <button className='remove' onClick={() => handleDelete(comment.id)}>
              delete
            </button>}
          </div>
          <div className={`comment-field ${commentField ? 'showFieldSection' : 'hideFieldSection'}`}>
            <div className='profile-comment-content'>
              <div className='userImg-content'>
                <img src={userImage} alt="userImg"/>
              </div>
              <div className='text-field-content'>
                <input
                  ref={inputRef}
                  type='text'
                  placeholder='write reply'
                  className={`default-value-input ${commentField ? 'animate default' : 'default'}`}
                  value={newReplyText}
                  onChange={handleInputChange}
                  spellCheck='false'
                  style={{
                    color: newReplyText === comment.username ? 'rgb(4, 119, 252)' : '#746f6f',
                    backgroundColor: newReplyText === comment.username ? 'transparent' : 'inherit',
                  }}
                />
              </div>
            </div>
            <div className='btn-column'>
              <button className='cancel' onClick={cancelReply}>
                cancel
              </button>
              <button className='send' onClick={handleReplySend}>
                reply
              </button>
            </div>
          </div>
        </div>
      </div>
      <section className='reply-content'>
        {comment.parentId >= 0 && (
          <div className='replie-btn-content'>
            <button className='replies-btn' onClick={repliesExist} /*style={{ paddingLeft: btnCondition === false ? 67 : 0 }}*/>
              replies
            </button>
          </div>
        )}
        {showReplies &&
        comments.map(reply => (
          <section key={reply.id}>
            <Comment comment={reply} username={username} userid={userid} depth={depth + 1} handleDelete={handleDeleteReply} btnCondition = {true} />
          </section>
        ))}
      </section>
    </div>
  );
};

export default Comment;