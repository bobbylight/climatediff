// d3.legend.js
// (C) 2012 ziggy.jonsson.nyc@gmail.com
// MIT licence
'use strict';

(function() {

    d3.legend = function(g: JQuery) {
        g.each(function() {
            let g2: d3.Selection<any> = d3.select(this),
                items: any = {},
                svg: d3.Selection<any> = d3.select(g2.property('nearestViewportElement')),
                legendPadding: any = g2.attr('data-style-padding') || 5,
                lb: d3.selection.Update<any> = g2.selectAll('.legend-box').data([true]),
                li: d3.selection.Update<any> = g2.selectAll('.legend-items').data([true]);

            lb.enter().append('rect').classed('legend-box', true);
            li.enter().append('g').classed('legend-items', true);

            svg.selectAll('[data-legend]').each(function() {
                const self: d3.Selection<any> = d3.select(this);
                items[self.attr('data-legend')] = {
                    pos : self.attr('data-legend-pos') || this.getBBox().y,
                    color : self.attr('data-legend-color') ? self.attr('data-legend-color') :
                        self.style('fill') !== 'none' ? self.style('fill') : self.style('stroke')
                };
            });

            items = d3.entries(items).sort( function(a: any, b: any) { return a.value.pos - b.value.pos; });


            li.selectAll('text')
                .data(items, function(d: any) { return d.key; })
                .call(function(d: any) { d.enter().append('text'); })
                .call(function(d: any) { d.exit().remove(); })
                .attr('y', function(d: any, i: number) { return i + 'em'; })
                .attr('x', '1em')
                .text(function(d: any) { return d.key; });

            li.selectAll('circle')
                .data(items, function(d: any) { return d.key; })
                .call(function(d: any) { d.enter().append('circle'); })
                .call(function(d: any) { d.exit().remove(); })
                .attr('cy', function(d: any, i: number) { return i - 0.25 + 'em'; })
                .attr('cx', 0)
                .attr('r', '0.4em')
                .style('fill', function(d: any) { return d.value.color; });

            // Reposition and resize the box
            const lbbox: SVGRect = (<any>li[0][0]).getBBox();
            lb.attr('x', (lbbox.x - legendPadding))
                .attr('y', (lbbox.y - legendPadding))
                .attr('height', (lbbox.height + 2 * legendPadding))
                .attr('width', (lbbox.width + 2 * legendPadding));
        });
        return g;
    };
})();
