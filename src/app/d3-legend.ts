import * as d3 from 'd3';
import { Selection, BaseType } from 'd3';

/**
 * A legend for d3 V4 charts.  This class is based off of the following:<p>
 *
 * http://bl.ocks.org/ZJONSSON/3918369
 * <p>
 *
 * It's not quite how I want it yet, but it'll do.
 */
export default class D3Legend {

    constructor() {
    }

    /**
     * Entry point.  Use like so:
     * <code>
     * const legend: D3Legend = new D3Legend();
     * d3.select('svg').call(legend.init);
     * </code>
     * @param {Selection<SVGElement, {}, null, undefined>} vis The d3 selection.
     */
    init(vis: Selection<SVGElement, {}, null, undefined>) {

        const g: Selection<SVGElement, {}, null, undefined> = vis;
        let items: any = {};
        const svg: Selection<SVGElement, {}, null, undefined> = d3.select(D3Legend.getSVGNode(vis));
        const lb: any = g.selectAll('.legend-box').data([ true ]);
        const li: any = g.selectAll('.legend-items').data([ true ]);

        lb.enter().append('rect').classed('legend-box', true);
        li.enter().append('g').classed('legend-items', true);

        svg.selectAll('[data-legend]').each(function() {
            // For some reason, tsc is misidentifying the type of "this" here.  Verified in the debugger
            const self: SVGGraphicsElement = this as SVGGraphicsElement;
            const selfSel: Selection<BaseType, {}, null, undefined> = d3.select(this);
            items[selfSel.attr('data-legend')] = {
                pos: selfSel.attr('data-legend-pos') || self.getBBox().y,
                color: selfSel.attr('data-legend-color') ? selfSel.attr('data-legend-color') :
                    selfSel.style('fill') !== 'none' ? selfSel.style('fill') : selfSel.style('stroke')
            };
        });

        // We get called a few times with no data, while waiting for our REST call's response
        if (Object.keys(items).length) {

            items = d3.entries(items).sort((a: any, b: any) => {
                return a.value.pos - b.value.pos;
            });

            li
                .data(items, (d: any) => {
                    return d.key;
                })
                .enter()
                .append('text')
                .attr('y', (d: any, i: number) => {
                    return i + 'em';
                })
                .attr('x', '1em')
                .text(function (d: any) {
                    return d.key;
                });

            li
                .data(items, (d: any) => {
                    return d.key;
                })
                .enter()
                .append('circle')
                .attr('cy', (d: any, i: number) => {
                    return i - 0.25 + 'em';
                })
                .attr('cx', 0)
                .attr('r', '0.4em')
                .style('fill', (d: any) => {
                    return d.value.color;
                });
        }
    }

    private static getSVGNode(el: Selection<SVGElement, {}, null, undefined>): SVGSVGElement {
        const selectedElement: SVGElement = el.node();
        if (selectedElement.tagName.toLowerCase() === 'svg') {
            return selectedElement as SVGSVGElement;
        }
        return selectedElement.ownerSVGElement;
    }
}
