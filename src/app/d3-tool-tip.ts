import * as d3 from 'd3';
import { Selection } from 'd3';

interface BoundingBox {
    n: SVGPoint;
    e: SVGPoint;
    s: SVGPoint;
    w: SVGPoint;
    ne: SVGPoint;
    nw: SVGPoint;
    se: SVGPoint;
    sw: SVGPoint;
}

/**
 * A tool tip component for v4 d3 charts.  This class is based on the following project:<p>
 *
 * https://github.com/VACLab/d3-tip
 * <p>
 *
 * Example usage:
 * <code>
 *   const expandPoint: PointMouseEvent = (tipCallback: Function) => {
 *     // function scope important so 'this' refers to the mouseover'd DOM node
 *     return function(e: MonthRecord) {
 *       tipCallback(e);
 *       d3.select(this).transition()
 *         .attr('r', 6);
 *     };
 *   };
 *   const collapsePoint: PointMouseEvent = (tipCallback: Function) =>  {
 *     // function scope important so 'this' refers to the mouseover'd DOM node
 *     return function(e: MonthRecord) {
 *       tipCallback(e);
 *       d3.select(this).transition()
 *         .attr('r', 3);
 *     };
 *   };
 *   ...
 *   let tip: D3ToolTip = new D3ToolTip()
 *     .attr('class', 'd3-tip')
 *     .html((d: any) => {
 *       return d[city][maxVar].toString();
 *     });
 *   chart.call(tip.init);
 *   tip.offset([ -10, 0 ]);
 *   chart.selectAll('.point')
 *     .data(data.data)
 *     .enter().append('svg:circle')
 *     .attr('class', 'point' + (index + 1))
 *     .attr('cx', function(d: any, i: number) { return xScale(i); })
 *     .attr('cy', function(d: any, i: number) { return yScale(d[city][maxVar]); })
 *     .attr('r', function(d: any, i: number) { return 3; })
 *     .attr('pointer-events', 'all')
 *     .on('mouseover', expandPoint(tip.show))
 *     .on('mouseout', collapsePoint(tip.hide));
 * </code>
 */
export default class D3ToolTip {

    private direction_callbacks: { [ key: string ]: Function };
    private directions: string[];

    private dir: Function;
    private offs: Function;
    private content: Function;
    private node: HTMLDivElement;
    private svg: SVGSVGElement;
    private point: SVGPoint;
    private target: SVGElement | EventTarget;

    constructor() {

        this.direction_callbacks = {
            n: this.direction_n,
            s: this.direction_s,
            e: this.direction_e,
            w: this.direction_w,
            nw: this.direction_nw,
            ne: this.direction_ne,
            sw: this.direction_sw,
            se: this.direction_se
        };

        this.directions = Object.keys(this.direction_callbacks);

        this.dir = () => {
            return 'n';
        };
        this.offs = () => {
            return [ 0, 0 ];
        };
        this.content = () => {
            return ' ';
        };
        this.node = D3ToolTip.initNode();

        // d3 calls into init() with a different scope
        this.init = this.init.bind(this);

        // We also need to be protective of our callbacks' scopes
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    /**
     * Entry point.  Use like so:
     * <code>
     * const tip: D3ToolTip = new D3ToolTip();
     * d3.select('svg').call(tip.init);
     * </code>
     * @param {Selection<SVGElement, {}, null, undefined>} vis The d3 selection.
     */
    init(vis: Selection<SVGElement, {}, null, undefined>) {
        this.svg = D3ToolTip.getSVGNode(vis);
        this.point = this.svg.createSVGPoint();
        document.body.appendChild(this.node);
    }

    show(): D3ToolTip {

        const args: any = Array.prototype.slice.call(arguments);
        if (args[args.length - 1] instanceof SVGElement) {
            this.target = args.pop();
        }

        const content: string = this.content.apply(this, args);
        const poffset: any = this.offs.apply(this, args);
        const dir: string = this.dir.apply(this, args);
        const nodel: Selection<HTMLDivElement, {}, null, undefined> = this.getNodeEl();
        const scrollTop: number = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollLeft: number  = document.documentElement.scrollLeft || document.body.scrollLeft;

        nodel.html(content)
            .style('position', 'absolute')
            .style('opacity', 1)
            .style('pointer-events', 'all');

        let i: number = this.directions.length;
        while (i--) {
            nodel.classed(this.directions[i], false);
        }
        const coords: any = this.direction_callbacks[dir].apply(this);
        nodel.classed(dir, true)
            .style('top', (coords.top +  poffset[0]) + scrollTop + 'px')
            .style('left', (coords.left + poffset[1]) + scrollLeft + 'px');

        return this;
    }

    hide(): D3ToolTip {
        const nodel: Selection<HTMLDivElement, {}, null, undefined> = this.getNodeEl();
        nodel
            .style('opacity', 0)
            .style('pointer-events', 'none');
        return this;
    }

    attr(n: any, v: any): D3ToolTip {
        const args: any = Array.prototype.slice.call(arguments);
        d3.selection.prototype.attr.apply(this.getNodeEl(), args);
        return this;
    }

    style(n: any, v: any): D3ToolTip {
        const args: any = Array.prototype.slice.call(arguments);
        if (args.length === 1) {
            const styles: any = args[0];
            Object.keys(styles).forEach((key: any) => {
                return d3.selection.prototype.style.apply(this.getNodeEl(), [key, styles[key]]);
            });
        }
        return this;
    }

    direction(dir: string | Function): D3ToolTip {
        this.dir = dir ? this.functor(dir) : null;
        return this;
    }

    /**
     * Sets the offset for this tool tip.
     *
     * @param v The new offset, an array of the form <code>[ x, y ]</code>.
     * @returns {D3ToolTip} This tool tip instance.
     */
    offset(v: any): D3ToolTip {
        this.offs = v ? this.functor(v) : null;
        return this;
    }

    html(markup: string | Function): D3ToolTip {
        this.content = markup ? this.functor(markup) : null;
        return this;
    }

    destroy(): D3ToolTip {
        if (this.node) {
            this.getNodeEl().remove();
            this.node = null;
        }
        return this;
    }

    private static getSVGNode(el: Selection<SVGElement, {}, null, undefined>): SVGSVGElement {
        const selectedElement: SVGElement = el.node();
        if (selectedElement.tagName.toLowerCase() === 'svg') {
            return selectedElement as SVGSVGElement;
        }
        return selectedElement.ownerSVGElement;
    }

    private getNodeEl(): Selection<HTMLDivElement, {}, null, undefined> {
        if (this.node === null) {
            this.node = D3ToolTip.initNode();
            // re-add node to DOM
            document.body.appendChild(this.node);
        }
        return d3.select(this.node);
    }

    /**
     * Private - gets the screen coordinates of a shape
     *
     * Given a shape on the screen, will return an SVGPoint for the directions
     * n(north), s(south), e(east), w(west), ne(northeast), se(southeast), nw(northwest),
     * sw(southwest).
     *
     *    +-+-+
     *    |   |
     *    +   +
     *    |   |
     *    +-+-+
     *
     * Returns an Object {n, s, e, w, nw, sw, ne, se}
     */
    private getScreenBBox(): BoundingBox {

        let targetel: any /*SVGElement | EventTarget*/ = this.target || d3.event.target;
        while (!targetel.getScreenCTM && 'undefined' === targetel.parentNode) {
            targetel = targetel.parentNode;
        }

        const bbox: BoundingBox = { n: null, e: null, s: null, w: null, ne: null, nw: null, se: null, sw: null };
        const matrix: SVGMatrix = targetel.getScreenCTM();
        const tbbox: SVGRect = targetel.getBBox();
        const width: number = tbbox.width;
        const height: number = tbbox.height;
        const x: number = tbbox.x;
        const y: number = tbbox.y;

        this.point.x = x;
        this.point.y = y;
        bbox.nw = this.point.matrixTransform(matrix);
        this.point.x += width;
        bbox.ne = this.point.matrixTransform(matrix);
        this.point.y += height;
        bbox.se = this.point.matrixTransform(matrix);
        this.point.x -= width;
        bbox.sw = this.point.matrixTransform(matrix);
        this.point.y -= height / 2;
        bbox.w  = this.point.matrixTransform(matrix);
        this.point.x += width;
        bbox.e = this.point.matrixTransform(matrix);
        this.point.x -= width / 2;
        this.point.y -= height / 2;
        bbox.n = this.point.matrixTransform(matrix);
        this.point.y += height;
        bbox.s = this.point.matrixTransform(matrix);

        return bbox;
    }

    private direction_n() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.n.y - this.node.offsetHeight,
            left: bbox.n.x - this.node.offsetWidth / 2
        };
    }

    private direction_s() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.s.y,
            left: bbox.s.x - this.node.offsetWidth / 2
        };
    }

    private direction_e() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.e.y - this.node.offsetHeight / 2,
            left: bbox.e.x
        };
    }

    private direction_w() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.w.y - this.node.offsetHeight / 2,
            left: bbox.w.x - this.node.offsetWidth
        };
    }

    private direction_nw() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.nw.y - this.node.offsetHeight,
            left: bbox.nw.x - this.node.offsetWidth
        };
    }

    private direction_ne() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.ne.y - this.node.offsetHeight,
            left: bbox.ne.x
        };
    }

    private direction_sw() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.sw.y,
            left: bbox.sw.x - this.node.offsetWidth
        };
    }

    private direction_se() {
        const bbox: BoundingBox = this.getScreenBBox();
        return {
            top:  bbox.se.y,
            left: bbox.e.x
        };
    }

    private static initNode(): HTMLDivElement {
        const node: Selection<HTMLDivElement, {}, null, undefined> = d3.select(document.createElement('div'));
        node
            .style('position', 'absolute')
            .style('top', 0)
            .style('opacity', 0)
            .style('pointer-events', 'none')
            .style('box-sizing', 'border-box');

        return node.node();
    }

    private functor(value: any): any {
        return typeof value === 'function' ? value : () => {
            return value;
        };
    }
}
