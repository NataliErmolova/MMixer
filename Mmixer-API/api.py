from flask import Flask, request, json, session,jsonify
from flask_cors import CORS
import psycopg2
import os
from ytmusicapi import YTMusic
from datetime import datetime

#region Configuration

app = Flask(__name__)

app.secret_key = os.urandom(24) 

CORS(app, origins=['http://127.0.0.1:3000', 'http://localhost:3000'], supports_credentials=True)

with open("config.json") as data:
    jsonData = json.load(data)
    ytConfig = jsonData["YT"]

app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = False

def get_connection():
    return psycopg2.connect(
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        host=os.getenv("DB_HOST"),
        port=int(os.getenv("DB_PORT"))
    )

#endregion


#region Application Endpoints

@app.route('/register', methods=['POST'])
def register():
    conn = None
    cursor = None
    try:
        json = request.get_json()

        username = json.get('username')
        email = json.get('email')
        password = json.get('password')

        print(username, email, password)

        conn = get_connection()
        cursor = conn.cursor()

        query = 'SELECT * FROM public.register(%s, %s, %s)'

        cursor.execute(query, (username, email, password))

        response = cursor.fetchone()

        id = response[0]

        session['user_id'] = id

        conn.commit()

        return {'response': id}, 200
    except Exception as e:
        if conn:
            conn.rollback()
        return {"Error": str(e)}, 500
    finally:
        if conn:
            conn.close()
        if cursor:
            cursor.close()


@app.route('/login', methods=['POST'])
def login():
    conn = None
    cursor = None
    try:
        json = request.get_json()

        email = json.get('email')
        password = json.get('password')

        conn = get_connection()
        cursor = conn.cursor()

        cursor.callproc('login', [ email, password])
        response = cursor.fetchone()

        if response:
            user_id, username_returned, email_returned = response
            session['user_id'] = user_id   # SAVE user id in session
            conn.commit()
            return jsonify({
                'user_id': user_id,
                'username': username_returned,
                'email': email_returned, 
                'message': 'Login successful!'}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 400
        

    except Exception as e:
        if conn:
            conn.rollback()
            return {"Error": str(e)}, 500
    finally:
        if conn:
            conn.close()
        if cursor:
            cursor.close()

@app.route('/current_user_page',methods = ['GET'])
def current_user_page():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'error' : 'user not logged in'}), 400
    

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, username, email FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if user:
            return jsonify({'id' : user[0], 'username': user[1], 'email': user[2]})
        else: 
            return jsonify ({'error': 'User not found'}), 404
    finally:
        cursor.close()
        conn.close()


@app.route('/log_out', methods = ['POST'])
def log_out():
    session.pop('user_id', None)
    return jsonify({'message' : 'Logged out successfully'}), 200


@app.route('/add_post', methods = ['POST'])
def add_post():

    conn = None
    cursor = None
    try:
        json = request.get_json()
        user_id = session.get('user_id')

        if not user_id:
            return {'error': 'Not logged in'}, 401

        post_content = json.get('post_content')
        print(post_content)

        conn = get_connection()
        cursor = conn.cursor()
        

        cursor.callproc('add_post', [user_id, post_content])
        response = cursor.fetchone()
        if response:
            id = response[0]    
            username = response[1]
        else:
            print("Post procedure did not return any data.")

        conn.commit()   

        print("Procedure result:", response)
        return {
        'response': id,
        'author': username}, 200
    except Exception as e:
        print("Error during /add_post:", str(e))

        if conn:
            conn.rollback()
        return {"Error": str(e)}, 500
    finally:
        if conn:
            conn.close()
        if cursor:
            cursor.close()

@app.route('/get_posts', methods = ['GET'])
def get_posts():

    conn = None
    cursor = None

    try:
        # json = request.get_json()
        user_id = session.get('user_id')

        conn = get_connection()
        cursor = conn.cursor()

        if not user_id:
            return {'error': 'Not logged in'}, 401

        cursor.execute('''
            SELECT posts.id, posts.content, posts.date, users.username
            FROM posts
            LEFT JOIN users ON posts.user_id = users.id
            ORDER BY posts.date DESC
        ''')


        results = cursor.fetchall()
        posts = [{
            'id': row[0],
            'content': row[1],
            'date': row[2].strftime("%Y-%m-%d %H:%M:%S"),
            'author': row[3]
        } for row in results]

        return jsonify(posts), 200
    except Exception as e:
        print("Error in /get_posts:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
        if cursor:
            cursor.close()

@app.route('/delete_post', methods = ['DELETE'])
def delete_post():

    user_id = session.get('user_id')

    conn = get_connection()
    cursor = conn.cursor()
    post_id = request.args.get('post_id')

    try:
        cursor.execute("SELECT user_id FROM posts WHERE id=%s", (post_id,))
        result = cursor.fetchone()

        if not result:
            return jsonify({'error': 'Post not found'}), 404
        
        post_owner_id = result[0]
        if post_owner_id != user_id:
            return jsonify({'error': 'You dont have access to edit/delete this post'})
        
        cursor.execute("DELETE FROM posts WHERE id = %s", (post_id,))
        conn.commit()

        return jsonify({'message' : 'Post deleted successfully'}), 200
    

    except Exception as e:
        print(f"Error deleting post: {e}")
        return jsonify({'error': 'Internal server error'}), 500

    finally:
        cursor.close()
        conn.close()  

    
@app.route('/edit_post', methods = ['PUT'])
def edit_post():
    json = request.get_json()
    post_id = request.args.get('post_id')
    updated_content = json.get('updated_content')

    print("post_id", post_id)
    print("updated_content", updated_content)
    
    try:
        if not updated_content or not post_id:
            return jsonify({
                'message' : 'Post_id or content isnt found'
            }) , 400

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("UPDATE posts SET content=%s WHERE id=%s RETURNING id", (updated_content,post_id))
        update = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()

        if update:
            return jsonify({'message': 'Post updated successfully', 'id': update[0]}), 200
        else:
            return jsonify({'message': 'Post not found'}), 404

    except Exception as e:
        print("Error updating post:", e)
        return jsonify({'message': 'Internal server error'}), 500



@app.route('/check_user_access', methods = ['GET'])
def check_user_access():
    user_id = session.get('user_id')
    post_id = request.args.get('post_id')

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT user_id FROM posts WHERE id=%s", (post_id,))
        result = cursor.fetchone()
        
        if(int(result[0]) == int(user_id)):
            return jsonify({'message' : 'Access to manage post granted'}), 200 
        else: 
            return jsonify({'message' : 'User Does not have permission to Manage'}), 200 

    except Exception as e:
        return jsonify({'error': 'Internal server error'}), 500

    finally:
        cursor.close()
        conn.close()  


@app.route('/get_user_data', methods = ['GET'])
def get_user_data():

    conn = None
    cursor = None

    try:
        
        user_id = session.get('user_id')

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT users.email, users.username
            FROM users
            WHERE users.id = %s
        ''', (user_id,))

        result = cursor.fetchone()

        if result:
            email, username = result
            user_data = {
                'email': email,
                'username': username
            }
            return jsonify(user_data), 200
        else:
            return jsonify({'error': 'User not found'}), 404
        

    except Exception as e:
        print("Error in /get_user_data:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()
        if cursor:
            cursor.close()
@app.route('/get_friend_users',methods = ['GET'])
def get_friend_users():

    user_id = session.get('user_id')

    conn = None
    cursor = None
    
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute('''
            SELECT id, username, email
            FROM users
            WHERE id != %s
            LIMIT 10
        ''', (user_id,))

        friend_users = cursor.fetchall()

        result = [{
            'id': user[0],
            'username': user[1],
            'email': user[2]
        } for user in friend_users]

        return jsonify(result), 200

    except Exception as e:
        print("Error in /get_all_users_except_me:", e)
        return jsonify({"error": str(e)}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/add_comment',methods = ['POST'])
def add_comment():
    conn = None
    cursor = None
    
    try:
        data = request.get_json()
        user_id = session.get('user_id')
        post_id = data.get('post_id')
        content = data.get('content')

        print("user_id:", user_id)
        print("post_id:", post_id)
        print("content:", content)  

        if not user_id or not post_id or not content:
            return jsonify({'error': 'Missing fields'}), 400


        conn = get_connection()
        cursor = conn.cursor()

        now = datetime.now()
        
        cursor.callproc('add_comment', [user_id, post_id ,content, now])
        response = cursor.fetchone()

        if response:
            id = response[0]    
            username = response[1]
        else:
            print("Post procedure did not return any data.")

        conn.commit()

        print("Procedure result:", response)
        return jsonify({
            'response': id,
            'author': username,
            'date': now.isoformat(),
            'message': 'Comment added successfully'
        }), 200


    except Exception as e:
        print("Error adding comment:", e)
        return jsonify({'error': 'Failed to add comment'}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@app.route('/get_comments', methods = ['GET'])
def get_comments():
    # user_id = session.get('user_id')
    
    conn = None
    cursor = None

    post_id = request.args.get('post_id')

    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT c.id, c.content, c.date, u.username
            FROM comments c
            LEFT JOIN users u ON u.id = c.user_id
            WHERE post_id = %s
            ORDER BY date DESC
    """, (post_id,))

        rows = cursor.fetchall()
        comments = []
        for row in rows:
            comments.append({
                'id': row[0],
                'content': row[1],
                'date': row[2],
                'author': row[3]  
            })

        return jsonify(comments)

    except Exception as e:
        print("Error fetching comments:", e)
        return jsonify({"error": "Internal server error"}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close() 

#endregion

#region Youtube Endpoints

def connectYT():
    return YTMusic(ytConfig)

@app.route('/search_music', methods=['GET'])
def search_music():
    query = request.args.get('query')

    if not query:
        return jsonify({'error' : 'Missing query parameter'}), 400
    
    try:
        yt = connectYT()
        results = yt.search(query, filter='songs')

        songs = []
        for item in results:
            if item['resultType'] == 'song':
                songs.append({
                    'title' : item.get('title'),
                    'videoid' : item.get('videoId'),
                    'artist' : item.get('artists')[0]['name'] if item.get('artists') else 'unknown',
                    'thumbnail_url': item['thumbnails'][1]['url'] if item.get('thumbnails') else None,
                    'duration' : item.get('duration')
                })

        return jsonify(songs), 200
        
    except Exception as e:
        print("Error in /search_music:", e)
        return jsonify({'error': 'Failed to search music'}), 500   

@app.route('/add_recently_played', methods=['POST'])
def add_recently_played():
    data = request.get_json()
    video_id = data.get('video_id')
    user_id = session.get('user_id')
    conn = None
    cursor = None
    

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 400

    if not video_id:
        return jsonify({'error': 'Missing video_id'}), 400

    
    try:
        yt = connectYT()
        song_data = yt.get_song(video_id)

        title = song_data['videoDetails'].get('title', 'Unknown Title')
        artist = song_data['videoDetails'].get('author', 'Unknown Artist')
        thumbnail_url = song_data['videoDetails']['thumbnail']['thumbnails'][1]['url']
        audio_url = f"https://www.youtube.com/watch?v={video_id}"

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            SELECT 1 FROM recently_played_songs 
            WHERE user_id = %s AND video_id = %s
        """, (user_id, video_id))

        if cursor.fetchone():
                    return jsonify({'message': 'Song already in recently played'}), 200

        cursor.execute("""
            INSERT INTO recently_played_songs (user_id, title, artist, thumbnail_url, audio_url, video_id)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (user_id, title, artist, thumbnail_url, audio_url, video_id))

        conn.commit()
        cursor.close()

        return jsonify({'message': 'Song added to recently played'}), 200

    except Exception as e:
        print("Error in /add_recently_played:", e)
        return jsonify({'error': 'Failed to add recently played song'}), 500

        
@app.route('/get_recently_played', methods=['GET'])
def get_recently_played():

    
    user_id = session.get('user_id')
    conn = None
    cursor = None

    if not user_id:
        return jsonify({'error': 'User not logged in'}), 400
    
    try:
        conn = get_connection()
        cursor= conn.cursor()

        cursor.execute('''
            SELECT id, title, artist, thumbnail_url, audio_url, timestamp, video_id
            FROM recently_played_songs
            WHERE user_id = %s
            ORDER BY timestamp DESC
        ''', (user_id,))

        songs = cursor.fetchall()

        # Format the results as a list of dictionaries
        recent_songs = [{
            'id': song[0],
            'title': song[1],
            'artist': song[2],
            'thumbnail_url': song[3],
            'audio_url': song[4]
        } for song in songs]

        return jsonify(recent_songs), 200 
    
    except Exception as e:
        print("Error in /get_recently_played:", e)
        return jsonify({'error': 'Failed to fetch recently played songs'}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
#endregion

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))