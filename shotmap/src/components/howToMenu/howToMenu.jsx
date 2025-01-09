import React from "react";
import "./howToMenu.css";
import { useLogin } from "../../context/loginContext";

const HowToMenu = () => {
const { user } = useLogin();
  
  return (
    <>
<div className="dropdown">
  <input
    hidden=""
    className="sr-only"
    name="state-dropdown"
    id="state-dropdown"
    type="checkbox"
  />
  <label
    aria-label="dropdown scrollbar"
    for="state-dropdown"
    className="trigger"
  ></label>

  <ul className="list webkit-scrollbar" role="list" dir="auto">
    <li className="listitem" role="listitem">
    {!user && 
    <article className="article">
    <p>
      When your team gains possession of the ball, mark it on the grid
      below. (Non-verified data will not persist after the session.)
    </p>
    <ul>
      <li>When possession is lost, click the grid again to mark it.</li>
      <li>
        You will then be asked whether it was due to a shot, and if the
        shot resulted in a goal.
      </li>
    </ul>
    </article>}
    {user && 
        <article className="article">
        <p>
          To start a new match, follow these steps: first, select the series; next, choose your team; and finally, pick the opponent team.
        </p>
        <ul>
          <li>Click the grid to mark actions during the match. If possession is lost, click the grid again to log it.</li>
          <li>
            If the loss was due to a shot, you’ll be prompted to indicate whether the shot resulted in a goal.
          </li>
        </ul>
        <p>
          At the end of the game, click the "End Match" button. You’ll be asked to provide the match result, after which the match will be saved. You can access saved matches on the history page.
        </p>
      </article>}
    </li>
  </ul>
</div>
</>
  );
};

export default HowToMenu;
