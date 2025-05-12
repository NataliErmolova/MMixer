import PackageJSON from '../../../package.json';


async function LogOutUser(setCurrentUser, setisAuthenticated){
        const url = PackageJSON.API.BaseUrl + PackageJSON.API.LogOut;
    try{
        await fetch(url, {
            method: 'POST',
            credentials: 'include'
        })

        setCurrentUser(null);
        setisAuthenticated(false);
    } catch (error){
        console.log('Log out failed', error);
    }
}

export default LogOutUser