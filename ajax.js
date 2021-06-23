document.getElementById("btn").addEventListener("click", loadResult);

alreadyDisplayed = [];

function loadResult(event) {
    event.preventDefault();
    var inputValue = document.getElementById("inputElem").value.trim();
    //console.log(inputValue);

    var xhr = new XMLHttpRequest();

    xhr.open("GET", "https://api.covid19api.com/summary", true);

    xhr.onload = function() {
        if (inputValue == "") {
            return 0;
        }

        const receivedData = JSON.parse(this.responseText);
        console.log(receivedData);

        var matchFound = false;

        for (var item in receivedData.Countries) {
            var dataItem = receivedData.Countries[item];

            var input_length = inputValue.length;

            output = "";

            for (var i = 0; i < input_length; i++) {
                output += dataItem.Country[i];
            }

            if (
                dataItem.Country.toLowerCase() == inputValue.toLowerCase() ||
                output.toLowerCase() == inputValue.toLowerCase()
            ) {
                console.log("Match Found! \n" + dataItem.Country);

                matchFound = true;

                displayData(dataItem, alreadyDisplayed, inputValue);
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

    function displayData(data, alreadyDisplayed, inputValue) {
        // checking if inputValue has already had it's results displayed or not

        output = "";

        for (var i = 0; i < alreadyDisplayed.length; i++) {
            if (alreadyDisplayed[i] == data.Country.toLowerCase()) {
                console.log("We have already displayed this country's data!!");
                return 0;
            }

            /* for (var j = 0; j < inputValue.length; j++) {

                      output += alreadyDisplayed[i][j];

                  }

                  if (output.toLowerCase() == inputValue.toLowerCase()) {
                      console.log('We have already displayed this country\'s data!!')
                      return 0;
                  } */
        }

        // First, we will erase the previous data rows.

        /*            previousDataRows = document.getElementsByTagName('tr');
    
                        console.log(previousDataRows.length);
    
                        if (previousDataRows.length > 1) {
    
                            for (var i = 0; i < previousDataRows.length; i++) {
    
                                if (i > 1) {
                                    previousDataRows[i].style.display = 'none';
                                }
                            }
    
                        }
        */

        // if results of inputValue haven't been displayed yet, they will be displayed now.

        console.log("displaying data...wait...");

        document.getElementById("table-container").style.display = "inline-flex";

        heading_row = document.getElementById("heading-row");

        // Creating a new row to display data.

        new_table_row = document.createElement("tr");

        // Adding a class to it:

        new_table_row.classList.add("data-row");

        // Getting all the necessary values from the JSON object.

        country_value = document.createElement("td");
        country_value.innerText = data.Country;

        newCases = document.createElement("td");
        newCases.innerText = data.NewConfirmed;

        newDeaths = document.createElement("td");
        newDeaths.innerText = data.NewDeaths;

        newRecovered = document.createElement("td");
        newRecovered.innerText = data.NewRecovered;

        totalConfirmed = document.createElement("td");
        totalConfirmed.innerText = data.TotalConfirmed;

        totalDeaths = document.createElement("td");
        totalDeaths.innerText = data.TotalDeaths;

        totalRecovered = document.createElement("td");
        totalRecovered.innerText = data.TotalRecovered;

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

        alreadyDisplayed.push(data.Country.toLowerCase());

        console.log(alreadyDisplayed);
    }

    function isSubSequence(str1, str2, m, n) {
        // Base Cases
        if (m == 0) return true;
        if (n == 0) return false;

        // If last characters of two strings
        // are matching
        if (str1[m - 1] == str2[n - 1])
            return isSubSequence(str1, str2, m - 1, n - 1);

        // If last characters are not matching
        return isSubSequence(str1, str2, m, n - 1);
    }

    xhr.send();
}