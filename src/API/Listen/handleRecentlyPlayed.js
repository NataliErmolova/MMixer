import PackageJSON from '../../../package.json'

async function handleRecentlyPlayed(nowPlaying){
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Add_Recently_Played;

    try {
        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                video_id: nowPlaying.videoid,
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Failed to add recently played:', data.error);
        } else {
            console.log('Recently played added successfully:', data.message);
        }

    } catch (error) {
        console.error('Error sending recently played:', error);
    }

}

export default handleRecentlyPlayed;