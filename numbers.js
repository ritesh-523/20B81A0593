const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/numbers', async (req, res) => {
  const urlParams = req.query.url;

  if (!urlParams || !Array.isArray(urlParams)) {
    return res.status(400).json({ error: 'Invalid URL parameters' });
  }

  const numbersPromises = urlParams.map(async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;
      if (data && data.numbers && Array.isArray(data.numbers)) {
        return data.numbers;
      } else {
        return [];
      }
    } catch (error) {
      console.error(`Error fetching data from ${url}: ${error.message}`);
      return [];
    }
  });

  try {
    const numbersArrays = await Promise.all(numbersPromises);
    const mergedNumbers = numbersArrays.reduce((acc, numbers) => acc.concat(numbers), []);
    const uniqueSortedNumbers = [...new Set(mergedNumbers)].sort((a, b) => a - b);

    res.json({ numbers: uniqueSortedNumbers });
  } catch (error) {
    console.error('Error processing requests:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Number Management Service is running on port ${port}`);
});