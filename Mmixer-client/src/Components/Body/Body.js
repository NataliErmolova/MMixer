import './Body.css';
import Post from '../Post/Post';
import { useEffect, useState } from 'react';
import handlePost from '../../API/Post/handlePost';
import getPosts from '../../API/Post/getPosts';
import updatePost from '../../API/Post/updatePost';

function Body({ posts, setPosts }){
    const [postContent, setPostContent] = useState('');
    const [newPostContent, setNewPostContent] = useState('')
    const [editingPostId, setEditingPostId] = useState(null);
    const [postId, setPostId] = useState();
    
    useEffect(() => {
        async function fetchData(){
            const loadPosts = await getPosts();
            setPosts(loadPosts);
        }

        fetchData();
    }, [])

    const deletePostFromList = (postId) => {
        setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
    };
        
    async function PostTextarea() { 
        if (!postContent.trim()) return;
        
        const result = await handlePost(postContent);
    

        if (!result || !result.response || !result.author) {
            console.error("Invalid result from handlePost:", result);
            return;
        }

        const postInsert = {
            id: result.id, 
            content: postContent,
            date: result.date   ,
            author: result.author,
        };

        setPostId(result.id);

        if (result && result.response) {
            setPosts([postInsert, ...posts]);   
            setPostContent('');
        }
    }

    async function editPost(postId)  {
        if (!newPostContent.trim()) return;

        const result = await updatePost(postId, newPostContent);
        console.log(result);
        if(result) {
            setPosts(prev => prev.map(post => post.id === postId ? {...post, content:newPostContent} : post))
            console.log("Calling updatePost with:", postId, newPostContent);
        }
        setNewPostContent('');
        setEditingPostId(null);
    }

    function startEditing(postId, currentContent) {
        console.log("Editing post:", postId, "with content:", currentContent);
        setEditingPostId(postId);
        setNewPostContent(currentContent);
        console.log("Calling updatePost with:", postId, "new content:", newPostContent);
    }

    function handleKeyPress(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          PostTextarea();
        }
      }
      
    return(
    <div className='body'>
        <div className='post-input-container'>
            <textarea className='post-input-textarea' onChange={(e) => setPostContent(e.target.value)}
            value={postContent} 
            onKeyPress = {handleKeyPress}
            placeholder='Write what you think!'></textarea> 
            <div className='add-post-button-container'>
                <button type="button" onClick={() => PostTextarea()} className="btn btn-outline-primary postbtn">Post!</button>
            </div>
        </div>
        <div className='posts-container'>
        {posts && posts.map((post, index) => (
                <div key={index}>
                    {editingPostId === post.id ? (
                        <div className='post-edit-container'>
                            <textarea
                                className="post-edit-textarea"
                                value={newPostContent}
                                onChange={(e) => setNewPostContent(e.target.value)}
                            />
                            <div className="edit-post-button-container">
                                <button
                                    type="button"
                                    onClick={() => editPost(post.id)}
                                    className="btn btn-outline-primary postbtn"
                                >Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingPostId(null)}
                                    className="btn btn-outline-secondary postbtn ms-2"
                                >Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <Post 
                            post_id={post.id} 
                            author={post.author} 
                            content={post.content} 
                            date={post.date} 
                            onDelete={deletePostFromList} 
                            onEdit={() => startEditing(post.id, post.content)} 
                        />
                    )}
                </div>
            ))}
        </div>
    
    </div>
    );
}

export default Body;