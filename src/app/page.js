"use client";

import React, { useState, useRef } from "react";

const base_paytable = [
  [10.06, 10.4, 10.73, 11.07, 11.4, 11.6, 11.93, 12.26, 12.27, 12.59],
  [11.31, 11.58, 11.96, 12.27, 12.41, 12.78, 13.14, 13.51, 13.87, 14.24],
  [12.34, 12.76, 13.17, 13.58, 13.99, 14.4, 14.81, 15.23, 15.64, 16.05],
  [13.86, 14.32, 14.78, 15.24, 15.71, 16.17, 16.63, 17.09, 17.55, 18.01],
  [15.5, 16.02, 16.54, 17.06, 17.57, 18.09, 18.61, 19.12, 19.64, 20.16],
  [17.28, 17.86, 18.44, 19.01, 19.59, 20.16, 20.74, 21.31, 21.89, 22.47],
  [19.21, 19.85, 20.49, 21.13, 21.77, 22.41, 23.05, 23.69, 24.33, 24.97],
  [21.27, 21.98, 22.69, 23.4, 24.11, 24.82, 25.52, 26.23, 26.94, 27.65],
  [23.49, 24.28, 25.06, 25.84, 26.62, 27.41, 28.19, 28.97, 29.76, 30.54],
  [25.87, 26.73, 27.59, 28.46, 29.32, 30.18, 31.04, 31.91, 32.77, 33.63],
  [28.42, 29.37, 30.32, 31.26, 32.21, 33.16, 34.11, 35.05, 36.0, 36.95],
  [34.07, 35.2, 36.34, 37.47, 38.61, 39.75, 40.88, 42.02, 43.15, 44.29],
  [40.51, 41.86, 43.21, 44.56, 45.91, 47.26, 48.61, 49.96, 51.31, 52.66],
  [47.87, 49.47, 51.06, 52.66, 54.25, 55.85, 57.45, 59.04, 60.64, 62.23],
  [56.31, 58.19, 60.06, 61.94, 63.82, 65.69, 67.57, 69.45, 71.32, 73.2],
];

const locality = {
  AL: 19.45,
  AQ: 17.63,
  ATL: 23.02,
  AU: 19.4,
  BH: 17.41,
  BOS: 31.05,
  BU: 21.35,
  BN: 18.31,
  CT: 18.63,
  CHI: 29.79,
  CIN: 21.35,
  CLE: 21.69,
  CS: 19.11,
  COL: 21.27,
  CC: 17.1,
  DFW: 26.37,
  DV: 18.21,
  DAY: 20.59,
  DEN: 29.05,
  DM: 17.13,
  DET: 28.37,
  HB: 18.59,
  HAR: 30.91,
  HOU: 34.47,
  HNT: 20.96,
  IND: 17.57,
  KC: 18.18,
  LR: 20.64,
  LV: 18.76,
  LA: 34.89,
  MFL: 24.14,
  MIL: 21.74,
  MSP: 26.39,
  NY: 36.16,
  OM: 17.52,
  PB: 17.3,
  PHL: 27.84,
  PX: 21.44,
  PIT: 20.37,
  POR: 24.98,
  RA: 21.37,
  RCH: 21.38,
  SAC: 28.3,
  SO: 18.0,
  SD: 32.01,
  SF: 44.15,
  SEA: 29.57,
  SL: 19.1,
  TU: 18.4,
  VB: 17.94,
  DCB: 32.49,
  RUS: 16.5,
  AK: 31.32,
  HI: 21.17,
};

// Preferred Order: 15, 14, 13, 12, 11, 9, 7, 5, 3, 10, 8, 6, 4, 2, 1
// Note: Following array is preferred, but 0-indexed
const payscale_order = [14, 13, 12, 11, 10, 8, 6, 4, 2, 9, 7, 5, 3, 1, 0];

function PayScaleEntry({ idx }) {
  return (
    <div>
      <select name={`payscale${idx}`} id={`payscale${idx}`}>
        {payscale_order.map((ps) => {
          return <option value={`${ps}`}>{`GS${ps}`}</option>;
        })}
      </select>
      <select name={`locality${idx}`} id={`locality${idx}`}>
        {Object.keys(locality).map((lo) => {
          return <option value={`${lo}`}>{`${lo}`}</option>;
        })}
      </select>
      x<input type="number" name={`count${idx}`} id={`count${idx}`} value="0" />
    </div>
  );
}

function HourlyRateEntry({ idx }) {
  return (
    <div>
      <input
        type="number"
        name={`rate${idx}`}
        min="0"
        max="100"
        value="20.00"
      />
      x<input type="number" name={`count${idx}`} id={`count${idx}`} value="0" />
    </div>
  );
}

function rnd2pts(v) {
  return Math.round((v + Number.EPSILON) * 100) / 100;
}

export default function Home() {
  const [duration, setDuration] = useState(0);
  const increment = useRef(null);

  const doStartTimer = (e) => {
    increment.current = setInterval(
      () => setDuration((v) => rnd2pts(v + 0.07)),
      70
    );
  };

  const doStopTimer = (e) => {
    if (increment.current) {
      clearInterval(increment.current);
    }
  };

  return (
    <html lang="en">
      <head></head>
      <body>
        <h1>Meeting Tracker</h1>
        <div style={{ display: "flex" }}>
          <div style={{ backgroundColor: "#933", flexGrow: 1 }}>
            <p>Pay Scale:</p>
            {[0, 1, 2, 3, 4].map((idx) => {
              return <PayScaleEntry idx={idx} />;
            })}

            <p>Hourly Rates:</p>
            {[0, 1, 2, 3, 4].map((idx) => {
              return <HourlyRateEntry idx={idx} />;
            })}

            <div>
              <p>Duration:</p>
              <input
                type="number"
                name="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <div style={{ backgroundColor: "#393", flexGrow: 9 }}>
            <div>
              <button onClick={doStartTimer}>Start</button>
              <button onClick={doStopTimer}>Stop</button>
            </div>
            <div style={{ fontSize: 100 }}>{`$${rnd2pts(
              duration * 20.0
            ).toFixed(2)}`}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
