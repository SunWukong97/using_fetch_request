let prov = ["ON", "AB", "prov"];
let todayDate = new Date();
let yesterdayDate = new Date(todayDate);
yesterdayDate.setDate(yesterdayDate.getDate() - 1);

//formats the date to YYYY-MM-DD
let formatDate = yesterdayDate.toISOString().slice(0, 10);
let date = "2021-06-20";
console.log(formatDate);
let url = `https://api.opencovid.ca/timeseries?stat=cases&loc=${prov[2]}&date=${formatDate}`;

let urls = [
  `https://api.opencovid.ca/timeseries?stat=cases&loc=${prov[2]}&date=${formatDate}`,
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
    showData(data[0]);
  })
  .catch((err) => console.group(err));

function showData(dataSet) {
  //console.log(dataSet);
  //console.log(dataSet.cases[0]);
  let listOfProv = "";
  let formatData;

  for (let i in dataSet.cases) {
    let jsonObj = dataSet.cases[i];
    if (jsonObj.province !== "Repatriated") {
      formatData = `<b>Province</b>: ${jsonObj.province} <br> <u>cases:</u>&emsp;&emsp;${jsonObj.cases} <br>cumulative cases: ${jsonObj.cumulative_cases}<br>date-report(DD-MM-YYYY): ${jsonObj.date_report}`;
      listOfProv += formatData + "<br>";
    }

    //console.log(formatData);
  }

  document.querySelector(".root").innerHTML = listOfProv;
}

function parseJson(response) {
  return response.json();
}
