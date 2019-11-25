import React, { Component } from 'react';
import './music.css'

const API_ADDRESS = 'https://spotify-api-wrapper.appspot.com'

class Tracks extends Component {
  state = { playing: false, audio: null, playingPreviewUrl: null }

  playAudio = (previewURL) => () => {
    const audio = new Audio(previewURL);
    if(!this.state.playing){
      audio.play();
      this.setState({playing: true, audio, playingPreviewUrl: previewURL})
    } else {
      this.state.audio.pause();
      if(this.state.playingPreviewUrl === previewURL) {
        this.setState({playing: false})
      }else{
        audio.play()
        this.setState({audio, playingPreviewUrl: previewURL})
      }
    }
  }

  trackIcon = track => {
    if(!track.preview_url){
      return <span>N/A</span>
    }
    if(this.state.playing && this.state.playingPreviewUrl === track.preview_url){
      return <span>||</span>
    }
    return <span>&#9654;</span>
  }

  render(){
    const { tracks } = this.props;

    return(
      <div>
        {
          tracks.map( (track)  => {

             const { id, name, album, preview_url} = track;
               console.log('track name ', name, 'track previewURL', preview_url);
             return (
               <div className='track' key={id} onClick={this.playAudio(preview_url)} >
                 <img className='track-image' src={album.images[0].url} alt='track-image'/>
                 <p className='track-text'>{name}</p>
                 <p className='track-icon'>{this.trackIcon(track)}</p>
               </div>

             )
          })


        }

      </div>
    )
  }
}

const Artist = ({artist}) => {
  if(!artist) {
    return null;
  }
  const { images, name, followers, genres } = artist;

  return (
    <div>
      <h3>{name}</h3>
      <p>{followers.total} Followers</p>
      <p>{genres.join(',')}</p>
      <img
        src={images[0].url}
        alt='artist-profile'
        style={{
            width: 200,
            height: 200,
            borderRadius: 100,
            objectFit: 'cover'
        }}
      />
    </div>
  )
}

class Search extends Component {
  state = {
    artistQuery: ''
  }

  updateArtistQuery= (e) => {
    console.log(e.target.value);
    this.setState({ artistQuery: e.target.value })
  }

 //Allow user Enter for search result
  handleKeyPress = (e) => {
    if (e.key === 'Enter'){
      this.searchArtist();
    }
  }

  searchArtist = () => {
    this.props.searchArtist(this.state.artistQuery)
  }
  render(){
    return(
      <div>
        <input
          className="search-field"
          onChange={this.updateArtistQuery}
          onKeyPress={this.handleKeyPress}
          placeholder='Search for an Artist'
        />

        <button
          className="btn-search"
          onClick={this.searchArtist}>
          Search
        </button>
      </div>
    )
  }
}



class MusicMaster extends Component {
  state = {
    artist: null,
    tracks: []
  }

  componentDidMount(){
    this.searchArtist('Shakira')
  }

  searchArtist = (artistQuery) => {
    fetch(`${API_ADDRESS}/artist/${artistQuery}`)
      .then((response) => response.json())
      .then((json) => {
          if (json.artists.total > 0){
            const artist = json.artists.items[0];
            //console.log('artist', artist);
            this.setState({ artist: artist})

            fetch(`${API_ADDRESS}/artist/${artist.id}/top-tracks`)
              .then((response) => response.json())
              .then((json) => this.setState({ tracks: json.tracks}))
              .catch(error => alert(error.message));
          }
      })
      .catch(error => alert(error.message));


  }



  render(){
    console.log('master : ',this.state.tracks);
    return (
      <div>
        <div>
          <h1>Simple Music API</h1>
          <h3>You can play tracks by your favorite artists</h3>
          <Search searchArtist={this.searchArtist}/>
        </div>

        <Artist artist={this.state.artist}/>
        <Tracks tracks={this.state.tracks}/>
      </div>
    )
  }
}

export default MusicMaster;
