
import React, { Component } from 'react'


class QuoraButton extends Component {
    renderSVG=()=> {
        if (this.props.value === 'answer') {
            return (
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="answer" transform="translate(2.500000, 3.500000)" stroke="none" stroke-width="1.5" fill="none" fillRule="evenodd">
                            <g id="pen" transform="translate(9.000000, 9.000000) rotate(-315.000000) translate(-9.000000, -9.000000) translate(7.000000, -1.000000)">
                                <path d="M2,8.8817842e-16 L2,8.8817842e-16 L2,8.8817842e-16 C3.1045695,6.85269983e-16 4,0.8954305 4,2 L4,16 L2.00256278,20 L0,16 L0,2 L0,2 C-1.35267774e-16,0.8954305 0.8954305,1.09108686e-15 2,8.8817842e-16 Z" id="pen_body" class="svg-color" stroke="#666" stroke-linecap="round" stroke-linejoin="round">
                                </path>
                                <polygon id="pen_tip" className="svg-color" fill="#666" transform="translate(2.000000, 18.750000) scale(1, -1) translate(-2.000000, -18.750000) " points="2 17.5 3.25 20 0.75 20">
                                </polygon>
                            </g>
                            <path d="M12,16 L17,16 L17,11 M7,1 L2,1 L2,6" id="bg" className="svg-color" stroke="#666" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </g>
                    </svg>
            )
        }
        else if (this.props.value === "upvote") {
            return (
                    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                        <g id="upvote" class="svg-color" stroke-width="1.5" stroke="#666" fill="none" fill-rule="evenodd" stroke-linejoin="round">
                            <polygon points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                        </g>
                    </svg>
            )
        }
        
    }

    render() {
        return (
            <div>
                <button className="quora-button" onClick={this.props.onclick}>
                    {this.renderSVG()}
                    <span style={{ verticalAlign: "top" }}>{" "+this.props.text}</span>
                </button >
            </div>
        )
    }
}

export default QuoraButton;