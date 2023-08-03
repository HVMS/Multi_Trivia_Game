import axios from "axios";

export async function postData(body: string, url: string, token?: string) {
    try {
        var myHeaders: any = {};
        myHeaders["Content-Type"] = "application/json";
        myHeaders["Accept"] = "application/json";
        myHeaders["Access-Control-Allow-Origin"] = "*";
        if (token) myHeaders["authorization"] = `Bearer ${token}`;

        var requestOptions = {
            headers: myHeaders
        };

        const response = await axios.post(url, body, requestOptions);
        return response;
    } catch (error: any) {
        console.log("error", error);
        return error;
    }
}

export async function putData(body: string, url: string, token?: string) {
    try {
        var myHeaders: any = {};
        myHeaders["Content-Type"] = "application/json";
        myHeaders["Accept"] = "application/json";

        if (token) myHeaders["authorization"] = `Bearer ${token}`;

        
        var requestOptions = {
            headers: myHeaders
        };

        const response = await axios.put(url, body, requestOptions);
        return response;

    } catch (error: any) {
        console.log("error", error.response);
        return error;
    }
}

export async function getData(url: string, token?: string) {
    try {
        var myHeaders: any = {};
        myHeaders["Accept"] = "application/json";
        myHeaders["Access-Control-Allow-Origin"] = "*";
        myHeaders["Access-Control-Allow-Methods"] = "GET,POST";
        myHeaders["Access-Control-Allow-Headers"] = "Content-Type";
        if (token) myHeaders["Authorization"] = `Bearer ${token}`;

        var requestOptions = {
            // headers: myHeaders
        };

        const response = await axios.get(url, requestOptions);
        return response;
        
    } catch (error: any) {
        console.log("error", error);
        return error;
    }
}
