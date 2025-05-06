import PackageJSON from '../../../package.json'

async function handleListen(searchQuery, setSearchResults){
    const url = `${PackageJSON.API.BaseUrl}${PackageJSON.API.Search_Music}?query=${searchQuery}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            setSearchResults(data);
        } else {
            console.error("Error fetching data:", data.error);
        }
    } catch (error) {
        console.error("Error in handleListen:", error);
    }
}

export default handleListen;