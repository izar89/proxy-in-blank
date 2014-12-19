/* globals SC */

function SoundCloud(){
	initClient();
	initSoundbar();
}

function initClient(){
	SC.initialize({
  	client_id: 'bd3361bf40be90ef0b5bdf94c008674c',
  	redirect_uri: ''
	});
}

function initSoundbar(){
	var searchInput = document.querySelector('#soundbar-search input');
	searchInput.addEventListener('blur', keyDownHandler);
	searchInput.addEventListener('onkeydown', keyDownHandler);
}

function keyDownHandler(e){
	console.log(e.keyCode);
	if(e.keyCode === 13 || this.value.length > 3){
		searchSong(this.value);
		console.log('search');
	}
}

function searchSong(value){
	SC.get('/tracks', {q: value}, function(tracks) {
  	console.log(tracks);
	});
}

module.exports = SoundCloud;
