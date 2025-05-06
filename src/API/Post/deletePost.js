import PackageJSON from '../../../package.json'

async function deletePost(post_id){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Delete_Post +`?post_id=${post_id}`;

    try{
        const result = await fetch(url,{
            method: "DELETE",
            credentials: 'include'
        })

        if (!result.ok) {
            console.log("failed to fetch result", result.statusText);
            return
        }

        const access = await result.json();
        return access;

    } catch(error){
        console.error("Error deleting post", error);
        return;
    }
}

export default deletePost;