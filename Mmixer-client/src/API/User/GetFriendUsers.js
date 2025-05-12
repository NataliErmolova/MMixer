import PackageJSON from '../../../package.json';

async function GetFriendUsers(){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Get_Friend_Users;
    try{
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if(!response.ok){
            console.error("Failed to fetch data:", response.statusText);
            return [];
        }

        const friendUsers = await response.json(); 
        return friendUsers;
    } catch (error){
        console.error("Error fetching data:", error);
        return [];
    }
}

export default GetFriendUsers;