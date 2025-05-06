import PackageJSON from '../../../package.json'

async function checkAccess(post_id){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Check_User_Access + `?post_id=${post_id}`;

    try{
        const result = await fetch(url,{
            method: "GET",
            credentials: 'include'
        })

        if (!result.ok) {
            console.log("failed to fetch result", result.statusText);
            return
        }

        const access = await result.json();
        return access;

    } catch(error){
        console.error("Error fetching access", error);
        return;
    }

}

export default checkAccess;