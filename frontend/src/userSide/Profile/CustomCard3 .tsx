import React from 'react'
import './CustomCard3.css'
const CustomCard3  = ({userPost ,userData ,ope}) => {
  return (
    <div className="card">
  <div className="first-content">
  {userPost.map((post:any) => (
            <div key={post._id} className="boxer">
              {post.image.length > 0 && (
                <div onClick={() => openModals(post, userData)}>
                  <img
                    src={`http://localhost:3000/upload/${post?.image}`}
                    alt="Post"
                    className="post-image shadow-md"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                  />
                </div>
              )}
            </div>
          ))}
  </div>
 

</div>
  )
}

export default CustomCard3 
