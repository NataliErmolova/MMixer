import PackageJSON from '../../../package.json'

async function checkAccess(post_id){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Check_User_Access + `?post_id=${post_id}`;

    try{
        const result = await fetch(url,{
            method: "GET",
            credentials: 'include'
        })

        const contentType = result.headers.get("content-type");

        if (!result.ok) {
            const errorText = contentType && contentType.includes("application/json")
                ? await result.json()
                : await result.text();
            return;
        }
        if (contentType && contentType.includes("application/json")) {
            const access = await result.json();
            return access;
        } else {
            return;
        }

    } catch(error){
        console.error("Error fetching access", error);
        return;
    }

}

export default checkAccess;