const fs = require('fs');

// Read the heartrate.json file
const rawData = fs.readFileSync('heartrate.json');
const heartRateData = JSON.parse(rawData);

// Function to calculate median
function calculateMedian(arr) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);

  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
  } else {
    return sortedArr[middle];
  }
}

// Initialize an empty array to store the date, Min, Max, Median and LatestDataTtimestamp
const result = [];

// Initialize an array to capture unique dates
const dates = [];

// Loop through each entry in the heartRateData array
for (const entry of heartRateData) {

  // Extract the date part from the timestamp of the current entry
  const date = entry.timestamps.startTime.split('T')[0];

  // Check if the date is not already in the dates array
  if (!dates.includes(date)) {
    // If it's a new date, add it to the dates array and create a new entry in the result array
    dates.push(date);
    const dateData = {
      date,
      min: entry.beatsPerMinute,
      max: entry.beatsPerMinute,
      median: [entry.beatsPerMinute],
      latestDataTimestamp: entry.timestamps.endTime,
    };
    result.push(dateData);
  } 
  else {
    // If the date already exists in the result array, update the corresponding entry
    for (const dateData of result) {
      if (dateData.date === date) {
        dateData.min = Math.min(dateData.min, entry.beatsPerMinute);
        dateData.max = Math.max(dateData.max, entry.beatsPerMinute);
        dateData.median.push(entry.beatsPerMinute);
        dateData.latestDataTimestamp = entry.timestamps.endTime;
        break; // Stop the loop once the date is found
      }
    }
  }
}

// Calculate the median values for each date
for (const dateData of result) {
  dateData.median = calculateMedian(dateData.median);
}

// Convert the result array to a JSON-formatted string with indentation
const outputJSON = JSON.stringify(result, null, 2);

// Write the JSON string to output.json file
fs.writeFileSync('output.json', outputJSON);

// Log message to the console that output is writtent to output file
console.log('Statistics calculated and written to output.json');
