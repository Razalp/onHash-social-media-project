import React, { useState } from 'react';
import { Modal } from 'react-bootstrap'; // Assuming you're using react-bootstrap for the Modal component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faComment, faFlag } from '@fortawesome/free-solid-svg-icons';

const PostComponent = ({postLikes,selectedPost, closeModals, handleLike, handleComments, handleReportWithConfirmation, handleDeletePost, opensLikes, handleComment, commentData }) => {
  const [commentText, setCommentText] = useState('');
  const [showCommentBox, setShowCommentBox] = useState(false);

  return (

      <Modal show={true} onHide={closeModals} centered style={{ opacity: '20', maxHeight: '100vh' }}>
        <div className="bg-black">
          <Modal.Header closeButton>
            <Modal.Title>
              <div className="flex items-center space-x-4">
                <img
                  src={`http://localhost:3000/upload/${selectedPost.user.profilePicture}`}
                  alt="Profile Picture"
                  className="w-12 h-12 rounded-full mr-2"
                />
                <h1 className="text-white">{selectedPost.user.username}</h1>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img
              src={`http://localhost:3000/upload/${selectedPost.post.image}`}
              alt="Post"
              className="post-image w-full "
              style={{ objectFit: 'cover', width: '656px', height: '500px' }}
            />
          </Modal.Body>
          <button onClick={opensLikes} className="text-white ml-6 text-xs">
            Likes
          </button>
          <div className="post-icons flex justify-between">
            <div className="flex items-center space-x-3 relative left-6">
              <button
                onClick={() => handleLike(selectedPost.post._id)}
                className="like-button"
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  className={`icon-button ${postLikes[selectedPost.post._id] ? 'text-red-600' : 'text-white'}`}
                  style={{ fontSize: '26px' }}
                />
              </button>
              <FontAwesomeIcon
                onClick={handleComments}
                icon={faComment}
                className="icon text-white"
                style={{ fontSize: '26px' }}
              />
            </div>
            <div className="flex items-center space-x-3 relative right-6">
              <FontAwesomeIcon
                onClick={handleReportWithConfirmation}
                icon={faFlag}
                className="icon text-white"
                style={{ fontSize: '26px' }}
              />
            </div>
            <button onClick={handleDeletePost} className="text-red-600">Delete</button>
          </div>
          <br />
          <div className="flex justify-between">
            <h1 className="text-white ml-6">{selectedPost.post.caption}</h1>
            <h1 className="text-white mr-6">
              {new Date(selectedPost.post.createdAt).toLocaleTimeString()}
            </h1>
          </div>
          {showCommentBox && (
            <div>
              <form onClick={handleComment}>
                <input
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-1/2 p-2 mt-2 rounded-md border border-gray-300"
                />
                <button type="submit" className="ml-1 w-1">
                  ↩️
                </button>
              </form>
              <div className="comments-container">
                <h3 className="text-white mt-4">Comments:</h3>
                <br />
                <ul className="list-none p-0">
                  {commentData.map((comment, index) => (
                    <li key={index} className="text-white space-y-4">
                      <div className="flex justify-between ">
                        <div className="flex">
                          <img
                            src={`http://localhost:3000/upload/${comment?.user?.profilePicture}`}
                            alt="User Profile"
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span>{comment?.user?.username}</span>
                        </div>
                        <p>{comment?.text}</p>
                        <p className="text-gray-500">
                          {comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <br />
        </div>
      </Modal>
  
  );
};

export default PostComponent;
