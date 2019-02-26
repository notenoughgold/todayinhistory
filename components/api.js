import React, { Component } from "react";

const baseUrl = "https://history.muffinlabs.com/date";

async function getTodayInHistory() {
  try {
    let responseStr = await fetch(baseUrl);
    let responseJson = await responseStr.json();
    return responseJson.data;
  } catch (error) {
    console.warn(error);
  }
}

export { getTodayInHistory };
