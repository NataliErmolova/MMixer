import PackageJSON from '../../../package.json'

async function updatePost(post_id, updated_content){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Edit_Post + `?post_id=${post_id}`;  
    try{
        const response = await fetch(url, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                post_id: post_id,
                updated_content: updated_content
            })
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Edit successful:", data);
        } else {
            console.error("Edit failed:", data.message);
        } 

        return data;
    }catch(error){
        console.error("Error editing post", error);
        return;
    }
}


export default updatePost