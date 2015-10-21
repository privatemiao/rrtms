draw2d.shape.basic.Switch = draw2d.VectorFigure.extend({
	NAME : "draw2d.shape.basic.Switch",
	status : "off",
	init : function(width, height) {
		this.radius = 2;
		this.dasharray = null;
		this._super();
		this.setBackgroundColor(new draw2d.util.Color("#00ff00"));
		this.setColor("#1B1B1B");
		if (typeof width === "undefined") {
			this.setDimension(20, 30);
		} else {
			this.setDimension(width, height);
		}
	},
	repaint : function(attributes) {
		if (this.repaintBlocked === true || this.shape === null) {
			return;
		}
		if (typeof attributes === "undefined") {
			attributes = {};
		}
		if (this.dasharray !== null) {
			attributes["stroke-dasharray"] = this.dasharray;
		}
		attributes.width = this.getWidth();
		attributes.height = this.getHeight();
		attributes.r = this.radius;
		this._super(attributes);
	},
	applyTransformation : function() {
		this.shape.transform("R" + this.rotationAngle);
		if (this.getRotationAngle() === 90 || this.getRotationAngle() === 270) {
			var ratio = this.getHeight() / this.getWidth();
			var rs = "...S" + ratio + "," + 1 / ratio + "," + (this.getAbsoluteX() + this.getWidth() / 2) + "," + (this.getAbsoluteY() + this.getHeight() / 2);
			this.shape.transform(rs);
		}
	},
	createShapeElement : function() {
		return this.canvas.paper.rect(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight());
	},
	setRadius : function(radius) {
		this.radius = radius;
		this.repaint();
	},
	getRadius : function() {
		return this.radius;
	},
	setDashArray : function(dash) {
		this.dasharray = dash;
	},
	getPersistentAttributes : function() {
		var memento = this._super();
		memento.radius = this.radius;
		return memento;
	},
	setPersistentAttributes : function(memento) {
		this._super(memento);
		if (typeof memento.radius === "number") {
			this.radius = memento.radius;
		}
	},
	on : function() {
		this.setBackgroundColor(new draw2d.util.Color("#ff0000"));
		this.status = "on";
	},

	off : function() {
		this.setBackgroundColor(new draw2d.util.Color("#00ff00"));
		this.status = "off";
	},
	switchStatus : function(){
		if (this.status != "on"){
			this.on();
		}else{
			this.off();
		}
	}
});
