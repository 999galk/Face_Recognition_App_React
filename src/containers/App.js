import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Navigation from '../components/Navigation/Navigation';
import Logo from '../components/Logo/Logo';
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm';
import FaceReco from '../components/FaceReco/FaceReco';
import SignIn from '../components/SignIn/SignIn';
import Register from '../components/Register/Register';
import Rank from '../components/Rank/Rank';
import Clarifai from 'clarifai';
import './App.css';

const app = new Clarifai.App({
 apiKey: '2c8dcc1c39c242d284f70ebbb9584cdb'
});

const particlesOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
	constructor(){
		super()
		this.state= {
			input : '',
			imgUrl : '',
			box : {},
			route: 'signin',
			isSignedIn : false
		}
	}

	calFaceLocation = (data) => {
		const face = data.outputs[0].data.regions[0].region_info.bounding_box;
		const image = document.getElementById('inputImg');
		const width = Number(image.width);
		const height = Number(image.height);
		return {
	      leftCol: face.left_col * width,
	      topRow: face.top_row * height,
	      rightCol: width - (face.right_col * width),
	      bottomRow: height - (face.bottom_row * height)
	    }
	}

	displayFaceBox = (box) => {
		this.setState({box : box});
	}

	onInputChange = (event) => {
		console.log(event.target.value);
		this.setState({input : event.target.value});
		return event.target.value;
	}

	onButtonSubmit = () => {
		this.setState({imgUrl : this.state.input});
		app.models.predict(
			Clarifai.FACE_DETECT_MODEL, this.state.input)
			.then(response => this.displayFaceBox(this.calFaceLocation(response))).catch(err => console.log('error reaching clarifai'));
	}

	onRouteChange = (route) => {
		if(route === 'signout'){
			this.setState({isSignedIn : false})
		} else if (route === 'home'){
			this.setState({isSignedIn : true})
		}
		this.setState({route : route});
	}

	render(){
		const { isSignedIn,imgUrl,box,route } = this.state;
	  return (
		    <div className="App">
		    	<Particles className='particles'
          		params={particlesOptions}
        		/>
		    	<Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
		      	{ route === 'home'
		      	? <div>
		      	<Logo />
		      	<Rank />
		      	<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
		   		<FaceReco imgUrl={imgUrl} box={box}/>
		   		</div>
		   		: (
		   			this.state.route === 'signin' 
		   			? <SignIn onRouteChange={this.onRouteChange}/>
		   			: <Register onRouteChange={this.onRouteChange}/>
		   			)
		      	 
		      	}
		    </div>
	  );
	}
}

export default App;
