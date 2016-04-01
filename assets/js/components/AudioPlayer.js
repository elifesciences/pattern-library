
module.exports = class AudioPlayer {

  constructor($elm) {
    if (!$elm) {
      console.warn('No element provided');
      return;
    }
    else {
      console.log("Initialising Audio Player... ");
    }

    this.$elm = $elm;
    this.$audioElement = this.$elm.querySelector('audio');
    this.$playButton = this.$elm.querySelector('button');
    this.$progressBar = this.$elm.querySelector('[class*="progress_bar"]');
    this.$duration = this.$elm.querySelector('[class*="duration"]');

    if (!this.$audioElement) {
      console.warn('No audio element found');
      return;
    }

    // state
    this.duration;
    this.isPlaying = false;

    // setup
    this.$elm.classList.add('audio-player--js');

    // events
    this.$playButton.addEventListener('click', this.play.bind(this));

    this.$audioElement.addEventListener('loadedmetadata', e => {
      this.duration = this.$audioElement.duration;
      this.$duration.innerHTML = this.secondsToMinutes(this.duration);
    });
    this.$audioElement.addEventListener('timeupdate', this.update.bind(this));
  }

  /**
    secondsToMinutes()
   */
  secondsToMinutes(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = parseInt(seconds % 60);

    return `${mins}:${secs}`;
  }

  /**
    play()
   */
  play() {
    if (this.isPlaying) {
      // pause
      this.$audioElement.pause();

      // update button to play icon.
      this.$playButton.innerHTML = 'play';

      // set the state
      this.isPlaying = false;
    }
    else {
      // play
      this.$audioElement.play();

      // update button to pause icon.
      this.$playButton.innerHTML = 'pause';

      // set the state
      this.isPlaying = true;
    }
  }

  /**
    update()
   */
  update() {
    let pc = (this.$audioElement.currentTime / this.duration) * 100;
    this.$progressBar.style.width = pc+'%';
  }
}
