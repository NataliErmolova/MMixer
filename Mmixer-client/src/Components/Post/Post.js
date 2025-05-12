    import './Post.css';
    import Comment from '../Comment/Comment';
    import { useEffect, useState } from 'react';
    import handleComments from '../../API/Comment/handleComments';
    import getComments from '../../API/Comment/getComments';
    import checkAccess from '../../API/Post/checkAccess';
    import deletePost from '../../API/Post/deletePost';


    function Post({key, post_id, author, content, date, onDelete, onEdit}) { 
        const [readMoreVisibility, setReadMoreVisibility] = useState();
        const [contentParsed, setContentParsed] = useState();
        const [commentContent, setCommentContent] = useState();
        const [isLoading, setIsLoading] = useState(false);
        const [comments, setComments] = useState([]);
        const [userAccess, setUserAccess] = useState(false);
        const [editVisible, setEditVisible] = useState(false)


        function toggleMenu() {
            setEditVisible(prev => !prev);
        }

        const[actionTaken, setActionTaken] = useState({
            like: false,
            comment: false,
            share: false,
        });

        useEffect(() => {
            setContentParsed(content.substring(0, 240));
            setReadMoreVisibility(content.length >= 240);
        }, [content]);

        function readMore(){
            setContentParsed(content);
            setReadMoreVisibility(false);
        }
        function readLess() {
            setContentParsed(content.substring(0, 240));
            setReadMoreVisibility(true);
        }

        function takeAction(type) {
            setActionTaken(prev => ({
            ...prev,
            [type]: !prev[type]
            }));
        }

        useEffect(() => {
            async function fetchData(){
                setIsLoading(true);
                try {
                    const loadedComments = await getComments(post_id);
                    setComments(loadedComments);
                } catch (error) {
                    console.error("Error loading comments:", error);
                } finally {
                    setIsLoading(false);
                }
        
            }
            fetchData();
        }, [ post_id]);
        
        async function handleDeletePost(){

            const response = await deletePost(post_id);
           if (response && response.message === "Post deleted successfully") {
                document.getElementById(`post-${post_id}`)?.remove();
                onDelete(post_id);
                setEditVisible(false)
            } else {
                alert("Failed to delete post.");
            }
        }
        
        
        async function postComment(){
            
            const response = await handleComments(post_id, commentContent);

            console.log("Response from backend:", response);
            
            if (response && response.message === 'Comment added successfully') {
                const commentInsert = {
                    content: commentContent,
                    date: new Date().toLocaleString(),
                    author: response.author,
                    postIndex: post_id,
                };

                console.log(commentInsert.date)
                
                if (!commentInsert.content.trim()) return;

                setComments(prev => [commentInsert, ...prev]);
                setCommentContent('');
            } else {
                console.log("Failed to post comment");
            } 
        } 

        useEffect(() => {
            async function fetchAccess(){
                try {
                    const checkUserAccess = await checkAccess(post_id);
                    
                    if (checkUserAccess && checkUserAccess.message === 'Access to manage post granted') {
                        setUserAccess(true);
                    } else {
                        setUserAccess(false);
                    }

                } catch (error) {
                    console.error("Error loading user access:", error);
                } 
            }

            fetchAccess()
        }, [post_id])

        function handleEdit() {
            if (onEdit) {
                onEdit();
                setEditVisible(false);
            }
        }

        function handleKeyPress(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            postComment();
            }
        }




        return (
            <div className={readMoreVisibility ? "post-container" : "post-container readmore"}>
                <div className="post-top">
                    <p className='post-top-name'>{author}</p>
                    <p className='post-top-date'>{date}</p>
                    {userAccess && (
                        <div className="post-menu-wrapper">
                            <button className="post-menu-button" onClick={toggleMenu}>
                                <i className="bi bi-three-dots"></i>
                            </button>
                            {editVisible && (
                                <div className="post-menu-dropdown">
                                    <p onClick={handleEdit}><i className="bi bi-pencil"></i> Edit</p>
                                    <p onClick={handleDeletePost}><i className="bi bi-trash3"></i> Delete</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>  
                <div className="post-content">
                    {contentParsed}
                </div>

                
                <div className='readmore-container'>
                    {readMoreVisibility ? 
                        <p onClick = {() => readMore() }>Read More</p> :
                        content.length >= 240 && 
                        <p onClick = {() => readLess() }>Read Less</p>
                    }
                </div>
                <div className='post-actions'>
                    <button onClick={() => takeAction('like')}
                    className={actionTaken.like ? "post-action-button post-like" : "post-action-button"}><i className={actionTaken.like ? "bi bi-heart-fill" : " bi bi-heart"}></i>Like</button>             
                    <button
                        onClick={() => takeAction('comment')}
                        className={actionTaken.comment ? "post-action-button post-comment" : "post-action-button"}>
                        <i className={actionTaken.comment ? "bi bi-chat-fill" : "bi bi-chat"}></i>Comment
                    </button>
                    <button onClick={() => takeAction('share')}
                    className={actionTaken.share ? "post-action-button post-share" : "post-action-button"}><i className= {actionTaken.share ? "bi bi-arrow-up-left-circle-fill" : "bi bi-arrow-up-left-circle"}></i>Share</button>
                </div>
                    <div className={actionTaken.comment ? 'comment-block show' : 'comment-block'}>
                        <input type='text' placeholder='Comment your thoughts!'
                        value={commentContent}
                        onKeyPress={handleKeyPress}
                        onChange={(e) => setCommentContent(e.target.value)} />
                    </div>
                    <div>
                        {comments !== null && comments.map((comment, index) => {
                            return (
                                <div new>
                                    <Comment content={comment.content} date={comment.date} author={comment.author} />
                                </div>
                            )
                        })}
                    </div>
            </div>
        )
    }

    export default Post;