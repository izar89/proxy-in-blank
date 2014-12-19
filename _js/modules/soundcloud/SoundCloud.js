/* globals SC */

var result, currentTracks, socket;

function SoundCloud() {
	initClient();
	initSocket();
}

function initClient() {
	SC.initialize({
		client_id: 'bd3361bf40be90ef0b5bdf94c008674c',
		redirect_uri: ''
	});
}

function initSocket() {
	socket = io('/');
	initSoundbar();
	socket.addEventListener('currentTrack', currentTrackHandler, false);
}

function initSoundbar() {
	var searchInput = document.querySelector('#soundbar-search input');
	searchInput.addEventListener('keyup', keyUpHandler);

	result = document.querySelector('#search-results');
}

function keyUpHandler(e) {
	if (e.keyCode === 13 || this.value.length >= 3) {
		searchSong(this.value);
	}
}

function searchSong(value) {
	SC.get('/tracks', {
		q: value,
		limit: 5
	}, function(tracks, error) {
		showTracks(tracks);
	});
}

function showTracks(tracks) {
	result.innerHTML = '';
	currentTracks = [];
	if(tracks.length > 0) {
		for (var i = 0; i < tracks.length; i++) {
			var li = document.createElement('li');
			li.innerHTML = tracks[i].title + '<br />' + tracks[i].user.username;
			li.addEventListener('click', selectTrackHandler, false);
			result.appendChild(li);
			currentTracks.push(tracks[i]);
			li.setAttribute('data-id', i);
		}
	} else {
		result.innerHTML = '<li>Couldn\'t find any matching tracks :(</li>';
	}
}

function selectTrackHandler(e) {
	var curTrack = currentTracks[e.currentTarget.getAttribute('data-id')];
	socket.emit('selected_track', curTrack);
}

function currentTrackHandler(track) {
	var thumb = document.querySelector('#song .thumb');
	var title = document.querySelector('#song .title');
	var artist = document.querySelector('#song .artist');
	thumb.innerHTML = '<img src="'+ track.thumb +'" alt="thumb" />';
	title.innerHTML = track.title;
	artist.innerHTML = track.artist;

	var audio = document.querySelector('#track');
	audio.setAttribute('src', track.stream_url +'?client_id=bd3361bf40be90ef0b5bdf94c008674c');
	audio.play(track.position);
}

module.exports = SoundCloud;