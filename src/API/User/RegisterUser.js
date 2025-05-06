import PackageJSON from '../../../package.json';    

async function RegisterUser(username, email, password) {
    const url = PackageJSON.API.BaseUrl + PackageJSON.API.Register;

    const model = { username: username, email: email, password: password };

    console.log(model);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(model),
        credentials: 'include'
    });    

    if(!response.ok)
        console.log("error:" + response.statusText);

    const json = await response.json()

    console.log(json)

    return json;
}

export default RegisterUser;