import './Comment.css';

function Comment({content, date, author}){  
    return(
        <div className="comment-container"> 
            <div className="comment-top">
                <p className='comment-top-name'>{author}</p>
                <p className='comment-top-date'>{date}</p>
            </div>  
            <div className="comment-content">
                {content}
            </div>
        </div>
    )
};

export default Comment;