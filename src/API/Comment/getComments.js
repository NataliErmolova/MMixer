import PackageJSON from '../../../package.json';

async function getComments(post_id){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Get_Comments + `?post_id=${post_id}`; 

    try{
        const response = await fetch(url, {
            method:'GET',
            credentials: 'include'
        });

        if (!response.ok) {
            console.error("Failed to fetch posts:", response.statusText);
            return [];
        }

        const posts = await response.json();
        return posts;
        
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

export default getComments;