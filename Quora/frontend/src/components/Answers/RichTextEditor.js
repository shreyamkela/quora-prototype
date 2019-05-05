import React, { Component } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
/*
 * Simple editor component that takes placeholder text as a prop 
 */
class RichTextEditor extends Component {
    constructor (props) {
      super(props)
      this.state = { editorHtml: '', theme: 'snow' }
  }
  
  componentDidMount = () => {
    if(this.props.content !== undefined)
    this.setState({
      editorHtml:this.props.content
    })
  }

    handleChange = (html) => {
        this.setState({ editorHtml: html });
        this.props.callChange(this.state.editorHtml)
    }
    
    render () {
      return (
        <div>
            <ReactQuill  
            theme={this.state.theme}
            onChange={this.handleChange}   
            value={this.state.editorHtml}
            modules={RichTextEditor.modules}
            formats={RichTextEditor.formats}
            placeholder={this.props.placeholder}
           />
         </div>
       )
    }
  }
  
  /* 
   * Quill modules to attach to editor
   * See https://quilljs.com/docs/modules/ for complete options
   */
  RichTextEditor.modules = {
    toolbar: [
      ['bold', 'italic'],
      [{'list': 'ordered'}, {'list': 'bullet'}],
      ['link', 'image']
    ],
    clipboard: {
      // toggle to add extra line breaks when pasting HTML:
      matchVisual: false,
    }
  }
  /* 
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
  RichTextEditor.formats = [
    'bold', 'italic', 'list', 'bullet','link', 'image'
]
  
export default RichTextEditor;
  
