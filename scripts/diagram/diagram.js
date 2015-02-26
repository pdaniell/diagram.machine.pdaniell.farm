'use strict';
/**
 *  
 * The diagram library is a high level API based upon the KineticJS
 * HTML canvas library. 
 *
 * @author Paul Daniell <paul.d@mm.st>
 *
 **/

define(["jquery", "underscore", "backbone", "kinetic", "constants",
        "diagram/diagramconstants" ],
function($, _, Backbone, Kinetic, Constants, DiagramConstants) {
	
	
	var Diagram = {}; 
	
	// Diagram Base Class
	// ------------------
	//
	// The base class serves as an entry point into the library. 
	// Likely it should never be constructed alone.

	var Base = Diagram.Base = function(attributes, options){//};
		this.attributes = attributes; 
		this.options = options; 
	};
	
	// Diagram Element Class
	// ---------------------
	//
	// The element class allows high level objects to be constructed
	// for elements of a machine diagram. 
	//
	
	var Element = Diagram.Element = function(attributes, options){ 
		Diagram.Base.call(this, attributes, options); 
		
		this.getId =  function(){ 
			return this.id; 
		}; 
	
		this.getX =  function(){ 
			return this.x; 
		};  
		
		this.getY = function(){
			return this.y; 
		};  
		
		this.getWidth = function(){
			return this.width; 
		}; 
		
		this.getHeight = function(){
			return this.height; 
		}; 
		
		this.setId = function(id){
			this.id = id; 
		};  
		
		this.setX = function(x){
			this.x = x;
		};  
		
		this.setY =  function(y){
			this.y = y; 
		};  
		
		this.setWidth = function(width){
			this.width = width; 
		}; 
		
		this.setHeight = function(height){
			this.height = height; 
		}; 
		
		this.draw = function(){
			this.getElement().getLayer().draw(); 
		}; 
		
		this.getElement = function() { 
			return this.element; 
		}; 
		
		
		// Constructor
		
		var id = this.id = this.attributes.id;  				
		var x = this.x = this.attributes.x;
		var y = this.y = this.attributes.y; 
		var width = this.width = this.attributes.width; 
		var height = this.height = this.attributes.height; 
		
		var element = this.element = null; 
		

		
	}; 

	
	// GroupElement class
	// ------------------
	//
	// The group element class allows us to describe 
	// graphical diagram objects which are composed of many
	// other more basic Kinetic objects. Most of the  primary objects
	// in the diagram extend the GroupElement class. 
	
	
	Diagram.GroupElement = function(attributes, options){
		Diagram.Element.call(this, attributes, options); 
		
		this.getGroup = function(){ 
			return this.group; 
		};
		
		this.setGroup = function(group){
			this.group = group; 
		}; 

		this.getElement = function(){
			return this.getGroup(); 
		};
		
		// Constructor 
		
		var group = this.group = new Kinetic.Group({
			id: this.getId(), 
			x: this.getX(), 
			y:this.getY()
		});
		
		this.element = this.group; 
	}; 
	
	
	// ControlPoint class 
	// ------------------
	//
	// A control point is a rectangle (usually a square)
	// used to control some functionality in the diagram. 
	
	var ControlPoint = Diagram.ControlPoint = function(attributes, options){
		Diagram.Element.call(this, attributes, options); 
		
		// Methods 
		
		this.getRectangle =  function(){ 
			return this.element; 
		};
		
		this.getCardinalPosition = function(){
			return this.cardinalPosition; 
		}; 
		
		this.toggleSelect = function(){ 
			if(this.isSelected == true){ 
				this.rectangle.setFill(this.fill); 
				this.rectangle.draw();
				this.isSelected = false; 
			}  else{ 
				this.isSelected = true; 
				this.rectangle.setFill(this.mouseclickFill); 
				this.rectangle.draw();
					
			}
			
		};
		
		
		
		//Constructor 

		var xRule = this.xRule = this.attributes.xRule; 
		
		var yRule = this.yRule = this.attributes.yRule; 
		
		var width = this.width = this.attributes.width 
			|| DiagramConstants.CONTROLPOINT_DEFAULT_WIDTH; 
		
		var height = this.height = this.attributes.height
			|| DiagramConstants.CONTROLPOINT_DEFAULT_HEIGHT;
		
		var fill = this.fill = this.attributes.fill
			|| DiagramConstants.CONTROLPOINT_DEFAULT_FILL;
		
		var mouseoverFill = this.mouseoverFill = this.attributes.mouseoverFill 
			|| DiagramConstants.CONTROLPOINT_DEFAULT_MOUSEOVERFILL; 
		
		var mouseclickFill = this.mouseclickFill = this.attributes.mouseclickFill 
			|| DiagramConstants.CONTROLPOINT_DEFAULT_MOUSECLICKFILL; 
	
		var stroke = this.stroke = this.attributes.stroke 
			|| DiagramConstants.CONTROLPOINT_DEFAULT_STROKE; 
	
		var strokeWidth = this.strokeWidth = this.attributes.strokeWidth
			|| DiagramConstants.CONTROLPOINT_DEFAULT_STROKEWIDTH; 
		
		var isSelected = this.isSelected = this.attributes.isSelected == false; 
		

		var visible = this.visible = this.attributes.visible !== false; 
		
		
		var rectangle = this.rectangle = new Kinetic.Rect({
			id: this.id, 
			y: this.yRule(this.y, this.height), 
			x: this.xRule(this.x,this.width),
			width: this.width, 
			height: this.height, 
			fill: this.fill, 
			stroke: this.stroke, 
			strokeWidth: this.strokeWidth,
			visible: this.visible
			
		});
		
		this.element = this.rectangle; 
		
		this.rectangle.controlPoint = this; 
		
		// Event Listeners
		
		this.rectangle.on(Constants.Events.MOUSEOVER, function(event){
			if(this.controlPoint.isSelected == true){
				return; 
			}
			
			this.setFill(mouseoverFill); 
			this.draw();
			this.hasMouseOver = true; 
		});
		
		this.rectangle.on(Constants.Events.MOUSEOUT, function(event){
			if(this.controlPoint.isSelected == true){ 
				return; 
			} 
			
			this.setFill(fill); 
			this.draw();
			this.hasMouseOver = false; 
		});
		
		
		this.rectangle.on(Constants.Events.CLICK, function(event){
			this.controlPoint.toggleSelect(); 
		});
		
		
	};
	
	
	// Vertex Class
	// ------------
	//
	// This class is a group element which renders
	// a vertex in a finite state diagram.
	//
	// It is composed of two circles (an inner circle
	// and an outer circle), cardinally oriented control points,  
	// and a label for the vertex. Most of the attributes for a vertex
	// have reasonable default values; the x, y values and label
	// must be provided. 
	
	var Vertex = Diagram.Vertex = function(attributes, options){ 
		Diagram.GroupElement.call(this, attributes, options); 

		// Methods
		
		this.setSelectionBorder = function(visible){ 
			this.boundingRectangle.setVisible(visible); 
			this.group.getStage().draw(); 
		}; 
		
		this.toggleStartIndicator = function(){ 
			var b = ! this.startIndicatorVisible; 
			this.setStartIndicator(b); 
		}, 
		
		this.setStartIndicator = function(startIndicatorVisible){
			this.startIndicatorVisible = startIndicatorVisible;
			this.startIndicator.setVisible(startIndicatorVisible);
			this.group.getStage().draw(); 
		}, 
		
		this.toggleDoubleStroke = function(){ 
			var b = ! this.doubleStroke; 
			this.setDoubleStroke(b); 
		}, 
		
		
		this.setDoubleStroke = function(doubleStroke){
			
			this.doubleStroke = doubleStroke; 
			
			
			var tempInnerStroke; 
			var tempInnerStrokeWidth; 
			var tempOuterFill; 
			
			if(this.doubleStroke == false){
				tempInnerStroke = this.innerFill;
				tempInnerStrokeWidth = 0;  
				tempOuterFill = this.innerFill; 
			} else{ 
				tempInnerStroke = this.innerStroke; 
				tempInnerStrokeWidth = this.innerStrokeWidth;
				tempOuterFill = this.outerFill; 
			} 
			
			
			
			
			this.outerCircle.setFill(tempOuterFill);
			this.innerCircle.setStroke(tempInnerStroke); 
			this.innerCircle.setStrokeWidth(tempInnerStrokeWidth);
			
			this.group.draw(); 
			
			
		}, 
		
		this.setStrokeWidth = function(width){
			this.outerCircle.setStrokeWidth(width); 
			this.draw(); 
		};
		
		this.setColor = function(color) {
			if(this.doubleStroke == false){
				this.innerCircle.setFill(color); 
				this.innerCircle.setStroke(color); 
				this.outerCircle.setFill(color); 
				this.draw();
				
			}else {
				this.innerCircle.setFill(color); 
				this.innerCircle.setStroke(color); 
				this.draw();
			}
		}; 
		
		
		this.toggleControlPoints = function(b){ 
			
			for(var i = 0; i < this.controlPoints.length; i++){
				var cp = this.controlPoints[i];
				if(cp.isSelected == false){
					cp.getElement().setVisible(b);
				}
			};
			this.draw(); 
			
			this.controlPointsVisible = b; 
		}; 
		
		
		// Constructor 
		
		// As is conventional in this software we begin by setting
		// the default values of all default variables. 
		
		var label = this.label = this.attributes.label; 
		
		var controlPointsVisible = this.controlPointsVisible = 
				this.attributes.controlPointsVisible; 
		
		var width = this.width = this.attributes.width 
			|| DiagramConstants.VERTEX_DEAFULT_WIDTH; 
		
		var height = this.height = this.attributes.height 
			|| DiagramConstants.VERTEX_DEFAULT_HEIGHT; 
		
		var innerFill = this.innerFill = this.attributes.innerFill
			|| DiagramConstants.VERTEX_DEFAULT_INNERFILL; 
		
		var innerStroke = this.innerStroke = this.attributes.innerStroke 
			|| DiagramConstants.VERTEX_DEFAULT_INNERSTROKE; 
		
		var innerStrokeWidth = this.innerStrokeWidth = this.attributes.innerStrokeWidth
			|| DiagramConstants.VERTEX_DEFAULT_INNERSTROKEWIDTH; 
		
		var outerFill = this.outerFill = this.attributes.outerFill
			|| DiagramConstants.VERTEX_DEFAULT_OUTERFILL; 
		
		var outerStroke = this.outerStroke = this.attributes.outerStroke 
			|| DiagramConstants.VERTEX_DEFAULT_OUTERSTROKE; 
	
		var outerStrokeWidth = this.outerStrokeWidth = this.attributes.outerStrokeWidth
			|| DiagramConstants.VERTEX_DEFAULT_OUTERSTROKEWIDTH; 
		
		var draggable = this.draggable = this.attributes.draggable 
			|| DiagramConstants.VERTEX_DEFAULT_DRAGGABLE; 
		
		var doubleStroke = this.doubleStroke = this.attributes.doubleStroke 
			|| DiagramConstants.VERTEX_DEFAULT_DOUBLESTROKE;

		var startIndicatorVisible = this.startIndicatorVisible = this.attributes.startIndicatorVisible
		|| DiagramConstants.VERTEX_DEFAULT_STARTINDICATORVISIBLE;
		
		var innerCircleDelta = this.innerCircleDelta = this.attributes.innerCircleXDelta 
			|| DiagramConstants.VERTEX_DEFAULT_INNERCIRCLE_DELTA; 
		
		// Set the group wide draggable property. 
		
		this.group.setDraggable(this.draggable);
		
		
		// We first set up a bounding rectangle
		
		this.boundingRectangle = new Kinetic.Rect({
			id: this.getId() + "-" + "boundrect", 
			y: -((this.height+15)/2), 
			x: -((this.width+15)/2),
			width: this.width+ 15, 
			height: this.height + 15, 
			stroke:"#000", 
			visible: false, 
			strokeWidth: 1
		});
		
		
		
		 this.boundingRectangle.checkCollide = function(pointX, pointY) { // pointX, pointY belong to one rectangle, while the object variables belong to another rectangle
		      var oTop = this.getAbsolutePosition().y;
		      var oLeft = this.getAbsolutePosition().x;
		      var oRight = oLeft+ this.getWidth();
		      var oBottom = oTop+ this.getHeight(); 

		     
		      if(pointX > oLeft && pointX < oRight){
		           if(pointY > oTop && pointY < oBottom ){
		                return true;
		               
		           }
		      }
		      else {
		           return false;
		           
		      }
		 };
		this.boundingRectangle.vertex = this; 
		this.group.add(this.boundingRectangle); 
		
		
		// In a diagram a double stroked vertex means that the vertex
		// represents an accepting state 
		
		var tempInnerStroke; 
		var tempInnerStrokeWidth; 
		var tempOuterFill; 
		
		if(this.doubleStroke == false){
			tempInnerStroke = this.innerFill;
			tempInnerStrokeWidth = 0;  
			tempOuterFill = this.innerFill; 
		} else{ 
			tempInnerStroke = this.innerStroke; 
			tempInnerStrokeWidth = this.innerStrokeWidth;
			tempOuterFill = this.outerFill; 
		} 
		
		
		

		
		
		// Draw the outer circle
		this.outerCircle = new Kinetic.Circle({
			id: this.getId() + "-" + "outercircle", 
			width:this.width,  
			height: this.height, 
			fill: tempOuterFill, 
			stroke: this.outerStroke, 
			strokeWidth: this.outerStrokeWidth
			
		}); 
		
		this.outerCircle.vertex = this; 

		//this.outerCircle.on(Constants.Events.MOUSELEAVE, function(event){
		//	this.vertex.toggleControlPoints();  
		//}); 
		
		this.group.add(this.outerCircle);
	
		// Draw the inner circle
		this.innerCircle = new Kinetic.Circle({
			id: this.getId() + "-" + "innercircle",
			width: this.width - this.innerCircleDelta,  
			height: this.height - this.innerCircleDelta, 
			fill: this.innerFill, 
			stroke: tempInnerStroke,
			strokeWidth: tempInnerStrokeWidth
			
		}); 
		
		this.innerCircle.vertex = this; 
		
		this.group.vertex = this; 
		
		this.group.add(this.innerCircle);		
		
		var controlPoints = this.controlPoints = []; 
		
		// We initialize the control points at the cardinal points
		// along the vertex; the xRule and yRule functions
		// are used to establish the position of the ControlPoint
		// relative to the group. Hence the variables
		// height and width indicate the height and width of the 
		// group. The variables __height and __width indicate
		// the dimensions of the control point. 
		
		
		 this.controlPoints[DiagramConstants.NORTH] = new Diagram.ControlPoint({
			id: this.getId() + "-" + "cp" + "-" + "north",
			yRule: function(__y, __height){ return -(height/2) - (__height/2); },
			xRule: function(__x, __width){ return -(__width/2); }, 
			visible: false
				
		});
		
		this.controlPoints[DiagramConstants.SOUTH] = new Diagram.ControlPoint({
			id: this.getId() + "-" + "cp" + "-" + "south",
			yRule: function(__y, __height){ return (height/2) - (__height/2); },
			xRule: function(__x, __width){ return -(__width/2); },
			visible: false
		}); 

		
		this.controlPoints[DiagramConstants.EAST] = new Diagram.ControlPoint({
			id: this.getId() + "-" + "cp" + "-" + "east",
			yRule: function(__y, __height){ return -(__height/2); },
			xRule: function(__x, __width){ return (width/2) - (__width/2); },
			visible: false
		});
		
		this.controlPoints[DiagramConstants.WEST] = new Diagram.ControlPoint({
			id: this.getId() + "-" + "cp" + "-" + "west",
			yRule: function(__y, __height){ return -(__height/2); },
			xRule: function(__x, __width){ return -(width/2) - (__width/2); }, 
			visible: false
		
		});
		
		
	
		for(var i = 0; i< controlPoints.length ; i++){			
			this.group.add(this.controlPoints[i].getElement());
			this.controlPoints[i].vertex = this; 
			this.controlPoints[i].getElement().vertex = this; 
			
			this.controlPoints[i].cardinalPosition = i; 
		} 
		
		
		// Finally add the label text. 

		this.labelText  = new Kinetic.Text({
			id: this.getId() + "-" + "label",
            x: DiagramConstants.VERTEX_DEFAULT_LABEL_X, 
            y: DiagramConstants.VERTEX_DEFAULT_LABEL_Y,
            fill: DiagramConstants.VERTEX_DEFAULT_LABEL_FILL,
            fontFamily: DiagramConstants.VERTEX_DEFAULT_LABEL_FONT,
            fontStyle:  DiagramConstants.VERTEX_DEFAULT_LABEL_FONTSTYLE, 
            fontSize:  DiagramConstants.VERTEX_DEFAULT_LABEL_FONTSIZE,
            text: this.label
		});
		
		this.labelText.vertex = this; 

		this.group.add(this.labelText); 
		
		
		
		this.startIndicator = new Kinetic.Polygon({
			id: this.getId() +  "-" + "start", 
			points: [ {x: (-Math.sqrt(2)/2) * this.width/2, y:(-Math.sqrt(2)/2) * this.width/2},
			          {x: ((-Math.sqrt(2)/2) * this.width/2)- DiagramConstants.VERTEX_DEFAULT_START_RADIUS, y:(-Math.sqrt(2)/2) * this.width/2},
			          {x: ((-Math.sqrt(2)/2) * this.width/2), y:((-Math.sqrt(2)/2) * this.width/2) -DiagramConstants.VERTEX_DEFAULT_START_RADIUS}],
			
			fill: DiagramConstants.VERTEX_DEFAULT_START_COLOR, 
			visible: this.startIndicatorVisible
			
		}); 
		
		this.startIndicator.vertex = this; 
		this.group.add(this.startIndicator); 
		
		
		//Event Listener
		
		this.group.on("mouseenter", function(event){
			var srcGroup = event.targetNode.vertex; 

			
			if (srcGroup.controlPointsVisible == true){
				return; 
			} 
			srcGroup.toggleControlPoints(true); 
		}); 
		
		this.group.on("mouseleave", function(event){
			var srcGroup = event.targetNode.vertex;
			var st = event.targetNode.getStage(); 
			var point = {x: st.getPointerPosition().x, y:st.getPointerPosition().y}; //{x: event.layerX, y: event.layerY}; 
			srcGroup.toggleControlPoints(false);
		}); 
		
		
	};
	
	var ControlPointContactFactory = Diagram.ControlPointContactFactory = { 
	
		getControlPointContact: function(controlPoint){
			
			var pos = null; 
			if(controlPoint.getCardinalPosition() == DiagramConstants.NORTH){
				var x = controlPoint.getElement().getAbsolutePosition().x
					+ (controlPoint.getElement().getWidth()/2); 
				
				var y = controlPoint.getElement().getAbsolutePosition().y
					- (controlPoint.getElement().getHeight()/2);
				
				pos = {x:x, y:y}; 
			}

			
			if(controlPoint.getCardinalPosition() == DiagramConstants.SOUTH){
				var x = controlPoint.getElement().getAbsolutePosition().x
					+ (controlPoint.getElement().getWidth()/2); 
				
				var y = controlPoint.getElement().getAbsolutePosition().y
					+ (controlPoint.getElement().getHeight());
				
				pos = {x:x, y:y}; 
			}
			
			if(controlPoint.getCardinalPosition() == DiagramConstants.EAST){
				var x = controlPoint.getElement().getAbsolutePosition().x
					+ (controlPoint.getElement().getWidth()); 
				
				var y = controlPoint.getElement().getAbsolutePosition().y
					+ (controlPoint.getElement().getHeight()/2);
				
				pos = {x:x, y:y}; 
			}

			if(controlPoint.getCardinalPosition() == DiagramConstants.WEST){
				var x = controlPoint.getElement().getAbsolutePosition().x; 
				
				var y = controlPoint.getElement().getAbsolutePosition().y
					+ (controlPoint.getElement().getHeight()/2);
				
				pos = {x:x, y:y}; 
			}
			
			return pos; 
			
		}
	}; 
	
	var ArcPointFactory = Diagram.ArcPointFactory = {
			
			getManhattanArcPoints: function(startPoint, endPoint, options){
				
				var opts = options || {}; 
				
				var startVertexWidth = startPoint.vertex.getWidth(); 
				var endVertexWidth = endPoint.vertex.getWidth(); 
				
				var startContactPoint =
					Diagram.ControlPointContactFactory.getControlPointContact(startPoint);
				
				var endContactPoint =
					Diagram.ControlPointContactFactory.getControlPointContact(endPoint);
				
				
				var startCard = startPoint.getCardinalPosition(); 
				
				var startX = startContactPoint.x; 

				var startY = startContactPoint.y; 
				
				
				var endX = endContactPoint.x; 

				var endY = endContactPoint.y; 

				var endCard = endPoint.getCardinalPosition(); 
		
				var points = []; 
				var padding = opts.padding 
					|| DiagramConstants.ARC_DEFAULT_MH_PADDING; 
				
				points[0] = {x: startX, y: startY}; 
				
				//  North -> North
				// ------------------------------------------------------
				
				if(startCard == DiagramConstants.NORTH
						&& endCard == DiagramConstants.NORTH) {
					if (startY < endY) {
						// start node is above the end node
						// go up by the padded amount
						points[1] = {x:points[0].x, 
									y: points[0].y 
									- padding};

					} else {
						// start node is below the end node
						// go up to the level of the end node
						// and add some padding
						points[1] = {x: points[0].x, 
									y: endY - padding};
						
					}
					
					// now shift to the x position
					// of the end point 
					points[2] = {x: endX, y: points[1].y}; 
					
					//end the arc
					points[3] = {x:endX, y: endY}; 
						
				}
				
				//  North -> South
				// ------------------------------------------------------
				if (startCard == DiagramConstants.NORTH &&
							endCard == DiagramConstants.SOUTH) { 
					if(endY < startY - padding*2 ){ //(startVertexWidth/2)){
							
						// the end node is above the the start node
						
						// adding the additional term padding*2
						// ensures that the end node is sufficiently above
						// for the vertical padding in the arc to be visible. 
						
						// move along the y-axis 
						// until you reach the end ycoord
						// adding some padding
						points[1] = {x: points[0].x, y: endY + padding}; 
						
						//move along the x-axis until you reach
						// end X 
						points[2] = {x:endX, y: points[1].y}; 
						
						// end the arc
						points[3] = {x: endX, y: endY}; 
					} else {
						// the end node is below the start node
						
						points[1] = {x: points[0].x, y: points[0].y - padding}; 
						
						if(startX > endX){
							// the end node is to the left
							points[2] = {x: points[1].x - (startVertexWidth/2 +padding), 
									y: points[1].y}; 
							
						} else {
							// the end node is to the tight
							points[2] = {x: points[1].x + (startVertexWidth/2 + padding), 
									y: points[1].y}; 
						}
						
						// now move down
						
						points[3] = {x: points[2].x, y: endY + padding}; 
						
						// move left
						points[4] = {x: endX, y: endY + padding}; 
						
						//vend arc
						points[5] = {x: endX, y: endY}; 
					}
				}
			
				// North -> East
				// ----------------------------------------------------
				if (startCard == DiagramConstants.NORTH &&
						(endCard == DiagramConstants.EAST )  ) {
					
					if(endY < startY - padding*2){
						// the east node is above the north start node
						
						 if (endX < startX){
							// the east node is to the left of north node
						
							points[1] = {x: points[0].x, y: endY}; 
							points[2] =  {x: endX, y:endY};
							 
						} else{ 
							points[1] = {x: points[0].x, y: points[0].y - padding }; 
							points[2] = {x: endX + padding, y:points[1].y};
							points[3] = {x: endX + padding, y: endY}; 
							points[4] = {x: endX, y: endY}; 
						} 
						
					} else {
						//the east node is below the north node
						//if (endX < startX ){
							points[1] = {x: points[0].x, y: points[0].y - padding};
							points[2] = {x: endX + padding, y: points[1].y};
							points[3] = {x: endX + padding, y: endY};
							points[4] = {x: endX , y: endY};
						//} else {
							
						//}
						
					}
					
				}
				
				
				// North -> West
				// ----------------------------------------------------
				if (startCard == DiagramConstants.NORTH &&
						(endCard == DiagramConstants.WEST )  ) {
					if(endY  < startY - padding * 2){ 
						//the west node is above the north node
						if(endX < startX){
							points[1] = {x: points[0].x, y: points[0].y - padding }; 
							points[2] = {x: endX - padding, y:points[1].y};
							points[3] = {x: endX - padding, y: endY}; 
							points[4] = {x: endX, y: endY}; 
						} else {
							points[1] = {x: points[0].x, y: endY}; 
							points[2] =  {x: endX, y:endY};
						}
					}else{ 
						points[1] = {x: points[0].x, y: points[0].y - padding};
						points[2] = {x: endX - padding, y: points[1].y};
						points[3] = {x: endX - padding, y: endY};
						points[4] = {x: endX , y: endY};
					}
				}
				
				
				// South -> North
				// ----------------------------------------------------
				if (startCard == DiagramConstants.SOUTH &&
						(endCard == DiagramConstants.NORTH )  ) {
					if(endY < startY + padding * 2){ 
						// the north node is above the south node
						points[1] = {x: points[0].x, y: points[0].y + padding};
						

						if(startX > endX){
								// the end node is to the left
								points[2] = {x: points[1].x - (startVertexWidth/2 +padding), 
										y: points[1].y}; 
								
						} else {
								// the end node is to the tight
							points[2] = {x: points[1].x + (startVertexWidth/2 + padding), 
										y: points[1].y}; 
						}
							
						// now move down
						
						points[3] = {x: points[2].x, y: endY - padding}; 
						
						// move left
						points[4] = {x: endX, y: endY - padding}; 
						
						//vend arc
						points[5] = {x: endX, y: endY}; 
						
						
						
					} else {
						
						points[1] = {x: points[0].x, y: points[0].y + padding};
						points[2] = {x: endX, y: points[1].y};
							
						points[3] = {x: endX, y: endY};
						
					}
					
				}
					
					
				// South -> South
				// ----------------------------------------------------
				if (startCard == DiagramConstants.SOUTH &&
						(endCard == DiagramConstants.SOUTH )  ) {
					if (startY > endY) {
						// start node is below the end node
						points[1] = {x:points[0].x, 
									y: points[0].y 
									+ padding};

					} else {
						// start node is below the end node
						// go up to the level of the end node
						// and add some padding
						points[1] = {x: points[0].x, 
									y: endY + padding};
						
					}
					
					// now shift to the x position
					// of the end point 
					points[2] = {x: endX, y: points[1].y}; 
					
					//end the arc
					points[3] = {x:endX, y: endY}; 
				}
				
				// South -> East
				// ----------------------------------------------------
				if (startCard == DiagramConstants.SOUTH &&
						(endCard == DiagramConstants.EAST )  ) {
					if(endY < startY - padding*2){

							points[1] = {x: points[0].x, y: points[0].y + padding }; 
							points[2] = {x: endX + padding, y:points[1].y};
							points[3] = {x: endX + padding, y: endY}; 
							points[4] = {x: endX, y: endY}; 
						
					} else {
						//the east node is below the north node
						//if (endX < startX ){
							points[1] = {x: points[0].x, y: points[0].y + padding};
							points[2] = {x: endX + padding, y: points[1].y};
							points[3] = {x: endX + padding, y: endY};
							points[4] = {x: endX , y: endY};
						//} else {
							
						//}
						
					}
					
				}
				
				// South -> West
				// ----------------------------------------------------
				if (startCard == DiagramConstants.SOUTH &&
						(endCard == DiagramConstants.WEST )  ) {
					if(endY < startY - padding*2){

							points[1] = {x: points[0].x, y: points[0].y + padding }; 
							points[2] = {x: endX - padding, y:points[1].y};
							points[3] = {x: endX - padding, y: endY}; 
							points[4] = {x: endX, y: endY}; 
						
					} else {
						//the east node is below the north node
						points[1] = {x: points[0].x, y: points[0].y + padding};
						points[2] = {x: endX - padding, y: points[1].y};
						points[3] = {x: endX - padding, y: endY};
						points[4] = {x: endX , y: endY};
						
					}
					
				}
				
				// East -> North
				// ----------------------------------------------------
				if (startCard == DiagramConstants.EAST &&
						(endCard == DiagramConstants.NORTH)  ) {
				
					points[1] = {x: points[0].x +padding, y: points[0].y}; 
					
					if(endY < startY - padding*2){
						// the north node is above the east start node
						
						 if (endX < startX){
							// the north node is to the left of east node
							points[2] = {x: points[1].x, y: endY - padding}; 
							points[3] =  {x: endX, y:points[2].y};
							points[4] =  {x: endX, y:endY};
							 
						} else{ 
							points[2] = {x: points[1].x, y:endY - padding};
							
							points[3] = {x: endX, y:endY - padding};
							
							points[4] = {x: endX, y: endY}; 
						} 
						
					} else {
						//the north node is below the below node
							
							points[2] = {x: points[1].x , y: endY - padding};
							points[3] = {x: endX, y: endY -padding};
							points[4] = {x: endX , y: endY};
						
					}
					
				}
				
				
				// East -> South
				// ----------------------------------------------------
				if (startCard == DiagramConstants.EAST &&
						(endCard == DiagramConstants.SOUTH)  ) {
				
					points[1] = {x: points[0].x +padding, y: points[0].y}; 
					
					if(endY < startY - padding*2){
						// the south node is above the east node
						
						 if (endX < startX){
							// the south node is to the left of east node
							points[2] = {x: points[1].x, y: endY + padding}; 
							points[3] =  {x: endX, y:points[2].y};
							points[4] =  {x: endX, y:endY};
							 
						} else{ 
							points[2] = {x: points[1].x, y:endY + padding};
							
							points[3] = {x: endX, y:endY + padding};
							
							points[4] = {x: endX, y: endY}; 
						} 
						
					} else {
						//the south node is below the below node
							
							points[2] = {x: points[1].x , y: endY + padding};
							points[3] = {x: endX, y: endY + padding};
							points[4] = {x: endX , y: endY};
						
					}
					
				}
				
				
				// East -> East
				// ----------------------------------------------------
				if (startCard == DiagramConstants.EAST &&
						(endCard == DiagramConstants.EAST)  ) {
			
						
					if(endX < startX){ 
						// the end node is to the left of the start node
						points[1] = {x: points[0].x +padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY }; 
						
						points[3] = {x: endX, y: points[2].y}; 
						

						
					} else { 
						points[1] = {x:  endX +padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY }; 
						
						points[3] = {x: endX, y: points[2].y}; 
						

					}
						
										
				}
				
				
				// East -> West
				// ----------------------------------------------------
				if (startCard == DiagramConstants.EAST &&
						(endCard == DiagramConstants.WEST)  ) {
						
					if(endX < startX){ 
						// the end node is to the left of the start node
						points[1] = {x: points[0].x +padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY + endVertexWidth}; 
						
						points[3] = {x: endX - padding, y: points[2].y}; 
						
						points[4] = {x: points[3].x, y: endY}; 
						
						points[5] = {x: endX, y: endY};
						
					} else { 
						points[1] = {x:  endX - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY }; 
						
						points[3] = {x: endX, y: points[2].y}; 
					}
				}
				
				
				// West -> North
				// ----------------------------------------------------
				if (startCard == DiagramConstants.WEST &&
						(endCard == DiagramConstants.NORTH)  ) {
					
					if(endX < startX){ 
						// the end node is to the left of the start node
						points[1] = {x: points[0].x - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY - padding}; 
						
						points[3] = {x: endX, y: points[2].y}; 
						
						points[4] = {x: endX, y: endY};
						
					} else { 
						points[1] = {x:  points[0].x - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY-padding }; 
						
						points[3] = {x: endX, y: points[2].y}; 
						
						points[4] = {x: endX, y: endY};
					}
					
				}
				
				
				// West -> South
				// ----------------------------------------------------
				if (startCard == DiagramConstants.WEST &&
						(endCard == DiagramConstants.SOUTH)  ) {
					
					if(endX < startX){ 
						// the end node is to the left of the start node
						points[1] = {x: points[0].x - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY + padding}; 
						
						points[3] = {x: endX, y: points[2].y}; 
						
						points[4] = {x: endX, y: endY};
						
					} else { 
						points[1] = {x:  points[0].x - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY + padding }; 
						
						points[3] = {x: endX, y: points[2].y}; 
						
						points[4] = {x: endX, y: endY};
					}
					
				}
				
				
				// West -> East
				// ----------------------------------------------------
				if (startCard == DiagramConstants.WEST &&
						(endCard == DiagramConstants.EAST)  ) {
					
					if(endX < startX){ 
						// the end node is to the left of the start node
						points[1] = {x: points[0].x - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY }; 
						
						points[3] = {x: endX, y: endY }; 
						
					} else { 
						points[1] = {x: points[0].x - padding, y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY + endVertexWidth}; 
						
						points[3] = {x: endX +  padding, y: points[2].y}; 
						
						points[4] = {x: points[3].x, y: endY}; 
						
						points[5] = {x: endX, y: endY};
						
					}
					
				}
				
				// West -> West
				// ----------------------------------------------------
				if (startCard == DiagramConstants.WEST &&
						(endCard == DiagramConstants.WEST)  ) {
			

						points[1] = {x:  Math.min(endX - padding, points[0].x - padding), y: points[0].y}; 
						
						points[2] = {x: points[1].x, y: endY }; 
						
						points[3] = {x: endX, y: points[2].y}; 
										
				}			
				
				return points;

			},
			
			getBezierArcPoints: function(startPoint, endPoint){
				//not implemented yet...
			}
			
			
			
	}; 
	
	var ManhattanLineSegmentFactory = Diagram.ManhattanLineSegmentFactory = {
		
			getLongestLineSegment: function(points){
				var segment = [];
				var maxDistance = 0; 
				// we expect that the points are an array of position
				// dictionaries. 
				
				for(var i = 0; i < points.length - 1; i++){ 
					var first = points[i]; 
					var second = points[i+1]; 
					
					if(first.x == second.x){
						//this is a vertical line
						var distance = Math.abs(first.y - second.y);
						if(distance > maxDistance){
							maxDistance = distance; 
							segment[0] = first;
							segment[1] = second;
						}
						
					} else {
						var distance = Math.abs(first.x - second.x); 
						if(distance > maxDistance){
							maxDistance = distance; 
							segment[0] = first;
							segment[1] = second;
							
						}
					}
					
				}
				
				var midpoint ={}; 
				var isHorizontal = true; 
				
				if(segment[0].x == segment[1].x){
					//this is vertical line
					isHorizontal = false; 
					midpoint.x = segment[0].x; 
					if(segment[0].y > segment[1].y){
						midpoint.y = segment[1].y + ((segment[0].y - segment[1].y)/2); 
					} else{ 
						midpoint.y = segment[0].y + ((segment[1].y - segment[0].y)/2); 
					}
					
				} else {
					//this is a horizontal line
					midpoint.y = segment[0].y; 
					if(segment[0].x > segment[1].x){
						midpoint.x = segment[1].x + ((segment[0].x - segment[1].x)/2); 
					} else{ 
						midpoint.x = segment[0].x + ((segment[1].x - segment[0].x)/2); 
					}
				}
				
				
				var dict = {segment: segment, midpoint: midpoint, isHorizontal: isHorizontal}; 
				
				return dict; 
				
			} 
			
			
			
	}; 
	
	
	var ArcLabel = Diagram.ArcLabel = function(attributes, options){ 
		Diagram.GroupElement.call(this, attributes, options); 
		
		// Methods
		
		this.toggleSelect = function(){
			if(this.isSelected == true){ 
				this.rectangle.setStroke(this.stroke); 
				this.isSelected = false; 
				this.group.draw();
			} else{ 
				this.rectangle.setStroke(this.selectedStroke); 
				this.isSelected = true;
				this.group.draw(); 
			}

		};
		
		
		this.updateText = function(text){
			this.text = text; 
			this.labelText.setText(this.text); 

			this.group.draw(); 
		};

		
		this.updateLocation = function(points){
			this.points = points; 
			this.middle =  Diagram.ManhattanLineSegmentFactory.getLongestLineSegment(points); 
			this.group.setX(this.middle.midpoint.x); 
			
			this.group.setY(this.middle.midpoint.y); 

			this.group.draw(); 
		};
		
		// Constructor 
		
		var text = this.text = this.attributes.text; 
		
		var points = this.points = this.attributes.points; 
		
		var middle = this.middle =  Diagram.ManhattanLineSegmentFactory.getLongestLineSegment(this.points); 
		
		var labelWidth = this.labelWidth = this.attributes.labelWidth ||
			DiagramConstants.ARCLABEL_DEFAULT_WIDTH; 
		
		var labelHeight = this.labelHeight = this.attributes.labelHeight ||
			DiagramConstants.ARCLABEL_DEFAULT_HEIGHT; 
	
		var fill = this.fill = this.attributes.fill
			|| DiagramConstants.ARCLABEL_DEFAULT_FILL; 

		var stroke = this.stroke = this.attributes.stroke 
			|| DiagramConstants.ARCLABEL_DEFAULT_STROKE; 

		var selectedStroke = this.selectedStroke = this.attributes.selectedStroke 
		|| DiagramConstants.ARCLABEL_DEFAULT_SELECTEDSTROKE; 
		
		var strokeWidth = this.strokeWidth = this.attributes.strokeWidth
			|| DiagramConstants.ARCLABEL_DEFAULT_STROKEWIDTH; 

	
		var labelFont = this.labelFont = this.attributes.labelFont ||
			DiagramConstants.ARCLABEL_DEFAULT_LABEL_FONT; 

		var labelFontSize = this.labelFontSize = this.attributes.labelFontSize ||
			DiagramConstants.ARCLABEL_DEFAULT_LABEL_FONTSIZE; 

		var labelFontStyle = this.labelFontStyle = this.attributes.labelFontStyle ||
			DiagramConstants.ARCLABEL_DEFAULT_LABEL_FONTSTYLE; 


		var labelFontColor = this.labelFontColor = this.attributes.labelFontColor ||
			DiagramConstants.ARCLABEL_DEFAULT_LABEL_FONTCOLOR; 


		var labelOffsetX = this.labelOffsetX = this.attributes.labelOffsetX ||
			DiagramConstants.ARCLABEL_DEFAULT_LABEL_OFFSETX;  
	
		var labelOffsetY = this.labelOffsetY = this.attributes.labelOffsetY ||
			DiagramConstants.ARCLABEL_DEFAULT_LABEL_OFFSETY;  
		
		var isSelected = this.isSelected = this.attributes.isSelected == false; 

		this.group.setX(this.middle.midpoint.x); 
		
		this.group.setY(this.middle.midpoint.y); 
		
		console.log(this.group);
		
		var rectangle = this.rectangle = new Kinetic.Rect({
			id: this.getId() + "-" + "rectangle", 
			x: - (this.labelWidth/2), 
			y: - (this.labelHeight/2),
			width: this.labelWidth, 
			height: this.labelHeight,
			stroke: this.stroke,
			fill: this.fill, 
			strokeWidth: this.strokeWidth // this.strokeWidth
				
		}); 
		
		
		this.group.add(this.rectangle); 
		this.rectangle.arcLabel = this;
		
		this.group.arcLabel= this; 
		
		var labelText = this.labelText  = new Kinetic.Text({
			id: this.getId() + "label",
            x:this.labelOffsetX,
            y: this.labelOffsetY,
            fill: this.labelFontColor, 
            fontFamily:this.labelFont,
            fontStyle:  this.labelFontStyle, 
            fontSize:  this.lableFontSize,
            text: this.text
		});
		
		this.group.add(this.labelText); 
		this.labelText.arcLabel = this; 
				
		
	}; 
	
	var ArcArrowhead = Diagram.ArcArrowhead = function(attributes, options){ 
		Diagram.Element.call(this, attributes, options); 

		//Methods
		
		this.toggleSelect = function(){
			if(this.isSelected == true){ 
				this.triangle.setFill(this.fill);
				this.triangle.setStroke(this.stroke); 
				this.isSelected = false; 
				this.triangle.draw();
			} else{ 
				this.triangle.setFill(this.selectedFill);
				this.triangle.setStroke(this.selectedStroke); 
				this.isSelected = true;
				this.triangle.draw(); 
			}

		};
		
		this.setPolygonPointsFromControlPoint = function(controlPoint){ 
			this.points[0] = 
				Diagram.ControlPointContactFactory.getControlPointContact(controlPoint);
			
			if(this.orientation == DiagramConstants.NORTH){ 
				this.points[1] = {x:this.points[0].x + this.width/2,
						y: this.points[0].y - this.height/2};
				
				this.points[2] = {x: this.points[0].x - this.width/2,
						y: this.points[0].y - this.height/2}; 
			}
			
			if(this.orientation == DiagramConstants.SOUTH){ 
				this.points[1] = {x: this.points[0].x + this.width/2,
						y: this.points[0].y + this.height/2};
				
				this.points[2] = {x: this.points[0].x - this.width/2,
						y: this.points[0].y + this.height/2}; 
			}
			
			if(this.orientation == DiagramConstants.EAST){ 
				this.points[1] = {x: this.points[0].x + this.width/2,
						y: this.points[0].y - this.height/2};
				
				this.points[2] = {x: this.points[0].x + this.width/2,
						y: this.points[0].y + this.height/2}; 
			}
			
			if(this.orientation == DiagramConstants.WEST){ 
				this.points[1] = {x: this.points[0].x - this.width/2,
						y: this.points[0].y - this.height/2};
				
				this.points[2] = {x: this.points[0].x - this.width/2,
						y: this.points[0].y + this.height/2}; 
			}
			
		};
		
		this.updateLocation = function(controlPoint){
			this.setPolygonPointsFromControlPoint(controlPoint); 
			this.triangle.setPoints(this.points); 
			this.triangle.draw(); 
		};
	
		// Constructor
		
		var controlPoint = this.controlPoint = this.attributes.controlPoint; 

		
		var orientation = this.orientation =  this.controlPoint.getCardinalPosition(); 
		
		var height = this.height = this.attributes.height 
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_HEIGHT; 

		var width = this.width = this.attributes.width 
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_WIDTH; 
	
		
		var fill = this.fill = this.attributes.fill
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_FILL; 
	
		var stroke = this.stroke = this.attributes.stroke 
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_STROKE; 

		var selectedFill = this.selectedFill = this.attributes.selectedFill 
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_SELECTEDFILL; 


		var selectedStroke = this.selectedStroke = this.attributes.selectedStroke 
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_SELECTEDSTROKE; 
		
		
		var strokeWidth = this.strokeWidth = this.attributes.strokeWidth
			|| DiagramConstants.ARCARROWHEAD_DEFAULT_STROKEWIDTH; 
	
		
				
		var points = this.points = [];
		
		this.setPolygonPointsFromControlPoint(this.controlPoint); 

		
		var triangle = this.triangle = new Kinetic.Polygon({
			points: this.points, 
			fill: this.fill, 
			stroke: this.stroke,
			strokeWidth: this.strokeWidth
		}); 
		

		this.element = this.triangle;
		
		this.element.arcArrowhead = this; 
	}; 
	

	var TransitionArc = Diagram.TransitionArc = function(attributes, options){ 
		Diagram.GroupElement.call(this, attributes, options); 
	
		// Methods
		
		this.toggleSelect = function(){

			if(this.isSelected == true){ 
				this.line.setStroke(this.arcStroke); 
				this.isSelected = false; 
				this.line.draw();
			} else{ 
				this.line.setStroke(this.arcSelectedStroke); 
				this.isSelected = true;
				this.line.draw(); 
			}
			this.arcLabel.toggleSelect(); 

			this.arcArrowhead.toggleSelect(); 
		};
		
		this.remove= function(){ 
			this.group.removeChildren(); 
			this.removed = true; 
			
		}; 
		
		
		
		// Constructor
		var start = this.start = this.attributes.start; 
		
		var end = this.end = this.attributes.end; 
		
		var label = this.label = this.attributes.label; 
		
		var arcStroke= this.arcStroke = this.attributes.arcStroke
			|| DiagramConstants.ARC_DEFAULT_STROKE; 

		var arcSelectedStroke= this.arcSelectedStroke = this.attributes.arcSelectedStroke
		|| DiagramConstants.ARC_DEFAULT_SELECTEDSTROKE; 		
		
		
		var arcStrokeWidth = this.arcStrokeWidth = this.attributes.arcStrokeWidth
			|| DiagramConstants.ARC_DEFAULT_STROKEWIDTH; 
		
		var arcLineCap = this.arcLineCap = this.attributes.arcLineCap
			|| DiagramConstants.ARC_DEFAULT_LINECAP; 
		
		var arcLineJoin = this.arcLineJoin = this.attributes.arcLineJoin
			|| DiagramConstants.ARC_DEFAULT_LINEJOIN; 

		var isSelected = this.isSelected = this.attributes.isSelected == false; 
		
		var removed = this.removed = this.attributes.removed == false; 
		
		var manhattanPadding = this.manhattanPadding = 
			this.attributes.manhattanPadding 
			|| DiagramConstants.ARC_DEFAULT_MH_PADDING;
		
		var arcpoints = this.arcpoints = 
			ArcPointFactory.getManhattanArcPoints(this.start, 
			this.end, {padding: this.manhattanPadding}); 
		

		var line = this.line = new Kinetic.Line({
			id: this.getId() + "-" +  "line", 
			points: arcpoints,
			stroke: this.arcStroke, 
			strokeWidth: this.arcStrokeWidth,
			lineCap:  this.arcLineCap,
			lineJoin: this.arcLineJoin
		}); 
		
		this.line.arc = this; 
		this.group.add(this.line);  
		this.group.arc = this; 
		
		
		var arcArrowhead = this.arcArrowhead = new Diagram.ArcArrowhead({
			id: this.getId() + "-" +  "arrowhead", 
			controlPoint: this.end
		}); 
		
		this.arcArrowhead.arc = this; 
		this.group.add(this.arcArrowhead.getElement());  

		var arcLabel = this.arcLabel = new Diagram.ArcLabel({
			id: this.getId() + "-" +  "label",
			points: this.arcpoints, 
			text:this.label
		}); 
		
		 this.arcLabel.arc = this;  
		 this.group.add(this.arcLabel.getGroup()); 
		
		
		// Event Listeners
		var dragMoveHandler = this.dragMoveHandler = function(event){
			if(line.arc.removed == true){
				return; 
			}
			var startElement = line.arc.start.getElement(); 
			var endElement = line.arc.end.getElement(); 
			
			var newpoints = 
				ArcPointFactory.getManhattanArcPoints(line.arc.start, 
						line.arc.end, {padding:manhattanPadding}); 
			
			line.setPoints(newpoints);  
            line.arc.draw();
            
			arcArrowhead.updateLocation(end); 
			
			arcLabel.updateLocation(newpoints); 
			
		}; 
		
		this.start.vertex.group.on("dragmove", dragMoveHandler);  
		this.end.vertex.group.on("dragmove", dragMoveHandler);  
		
	}; 
	
	
	return Diagram; 
});
