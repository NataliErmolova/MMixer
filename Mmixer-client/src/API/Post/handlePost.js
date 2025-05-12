import PackageJSON from '../../../package.json';    

async function handlePost(content){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Post;

    const model = { post_content: content };
    console.log(model);
    

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model),
        credentials: 'include'
    });

    if(!response.ok){
        console.log("error:" + response.statusText);
        return null;
    }

    const json = await response.json()
    console.log(json)
    return json;
}

export default handlePost;