import React from "react";

const About = () => {
  return (
    <div className="about-page">
      <h1>About This App</h1>
      <p>
        Welcome to our simple but deep and customisable "possession analysis tool", a state-of-the-art application designed to track and analyze ball or puck possession during games. This tool is perfect for coaches, analysts, and enthusiasts looking to gain deeper insights into possession dynamics and performance efficiency on the field.
      </p>

      <h2>Purpose and Functionality</h2>
      <p>
        The core purpose of this app is to record and analyze the flow of possession during a game. Users can interact with a grid-based interface that divides the playing area into zones for precise input:
      </p>
      <ul>
        <li>
          <strong>Grid Structure:</strong> The field is divided into 8x4 primary zones, each further subdivided into 4x4 smaller zones for granular tracking.
        </li>
        <li>
          <strong>Input Process:</strong>
          <ul>
            <li><strong>First Click:</strong> Marks the gain of possession, indicating where possession began.</li>
            <li><strong>Second Click:</strong> Marks the loss of possession, indicating where possession ended.</li>
          </ul>
        </li>
        <li>
          After the second click, the user is prompted to specify:
          <ul>
            <li>Whether the loss of possession was due to a shot on goal.</li>
            <li>If it was a shot, whether it resulted in a goal.</li>
          </ul>
        </li>
      </ul>

      <h2>Data Storage and Display</h2>
      <p>
        The collected data is stored based on the user's account state:
      </p>
      <ul>
        <li>
          <strong>Logged-in Users:</strong> Data is securely stored in a backed-up database.
        </li>
        <li>
          <strong>Guest Users:</strong> Data is stored in session memory for temporary use.
        </li>
      </ul>
      <p>
        The stored data is displayed on a separate grid, providing a detailed view of the game’s events and enabling advanced analysis:
      </p>
      <ul>
        <li><strong>Possession Efficiency:</strong> Analyzing how effectively possessions are converted into opportunities.</li>
        <li><strong>Shot Efficiency:</strong> Evaluating the success rate of shots taken.</li>
        <li><strong>Possession Duration:</strong> Tracking and analyzing the time spent in possession.</li>
      </ul>

      <h2>Future Development</h2>
      <p>
        We envision significant enhancements to this tool, including:
      </p>
      <ul>
        <li><strong>Machine Learning Analysis:</strong> Leveraging historical data to predict outcomes in future games.</li>
        <li><strong>Player Performance Insights:</strong> Collecting and analyzing player-specific metrics for a more detailed breakdown of contributions.</li>
      </ul>

      <h2>Technical Details</h2>
      <p>
        This app is built with modern technologies to ensure reliability, scalability, and performance:
      </p>
      <ul>
        <li>
          <strong>Front-End:</strong>
          <ul>
            <li>Built with React, utilizing a component-based architecture for modular and efficient development.</li>
            <li>Styled with custom CSS to ensure a clean and intuitive user interface.</li>
            <li>Implements token-based user authentication for secure and seamless access.</li>
          </ul>
        </li>
        <li>
          <strong>Back-End:</strong>
          <ul>
            <li>Powered by Django, a robust framework that manages data storage, user login functionality, and backups.</li>
            <li>Future enhancements will include advanced data analysis and machine learning capabilities, leveraging Python’s extensive libraries.</li>
          </ul>
        </li>
      </ul>

      <p>
        This app represents the cutting edge of game analysis technology and demonstrates a commitment to delivering professional-grade tools for sports analytics. Whether you're managing a team, analyzing performance, or simply curious about possession trends, this tool offers powerful insights to elevate your understanding of the game.
      </p>
    </div>
  );
};

export default About;
