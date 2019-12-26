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
			isSignedIn : false,
			user : {
				id:'',
				name: '',
				email: '',
				entries : 0,
				joined : ''
			}
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
		this.setState({input : event.target.value});
	}

	onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count}))
            })

        }
        this.displayFaceBox(this.calFaceLocation(response))
      })
      .catch(err => console.log(err));
  	}

  	loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

	onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
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
		      	<Rank name={this.state.user.name} entries={this.state.user.entries}/>
		      	<ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
		   		<FaceReco imgUrl={imgUrl} box={box}/>
		   		</div>
		   		: (
		   			this.state.route === 'signin' || this.state.route === 'signout' 
		   			? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
		   			: <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
		   			)
		      	 
		      	}
		    </div>
	  );
	}
}

export default App;