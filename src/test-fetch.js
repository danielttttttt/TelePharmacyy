// src/test-fetch.js
fetch('/api/medications')
  .then(response => {
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    return response.json();
  })
  .then(data => {
    console.log('Data received:', data);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });