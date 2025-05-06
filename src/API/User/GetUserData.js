import PackageJSON from '../../../package.json';

async function GetUserData(){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Get_User_Data;

    try{
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include'
        });

        if(!response.ok){
            console.error("Failed to fetch data:", response.statusText);
            return [];
        }

        const data = await response.json(); 
        return data;
    } catch (error){
        console.error("Error fetching data:", error);
        return [];
    }
}

export default GetUserData;