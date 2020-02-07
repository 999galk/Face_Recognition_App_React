import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
	return(
		<div className='pb4'>
			<p className='f3'>
				{'This magic brain will detect faces in your pictures!'}
			</p>
			<p className='f3'>
				{'Submit an image URL and give it a try!'}
			</p>
			<div className="form center pa4 br3 shadow-5" style={{display:'flex', justifyContent:'center', flexWrap:'wrap'}}>
				<input className="f4 pa1 min70 mt2" type='tex' placeholder='Image link' onChange={onInputChange}/>
				<button className=" grow f4 link ph3 pv2 dib white bg-light-purple mt2" onClick={onButtonSubmit}>Detect!</button>
			</div>
		</div>
	);
}

export default ImageLinkForm;