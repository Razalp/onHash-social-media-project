
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faComment, faFlag, faUserCircle } from '@fortawesome/free-solid-svg-icons'



const PostPage = () => {
    return (
       <div className="post-container">
   
         <img
           src="https://placekitten.com/600/400" 
           alt="Post"
           className="post-image"
         />
   
     
         <div className="post-icons">
           <FontAwesomeIcon icon={faHeart} className="icon" /> {/* Like icon */}
           <FontAwesomeIcon icon={faComment} className="icon" /> {/* Comment icon */}
           <FontAwesomeIcon icon={faFlag} className="icon" /> {/* Report icon */}
           <FontAwesomeIcon icon={faUserCircle} className="icon" /> {/* User icon */}
         </div>
       </div>
    );
   };
export default PostPage;
