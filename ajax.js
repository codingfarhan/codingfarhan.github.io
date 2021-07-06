document.getElementById("btn").addEventListener("click", loadResult);
document
    .getElementById("inputElem")
    .addEventListener("input", suggestCountries);

dropdownContainer = document.getElementById("suggestions");

alreadyDisplayed = [];

// Load result of the search

function loadResult(event) {
    event.preventDefault();
    var inputValue = document.getElementById("inputElem").value.trim();
    //console.log(inputValue);

    var xhr = new XMLHttpRequest();

    xhr.open(
        "GET",
        "https://corona.lmao.ninja/v2/countries?yesterday=true",
        true
    );

    // Old API endpoint:    https://api.covid19api.com/summary

    // displaying the loading GIF for when the data is being loaded

    xhr.onprogress = function() {
        document.getElementsByTagName("iframe")[0].style.display = "flex";
        document.getElementsByTagName("body")[0].style.display = "none";
    };

    xhr.onload = function() {
        const receivedData = JSON.parse(this.responseText);

        document.getElementsByTagName("iframe")[0].style.display = "none";
        document.getElementsByTagName("body")[0].style.display = "flex";

        if (inputValue == "") {
            return 0;
        }

        var matchFound = false;

        for (var index in receivedData) {
            let country = receivedData[index]["country"];

            // console.log(country);

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

        function displayData(data, alreadyDisplayed) {
            // checking if inputValue has already had it's results displayed or not

            output = "";

            // for (var i = 0; i < alreadyDisplayed.length; i++) {
            //     if (alreadyDisplayed[i] == data["country"].toLowerCase()) {
            //         console.log("We have already displayed this country's data!!");
            //         return 0;
            //     }
            // }

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
            }

            // pushing country name to the list of already displayed countries

            alreadyDisplayed.push(data["country"].toLowerCase());

            console.log(alreadyDisplayed);
        }
    };

    xhr.send();
}

// Load country suggestions for input

function suggestCountries(event) {
    const xhr = new XMLHttpRequest();

    xhr.open(
        "GET",
        "https://corona.lmao.ninja/v2/countries?yesterday=true",
        true
    );
    let matchedCountries = [];
    liveInputValue = document.getElementById("inputElem").value.trim();

    xhr.onload = function() {
        dropdownContainer.innerHTML = "";
        console.log(liveInputValue);

        const Data = JSON.parse(this.responseText);

        console.log("Data loaded...");

        for (var index in Data) {
            let country = Data[index]["country"];

            // Checking if any country contains/matches the input string:

            if (
                liveInputValue.toLowerCase() == country.toLowerCase() ||
                country.toLowerCase().includes(liveInputValue.toLowerCase()) //Farm@980
            ) {
                matchedCountries.push(country);
            }
        }

        // making sure only unique values are in the array:

        matchedCountries = matchedCountries.filter(onlyUnique);

        // If there are atleast one country that matches the input value, then display the country name in the dropdown list:

        if (matchedCountries.length > 0) {
            for (var item in matchedCountries) {
                let newItem = document.createElement("option");
                newItem.value = matchedCountries[item];
                newItem.innerText = matchedCountries[item];

                dropdownContainer.appendChild(newItem);
            }

            // dropdownContainer.style.display = "block";
        }
        // console.log(matchedCountries);
    };

    xhr.send();
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}