import PackageJSON from '../../../package.json'

async function getRecentlyPlayed(){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Get_Recently_played;

    try{
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
            },

            credentials: 'include',
        });

        if(!response.ok){
            throw new Error('Failed to fetch recently played songs');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error: ', error);
        return {error: 'Unable to fetch recently played songs'};
    }
}

export default getRecentlyPlayed;