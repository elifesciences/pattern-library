
module.exports = class ViewerModal {

  constructor($elm) {
    this.$elm = $elm;
    this.$prev = document.createElement('div');
    this.$next = document.createElement('div');

    // build the modal
    this.build();

    // events
    this.$prev.addEventListener('click', this.prev);
    this.$next.addEventListener('click', this.next);
  }

  build() {
    //
  }

  prev(e) {
    e.preventDefault();
  }

  next(e) {
    e.preventDefault();
  }

  close() {
    //
  }
}
