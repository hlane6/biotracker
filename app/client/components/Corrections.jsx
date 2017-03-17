import React from 'react';


export default class CorrectionsPanel extends React.Component {


    render() {
        return (
            <div class="sidebar">
                <h2 class="h2-corrections">make corrections</h2>
                <div class="tab">
                    <a class="tab-links">add</a>
                    <a class="tab-links">remove</a>
                    <a class="tab-links">switch ids</a>
                </div>
                <p class="corrections-content-1">1. click on the object </br> you need a box for</p>
                <p class="corrections-content-2">2. create box id:</p>
                <form class="corrections-input">
                    <input class="box-id" type="number" placeholder="box id">
                </form>
                <button class="finish-button">finish</button>
            </div>
        );
    }
}