import React, { useState, useEffect } from 'react';
import { csv } from 'd3';

const csvUrl =
  'https://gist.githubusercontent.com/Biaaang/d04e5e92826a84a5f31ceb16a2c3321c/raw/81b536b6e5cf9ab93faa641ad193e53670fe75b3/college-majors.csv';

export const useData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const row = (d) => {
      d.Total = +d.Total;
      d.Men	= +d.Men;
      d.Women = +d.Women;
      d.ShareWomen = +d.ShareWomen;
      d.Employed = +d.Employed;
      d.Unemployment_rate = +d.Unemployment_rate;
      d.Median = +d.Median;
      d.Major = d.Major;
      d.Major_category = d.Major_category;
      return d;
    };
    csv(csvUrl, row).then(setData);
  }, []);

  return data;
};
