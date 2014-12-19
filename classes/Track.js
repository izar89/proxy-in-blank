function Track(track) {
	this.title = track.title;
	this.artist = track.user.username;
	this.thumb = track.artwork_url;
	this.stream_url = track.stream_url;
	this.duration = Math.round(track.duration / 3600);
	this.position = 0;
}

module.exports = Track;
