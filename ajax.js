document.getElementById("btn").addEventListener("click", loadResult);

alreadyDisplayed = [];

function loadResult(event) {
    event.preventDefault();
    var inputValue = document.getElementById("inputElem").value.trim();
    //console.log(inputValue);

    var xhr = new XMLHttpRequest();

    xhr.open(
        "GET",
        "https://corona.lmao.ninja/v2/countries?yesterday&sort",
        true
    );

    // https://api.covid19api.com/summary

    // displaying the loading GIF for when the data is being loaded

    xhr.onprogress = function() {
        document.getElementsByTagName("iframe")[0].style.display = "flex";
        document.getElementsByTagName("body")[0].style.display = "none";
    };

    // On loading the data:

    xhr.onload = function() {
        document.getElementsByTagName("iframe")[0].style.display = "none";
        document.getElementsByTagName("body")[0].style.display = "flex";

        if (inputValue == "") {
            return 0;
        }

        const receivedData = JSON.parse(this.responseText);
        console.log(receivedData);

        var matchFound = false;

        for (var index in receivedData) {
            let country = receivedData[index]["country"];

            if (country.toLowerCase() == inputValue.toLowerCase()) {
                console.log("Match Found! \n" + country);

                matchFound = true;

                if (document.getElementById("error-text").style.display == "block") {
                    document.getElementById("error-text").style.display = "none";
                    document.getElementsByTagName("input")[0].style.border =
                        "1px solid orange";
                }

                displayData(receivedData[index], alreadyDisplayed);
            } else {
                continue;
            }
        }

        if (matchFound == false) {
            document.getElementById("error-text").style.display = "block";
            document.getElementById(
                "error-text"
            ).innerText = `Sorry, no match found for '${inputValue}' `;

            document.getElementsByTagName("input")[0].style.border = "3px solid red";
            console.error("Sorry no match found!");
        }
    };

    function displayData(data, alreadyDisplayed) {
        // checking if inputValue has already had it's results displayed or not

        output = "";

        for (var i = 0; i < alreadyDisplayed.length; i++) {
            if (alreadyDisplayed[i] == data["country"].toLowerCase()) {
                console.log("We have already displayed this country's data!!");
                return 0;
            }
        }

        // if results of inputValue haven't been displayed yet, they will be displayed now.

        console.log("displaying data...wait...");

        // erasing previous data

        if (document.getElementsByClassName("data-row")[0] != null) {
            document.getElementsByClassName("data-row")[0].style.display = "none";
        }

        document.getElementById("table-container").style.display = "inline-flex";

        heading_row = document.getElementById("heading-row");

        // Creating a new row to display data.

        new_table_row = document.createElement("tr");

        // Adding a class to it:

        new_table_row.classList.add("data-row");

        // Getting all the necessary values from the JSON object.

        country_value = document.createElement("td");
        country_value.innerText = data["country"];

        newCases = document.createElement("td");
        newCases.innerText = data["todayCases"];

        newDeaths = document.createElement("td");
        newDeaths.innerText = data["todayDeaths"];

        newRecovered = document.createElement("td");
        newRecovered.innerText = data["todayRecovered"];

        totalConfirmed = document.createElement("td");
        totalConfirmed.innerText = data["cases"];

        totalDeaths = document.createElement("td");
        totalDeaths.innerText = data["deaths"];

        totalRecovered = document.createElement("td");
        totalRecovered.innerText = data["recovered"];

        // adding all the data values to the row:

        new_table_row.appendChild(country_value);
        new_table_row.appendChild(newCases);
        new_table_row.appendChild(newDeaths);
        new_table_row.appendChild(newRecovered);
        new_table_row.appendChild(totalConfirmed);
        new_table_row.appendChild(totalDeaths);
        new_table_row.appendChild(totalRecovered);

        // adding row to the table:

        heading_row.insertAdjacentElement("afterend", new_table_row);

        document.getElementsByClassName("data-row")[0].style.display = "block";

        if (screen.width <= 700) {
            document.getElementById("table-container").style.display = "none";
            // Creating an element to display only for small screens (width < 700px)

            small_screen_element = document.getElementById("results-container");

            small_screen_element.style.display = "flex";

            small_screen_element.innerHTML =
                `<p class="headings">Country</p>` +
                `<p class="data-values">${data["country"]}</p>` +
                `<p class="headings">New Confirmed Cases</p>` +
                `<p class="data-values">${data["todayCases"]}</p>` +
                `<p class="headings">New Deaths</p>` +
                `<p class="data-values">${data["todayDeaths"]}</p>` +
                `<p class="headings">New Recovered Cases</p>` +
                `<p class="data-values">${data["todayRecovered"]}</p>` +
                `<p class="headings">Total Confirmed Cases</p>` +
                `<p class="data-values">${data["cases"]}</p>` +
                `<p class="headings">Total Deaths</p>` +
                `<p class="data-values">${data["deaths"]}</p>` +
                `<p class="headings">Total Recovered</p>` +
                `<p class="data-values">${data["recovered"]}</p>` +
                "<br" +
                "<hr>";

            //         `<br><table><thead><tr><th>Country</th><th>New Confirmed Cases</th><th>New Deaths</th><th>New Recovered Cases</th><th>Total Confirmed Cases</th><th>Total Deaths</th><th>Total Recovered</th></tr></thead>` +
            //         `<tbody>
            //     <tr class="table-row">
            //       <td class="data">${data.Country}</td>
            //       <td class="data">${data.NewConfirmed}</td>
            //       <td class="data">${data.NewDeaths}</td>
            //       <td class="data>${data.NewRecovered}</td>
            //       <td class="data">${data.TotalConfirmed}</td>
            //       <td class="data">${data.TotalDeaths}</td>
            //       <td class="data">${data.TotalRecovered}</td>
            //     </tr>
            //   </tbody>
            // </table>`;

            // `Country: \t ${data.Country} \n New Confirmed Cases: \t ${data.NewConfirmed} \n New Deaths: \t ${data.NewDeaths} \n New Recovered Cases: \t ${data.NewRecovered} \n Total Confirmed Cases: \t ${data.TotalConfirmed} \n Total Deaths: \t ${data.TotalDeaths} \n Total Recovered: \t ${data.TotalRecovered}`;

            // small_screen_element.appendChild(covid_data);

            // console.log(covid_data);
        }

        // pushing country name to the list of already displayed countries

        alreadyDisplayed.push(data.Country.toLowerCase());

        console.log(alreadyDisplayed);
    }

    xhr.send();
}