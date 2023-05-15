import "./App.css";


import React, { useState } from 'react';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function App() {
  const [histogramData, setHistogramData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const response = await fetch('https://www.terriblytinytales.com/test.txt');
    const text = await response.text();
    const words = text.split(/\s+/);
    const frequency = {};
    words.forEach(word => {
      if (word in frequency) {
        frequency[word] += 1;
      } else {
        frequency[word] = 1;
      }
    });
    const data = Object.entries(frequency).map(([word, count]) => ({
      word,
      count
    }));
    const sortedData = data.sort((a, b) => b.count - a.count).slice(0, 20);
    setHistogramData(sortedData);
    setLoading(false);
  };

  const downloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + histogramData.map(item => item.word + "," + item.count).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "histogram_data.csv");
    document.body.appendChild(link);
    link.click();
  }

  const handleBack = () => {
    setHistogramData([]);
  }

  return (
    <div className="App">
      {!loading && histogramData.length === 0 && (
        <div className="flex items-center self-center text-center   py-12">
          <button class="flex max-w-sm w-full bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 focus:outline-none text-white text-4xl uppercase font-bold shadow-2xl rounded-full mx-auto py-5 px-28 animate-bounce " onClick={fetchData}>Submit</button>
        </div>
      )}
      {loading && (
        <div className="center">
          <p>Loading...</p>
        </div>
      )}
      {histogramData.length > 0 && (
        <div className="p-6 bg-[#f9f5e3] ">
        <p class="flex justify-center text-3xl font-bold pb-5"> Visualized Data </p>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="word" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
          <div  className="flex justify-center items-center self-center ">
            <button class="border-2 border-yellow-600 rounded-lg px-3 py-2 text-yellow-700 cursor-pointer hover:bg-yellow-600 hover:text-yellow-200 m-3" onClick={downloadCSV}>Export</button>
            <button class="border-2 border-blue-600 rounded-lg px-3 py-2 text-blue-400 cursor-pointer hover:bg-blue-600 hover:text-blue-200  " onClick={handleBack}>Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;