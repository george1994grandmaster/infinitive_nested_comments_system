const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3400;
const dataFilePath = 'data/comments.json';

// Middleware
app.use(express.json());
app.use(cors());

// Read comments data from JSON file
let data = { comments: [] };
fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
  if (!err) {
    try {
      data = JSON.parse(fileData);
    } catch (parseError) {
      console.error('Error parsing JSON file:', parseError);
    }
  }
});

// Save comments data to JSON file
const saveDataToFile = () => {
  fs.writeFile(dataFilePath, JSON.stringify(data), 'utf8', err => {
    if (err) {
      console.error('Error saving data to JSON file:', err);
    }
  });
};

// Controllers
const getComments = (parentId) => {
  return data.comments.filter(comment => comment.parentId === parentId);
};

const addComment = (newComment) => {
  const comment = {
    id: uuidv4(),
    ...newComment
  };
  data.comments.push(comment);
  saveDataToFile();
  return comment;
};

const deleteComment = (commentId) => {
  const deletedCommentIndex = data.comments.findIndex(comment => comment.id === commentId);
  if (deletedCommentIndex === -1) {
    return;
  }

  const deletedComment = data.comments[deletedCommentIndex];
  data.comments.splice(deletedCommentIndex, 1);
  saveDataToFile();

  // Recursively delete associated replies
  const deletedReplies = data.comments.filter(comment => comment.parentId === commentId);
  deletedReplies.forEach(reply => {
    deleteComment(reply.id);
  });

  // Update repliesCount of the parent comment
  if (deletedComment.parentId !== 0) {
    const parentComment = data.comments.find(comment => comment.id === deletedComment.parentId);
    if (parentComment) {
      parentComment.repliesCount--;
    }
    saveDataToFile();
  }
};
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});









/*const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3400;
const dataFilePath = 'data/db.json';

// Middleware
app.use(express.json());
app.use(cors());

// Read comments data from JSON file
let data = { comments: [] };
fs.readFile(dataFilePath, 'utf8', (err, fileData) => {
  if (!err) {
    try {
      data = JSON.parse(fileData);
    } catch (parseError) {
      console.error('Error parsing JSON file:', parseError);
    }
  }
});

// Save comments data to JSON file
const saveDataToFile = () => {
  fs.writeFile(dataFilePath, JSON.stringify(data), 'utf8', err => {
    if (err) {
      console.error('Error saving data to JSON file:', err);
    }
  });
};

// Controllers
const getComments = (parentId) => {
  return data.comments.filter(comment => comment.parentId === parentId);
};

const addComment = (newComment) => {
  const comment = {
    id: uuidv4(),
    ...newComment
  };
  data.comments.push(comment);
  saveDataToFile();
  return comment;
};

const deleteComment = (commentId) => {
  const deletedCommentIndex = data.comments.findIndex(comment => comment.id === commentId);
  if (deletedCommentIndex === -1) {
    return;
  }

  const deletedComment = data.comments[deletedCommentIndex];
  data.comments.splice(deletedCommentIndex, 1);
  saveDataToFile();

  // Recursively delete associated replies
  const deletedReplies = data.comments.filter(comment => comment.parentId === commentId);
  deletedReplies.forEach(reply => {
    deleteComment(reply.id);
  });

  // Update repliesCount of the parent comment
  if (deletedComment.parentId !== 0) {
    const parentComment = data.comments.find(comment => comment.id === deletedComment.parentId);
    if (parentComment) {
      parentComment.repliesCount--;
      saveDataToFile(); // Update the parent comment in the JSON file
    }
  }
};

// Routes
app.get('/comments', (req, res) => {
  const parentId = parseInt(req.query.parentId);
  const comments = getComments(parentId);
  res.json(comments);
});

app.post('/comments', (req, res) => {
  const newComment = req.body;
  const comment = addComment(newComment);
  res.json(comment);
});

app.delete('/comments/:commentId', (req, res) => {
  const commentId = req.params.commentId;
  deleteComment(commentId);
  res.sendStatus(204);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});*/