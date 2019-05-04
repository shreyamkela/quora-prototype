
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
        else if (this.props.value === 'downvote') {
            return (
                <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="downvote" class="svg-color" stroke="#666" fill="none" stroke-width="1.5" fill-rule="evenodd" stroke-linejoin="round">
                        <polygon transform="translate(12.000000, 12.000000) rotate(-180.000000) translate(-12.000000, -12.000000) " points="12 4 3 15 9 15 9 20 15 20 15 15 21 15"></polygon>
                    </g>
                </svg>
            )
        }
        else if (this.props.value === 'ellipsis') {
            return(
            <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <g id="overflow" class="svg-color" stroke-width="1.5" stroke="#666" fill="none" fill-rule="evenodd">
                  <path d="M5,14 C3.8954305,14 3,13.1045695 3,12 C3,10.8954305 3.8954305,10 5,10 C6.1045695,10 7,10.8954305 7,12 C7,13.1045695 6.1045695,14 5,14 Z M12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 Z M19,14 C17.8954305,14 17,13.1045695 17,12 C17,10.8954305 17.8954305,10 19,10 C20.1045695,10 21,10.8954305 21,12 C21,13.1045695 20.1045695,14 19,14 Z"></path>
                </g>
                </svg>
            )
        }

        else if (this.props.value === 'bookmark') {
            return (
                <svg height="24px" version="1.1" viewBox="0 0 24 24" width="24px" xmlns="http://www.w3.org/2000/svg" >
                <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1"><g fill="#329bff"><path d="M19,13 L19,10 L20,10 L20,13 L23,13 L23,14 L20,14 L20,17 L19,17 L19,14 L16,14 L16,13 L19,13 L19,13 Z M20,19.9810552 L20,28 L14,22 L8,28 L8,6.99109042 C8,5.34177063 9.34187067,4 10.997152,4 L17.002848,4 C18.6583772,4 20,5.33915679 20,6.99109042 L20,7.01894481 C19.8349792,7.00639146 19.668236,7 19.5,7 C15.9101489,7 13,9.91014895 13,13.5 C13,17.0898511 15.9101489,20 19.5,20 C19.668236,20 19.8349792,19.9936085 20,19.9810552 L20,19.9810552 L20,19.9810552 Z M19.5,19 C22.5375663,19 25,16.5375663 25,13.5 C25,10.4624337 22.5375663,8 19.5,8 C16.4624337,8 14,10.4624337 14,13.5 C14,16.5375663 16.4624337,19 19.5,19 L19.5,19 Z" />
                </g>
                </g>
                </svg >
            )
        }
        
    }

    render() {
        return (
            <button className="quora-button" onClick={this.props.onclick}>
                    {this.renderSVG()}
                    <span style={{ verticalAlign: "top" }}>{" "+this.props.text}</span>
            </button >
        )
    }
}

export default QuoraButton;