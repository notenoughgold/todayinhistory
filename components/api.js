import React, { Component } from "react";
import fakeResponse from "./fakeresponse";

const baseUrl = "https://history.muffinlabs.com/date/";

async function getTodayInHistory(month, day) {
  try {
    var fetchUrl = baseUrl + month + "/" + day;
    let responseStr = await fetch(fetchUrl);
    let responseJson = await responseStr.json();

    // responseJson = fakeResponse;

    return responseJson.data;
  } catch (error) {
    console.warn(error);
  }
}

export { getTodayInHistory };
