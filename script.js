let prov = ["ON", "AB", "prov"];
let todayDate = new Date();
let yesterdayDate = new Date(todayDate);
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

//formats the date to YYYY-MM-DD
let formatDate = yesterdayDate.toISOString().slice(0, 10);
let date = "2021-06-20";
console.log(formatDate);
//let url = `https://api.opencovid.ca/timeseries?stat=cases&loc=${prov[2]}&date=${date}`;
let url = `https://api.opencovid.ca/summary?date=${formatDate}`;
let urls = [
  `https://api.opencovid.ca/summary?date=${formatDate}`,
  "https://api.opencovid.ca/other?stat=prov",
];

//Fetching the api data
//idk but reponse apparently tells if if it got the data and is ok to proceed dont do anything else in repose besides parse to json or won't work
//the thens i think continue on if everything is ok
//when using fetch or API calls i think all the logic for other functions must be within the fetch request or else nothign will return
/*
Example: 
let a;
fetch(url)
    .then((response) => response.json())
    .then((data) => a = data)
    .catch(err = > console.log(err));
console.log(a);

a will still be null for what ever reason idk but it doesn't work.
 */
// fetch(url, {
//   method: "GET",
// })
//   .then((response) => response.json())
//   .then((data) => {
//     console.log("Sucess", data);
//     showData(data);
//   })
//   .catch((err) => console.log(err));

/**
 * used to fetch from multiple apis at once
 * needs to iterate over the index of urls and have them parse the response each individually. Can't be done all at once by using
 * Promise.all(url).then(response => reponse.json()) will be undefined as it is an array that it will be calling the method on
 */
Promise.all(
  urls.map((urlIndex) =>
    fetch(urlIndex).then((response) => parseJson(response))
  )
)
  .then((data) => {
    console.log("Success", data[0]);
    console.log("Success!", data[1]);
    showDataSummary(data[0]);
    extractInfoFrom2DifferentAPICalls(data[0], data[1]);
  })
  .catch((err) => console.group(err));

function showDataSummary(dataSet) {
  //console.log(dataSet);
  //console.log(dataSet.cases[1]);
  let listOfProv = "";
  let formatData;

  for (let i in dataSet.summary) {
    let jsonObj = dataSet.summary[i];
    if (jsonObj.province !== "Repatriated") {
      formatData = `<b>Province</b>: ${jsonObj.province} <br> <u>cases:</u>&emsp;&emsp;${jsonObj.cases} <br>cumulative cases: ${jsonObj.cumulative_cases}<br>date-report(DD-MM-YYYY): ${jsonObj.date}`;
      listOfProv += formatData + "<br>";
    }

    //console.log(formatData);
  }

  document.querySelector(".root").innerHTML = listOfProv;
}

function extractInfoFrom2DifferentAPICalls(dataSet1, dataSet2) {
  for (let i in dataSet1.summary) {
    for (let j in dataSet2.prov) {
      let jsonObj = dataSet1.summary[i];
      let jsonObj2 = dataSet2.prov[j];
      if (
        jsonObj.province === jsonObj2.province &&
        jsonObj.province !== "Repatriated"
      ) {
        console.log(jsonObj.province + " " + jsonObj2.province);
        console.log(
          `active cases: ${jsonObj.active_cases}\npopulation: ${jsonObj2.pop}`
        );
        console.log("infected %:", (jsonObj.active_cases / jsonObj2.pop) * 100);
      }
      //console.log(dataSet2.prov[i].province);
    }
    //console.log(dataSet1.summary[i].province);
  }
}

function parseJson(response) {
  return response.json();
}
