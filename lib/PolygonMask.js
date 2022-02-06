import Shape from './Shape.js';
import Line from './Line.js';
import Circle from './Circle.js';
import * as TransMatrix from './Matrix.js';
import Canvas from './Canvas.js';

const INF = 100000;
const ORIENTATIONS = {
	'colinear' : 		0,
	'clockwise' : 		1,
	'anticlockwise' : 	2,
};

class PolygonMask extends Shape {
	constructor() {
		super();
	}

	createCircle( radius, resolution ) {
		const circle = new Circle();
		circle.create(
			radius,
			resolution
		);
		this.vertices = circle.vertices;
	}

	maskPointList( pointlist ) {
		this.intersectPointList( pointlist );
		// this.clipPointList( pointlist );
		// this.clipByIntersectedPoints( pointlist );
	}


	intersectPointList( pointlist ) {
		let intersections = [];
		let i;
		i = pointlist.vertices.length;
		while( i-- > 1 ) {
			const l1Start = pointlist.vertices[i];
			const l1End = pointlist.vertices[(i-1)];

			let j = this.vertices.length;			
			while( j-- > 1 ) {
				const l2Start = this.vertices[j];
				const l2End = this.vertices[(j-1)%this.vertices.length];
				const intersection = PolygonMask.CalculateIntersection( l1Start, l1End, l2Start, l2End );
				if( intersection ) {
					pointlist.addVertex( intersection, i );
					intersections.push(intersection);
				}
			}
		}

		let isOutside = true;
		i = pointlist.vertices.length;
		while( i-- > 0 ) {
			const indexOfIntersection = intersections.indexOf( pointlist.vertices[i] );
			if( indexOfIntersection > -1 ) {
				const int = intersections[indexOfIntersection];
				intersections.splice( indexOfIntersection, 1 );
				if( isOutside ) {
					isOutside = false;

				} else {
					isOutside = true;
					pointlist.addBreak(i);
				}
				// isOutside = !isOutside;
				
				continue;
			}

			if( isOutside ) {
				pointlist.removeVertex(i);
			}
		}
	}

	clipPointList( pointlist ) {
		let i = pointlist.vertices.length;
		while( i-- > 0 ) {			
			const inside = this.pointIsInside( pointlist.vertices[i] );
			if( ! inside ) {
				pointlist.removeVertex( i );
			}
		}
	}


	static CalculateIntersection(p1, p2, p3, p4) {

		let x1 = p1.x;
		let y1 = p1.y;
		let x2 = p2.x;
		let y2 = p2.y;
		let x3 = p3.x;
		let y3 = p3.y;
		let x4 = p4.x;
		let y4 = p4.y;


	  // Check if none of the lines are of length 0
		if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
			return false
		}

		let denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

	  // Lines are parallel
		if (denominator === 0) {
			return false
		}

		let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
		let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

	  // is the intersection along the segments
		if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
			return false
		}

	  // Return a object with the x and y coordinates of the intersection
		let x = x1 + ua * (x2 - x1)
		let y = y1 + ua * (y2 - y1)

		// return {x, y}
		return new TransMatrix.Vector3( x, y );
	}


	pointIsInside( point ) {
		if( this.resolution < 3 ) {
			return false;
		}

		let extreme = new TransMatrix.Vector3( point.x + INF, point.y );
		let count = 0, i = 0;
		do {
			let next = ( i + 1 ) % this.resolution;
			const intersect = PolygonMask.DoesIntersect( this.vertices[i], this.vertices[next], point, extreme );
			if( intersect ) {				
				const orientation = PolygonMask.GetOrientation( this.vertices[i], point, this.vertices[next] );
				if( orientation == ORIENTATIONS.colinear ) {
					const pointLiesOnSegment = PolygonMask.IsOnSegment( this.vertices[i], point, this.vertices[next] );
					return pointLiesOnSegment;
				}
				count++;				
			}
			i = next;
		} while( i != 0 );

		const hits = count % 2;
		// console.log( count, hits );
		return ( hits == 1 );
	}


	static DoesIntersect( p1, q1, p2, q2 ) {
		let o1 = PolygonMask.GetOrientation( p1, q1, p2 );
		let o2 = PolygonMask.GetOrientation( p1, q1, q2 );
		let o3 = PolygonMask.GetOrientation( p2, q2, p1 );
		let o4 = PolygonMask.GetOrientation( p2, q2, q1 );

		let l1 = new Line();
		// stroke(255,0,0);
		l1.create( p1, q1 );
		l1.render();
		// l1.renderPoints();
		// let l2 = new Line();
		// l2.create( p2, q2 );
		// l2.render();
		// l2.renderPoints();
		stroke(0);

		// general case
		if (o1 != o2 && o3 != o4) {
            return true;
        }

        // p1, q1 and p2 are collinear and
        // q2 lies on segment p1q1
        if (o2 == 0 && PolygonMask.IsOnSegment(p1, p2, q1)){
            return true;
        }

        // p2, q2 and p1 are collinear and
        // p1 lies on segment p2q2
        if (o3 == 0 && PolygonMask.IsOnSegment(p1, q2, q1)){
            return true;
        }

        // p2, q2 and q1 are collinear and
        // q1 lies on segment p2q2
        if (o4 == 0 && PolygonMask.IsOnSegment(p2, p1, q2)){
            return true;
        }

        // Doesn't fall in any of the above cases
        return false;
	}

	static GetOrientation( p, q, r ) {
		let val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
		if( val == 0 ) {
			return ORIENTATIONS.colinear;
		} else if( val > 0 ) {
			return ORIENTATIONS.clockwise;
		} else {
			return ORIENTATIONS.anticlockwise;
		}
	}

	static IsOnSegment( p,q, r ) {
		if (q.x <= Math.max(p.x, r.x) &&
            q.x >= Math.min(p.x, r.x) &&
            q.y <= Math.max(p.y, r.y) &&
            q.y >= Math.min(p.y, r.y)
		)
        {
            return true;
        }
        return false;
	}


}


export default PolygonMask;


/*


<script>
// A Javascript program to check if a given point
// lies inside a given polygon
// Refer https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/amp/
// for explanation of functions onSegment(),
// orientation() and doIntersect()
 
// Define Infinite (Using INT_MAX

    // caused overflow problems)
let INF = 10000;
 
class Point
{

    constructor(x,y)

    {

        this.x = x;

        this.y = y;

    }
}
 
// Given three collinear points p, q, r,

    // the function checks if point q lies

    // on line segment 'pr'

function onSegment(p,q,r)
{

     if (q.x <= Math.max(p.x, r.x) &&

            q.x >= Math.min(p.x, r.x) &&

            q.y <= Math.max(p.y, r.y) &&

            q.y >= Math.min(p.y, r.y))

        {

            return true;

        }

        return false;
}
 
// To find orientation of ordered triplet (p, q, r).

    // The function returns following values

    // 0 --> p, q and r are collinear

    // 1 --> Clockwise

    // 2 --> Counterclockwise

function orientation(p,q,r)
{

    let val = (q.y - p.y) * (r.x - q.x)

                - (q.x - p.x) * (r.y - q.y);

  

        if (val == 0)

        {

            return 0; // collinear

        }

        return (val > 0) ? 1 : 2; // clock or counterclock wise
}
 
// The function that returns true if

    // line segment 'p1q1' and 'p2q2' intersect.

function  doIntersect(p1,q1,p2,q2)
{

    // Find the four orientations needed for

        // general and special cases

        let o1 = orientation(p1, q1, p2);

        let o2 = orientation(p1, q1, q2);

        let o3 = orientation(p2, q2, p1);

        let o4 = orientation(p2, q2, q1);

  

        // General case

        if (o1 != o2 && o3 != o4)

        {

            return true;

        }

  

        // Special Cases

        // p1, q1 and p2 are collinear and

        // p2 lies on segment p1q1

        if (o1 == 0 && onSegment(p1, p2, q1))

        {

            return true;

        }

  

        // p1, q1 and p2 are collinear and

        // q2 lies on segment p1q1

        if (o2 == 0 && onSegment(p1, q2, q1))

        {

            return true;

        }

  

        // p2, q2 and p1 are collinear and

        // p1 lies on segment p2q2

        if (o3 == 0 && onSegment(p2, p1, q2))

        {

            return true;

        }

  

        // p2, q2 and q1 are collinear and

        // q1 lies on segment p2q2

        if (o4 == 0 && onSegment(p2, q1, q2))

        {

            return true;

        }

  

        // Doesn't fall in any of the above cases

        return false;
}
 
// Returns true if the point p lies

    // inside the polygon[] with n vertices

function  pointIsInside(polygon,n,p)
{

    // There must be at least 3 vertices in polygon[]

        if (n < 3)

        {

            return false;

        }

  

        // Create a point for line segment from p to infinite

        let extreme = new Point(INF, p.y);

  

        // Count intersections of the above line

        // with sides of polygon

        let count = 0, i = 0;

        do

        {

            let next = (i + 1) % n;

  

            // Check if the line segment from 'p' to

            // 'extreme' intersects with the line

            // segment from 'polygon[i]' to 'polygon[next]'

            if (doIntersect(polygon[i], polygon[next], p, extreme))

            {

                // If the point 'p' is collinear with line

                // segment 'i-next', then check if it lies

                // on segment. If it lies, return true, otherwise false

                if (orientation(polygon[i], p, polygon[next]) == 0)

                {

                    return onSegment(polygon[i], p,

                                    polygon[next]);

                }

  

                count++;

            }

            i = next;

        } while (i != 0);

  

        // Return true if count is odd, false otherwise

        return (count % 2 == 1); // Same as (count%2 == 1)
}
 
// Driver Code

polygon1 = [new Point(0, 0),

                            new Point(10, 0),

                            new Point(10, 10),

                            new Point(0, 10)];

                             
let n = polygon1.length;

        let p = new Point(20, 20);

        if (pointIsInside(polygon1, n, p))

        {

            document.write("Yes<br>");

        }

        else

        {

            document.write("No<br>");

        }

        p = new Point(5, 5);

        if (pointIsInside(polygon1, n, p))

        {

            document.write("Yes<br>");

        }

        else

        {

            document.write("No<br>");

        }

        let polygon2 = [new Point(0, 0),

            new Point(5, 5), new Point(5, 0)];

        p = new Point(3, 3);

        n = polygon2.length;

        if (pointIsInside(polygon2, n, p))

        {

            document.write("Yes<br>");

        }

        else

        {

            document.write("No<br>");

        }

        p = new Point(5, 1);

        if (pointIsInside(polygon2, n, p))

        {

            document.write("Yes<br>");

        }

        else

        {

            document.write("No<br>");

        }

        p = new Point(8, 1);

        if (pointIsInside(polygon2, n, p))

        {

            document.write("Yes<br>");

        }

        else

        {

            document.write("No<br>");

        }

        let polygon3 = [new Point(0, 0),

                            new Point(10, 0),

                            new Point(10, 10),

                            new Point(0, 10)];

        p = new Point(-1, 10);

        n = polygon3.length;

        if (pointIsInside(polygon3, n, p))

        {

            document.write("Yes<br>");

        }

        else

        {

            document.write("No<br>");

        }                            
 
// This code is contributed by rag2127
</script>


*/