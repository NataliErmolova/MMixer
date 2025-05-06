import PackageJSON from '../../../package.json'; 

async function LoginUser(email, password) {
    try{
    
        const url = PackageJSON.API.BaseUrl + PackageJSON.API.Login;

        console.log("Final URL:", url);
    
        const model = { email: email, password: password };
        console.log("Request payload:", model);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(model),
            credentials: 'include'
        });    


        console.log("Response status:", response.status);
        console.log("Response headers:", [...response.headers.entries()]);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server error: ${response.status} ${errorText}`);
        }

        const json = await response.json()

        console.log("Response data:", json);
            return json;
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
}

export default LoginUser;