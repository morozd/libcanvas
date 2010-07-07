(function () {


LibCanvas.Interfaces.Draggable = new Class({
	isDraggable : null,
	dragStart : null,
	returnToStart : function (speed) {
		return this.moveTo(this.dragStart, speed);
	},
	draggable : function (stopDrag) {
		if (this.isDraggable === null) {
			this.bind('canvasSetted', initDraggable.bind(this));
		}
		this.isDraggable = !stopDrag;
		return this;
	}
});

var moveListener = function () {
	if (this.isDraggable && this.prevMouseCoord) {
		var mouse = this.canvas.mouse;
			var move  = this.prevMouseCoord.diff(mouse.dot);
		this.shape.move(move);
		this.bind('moveDrag', [move]);
		this.prevMouseCoord.set(mouse.dot)
	}
};

var initDraggable = function () {
	var dragFn = function () {
		moveListener.call(this);
	}.bind(this);

	var startDrag = ['mousedown'];
	var dragging  = ['mousemove', 'away:mousemove'];
	var stopDrag  = ['mouseup', 'away:mouseup', 'away:mouseout'];

	return this
		.bind(startDrag, function () {
			if (this.isDraggable) {
				this.bind('startDrag');
				this.dragStart = new LibCanvas.Dot(
					this.getCoords()
				);
				this.prevMouseCoord = new LibCanvas.Dot(
					this.canvas.mouse.dot
				);
				this.bind(dragging, dragFn);
			}
		})
		.bind(stopDrag, function () {
			if (this.isDraggable && this.prevMouseCoord) {
				this
					.bind('stopDrag')
					.unbind(dragging, dragFn);
				delete this.prevMouseCoord;
			}
		});
};

})();