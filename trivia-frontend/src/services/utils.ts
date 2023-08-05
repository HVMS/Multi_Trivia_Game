import axios from "axios";
import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIAQNI4KP7PLUIMIZXL",
  secretAccessKey: "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",
});

export async function postData(body: string, url: string, token?: string) {
  try {
    var myHeaders: any = {};
    myHeaders["Content-Type"] = "application/json";
    myHeaders["Accept"] = "application/json";
    myHeaders["Access-Control-Allow-Origin"] = "*";
    if (token) myHeaders["authorization"] = `Bearer ${token}`;

    var requestOptions = {
      // headers: myHeaders
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
      headers: myHeaders,
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

export async function shootInvition(URL: string) {
  const sqs = new AWS.SQS();
  const queueURL =
    "https://sqs.us-east-1.amazonaws.com/028513566686/trivia-notification-queue";
  const message = `\"{\\"type\\":\\"EMAIL\\",\\"message\\":\\"You have been invited to a game. Please click on the link to join. ${URL}\\"}\"`;

  const params = { MessageBody: message, QueueUrl: queueURL };

  try {
    let data = await sqs.sendMessage(params).promise();
  } catch (err) {
    console.log("Error", err);
  }
}

export const shootPushNotification = async (message: string) => {
  const sqs = new AWS.SQS();
  const messageBody = `\"{\\"type\\":\\"PUSH\\",\\"message\\":\\"${message}\\"}\"`;
  const queueURL =
    "https://sqs.us-east-1.amazonaws.com/028513566686/trivia-notification-queue";
  const params = { MessageBody: messageBody, QueueUrl: queueURL };
  try {
    let data = await sqs.sendMessage(params).promise();
  } catch (err) {
    console.log("Error", err);
  }
};

export function getRemainingTimeInSeconds(startTime: any) {
  const currentTime = Date.now();
  const timeDifferenceInMillis = startTime - currentTime;
  const timeDifferenceInSeconds = Math.floor(timeDifferenceInMillis / 1000);
  if (timeDifferenceInMillis > 0) {
    return timeDifferenceInSeconds;
  }
  return 0;
}
