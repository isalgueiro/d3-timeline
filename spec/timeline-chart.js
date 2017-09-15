describe('TimelineChart', () => {
    'use strict';

    const WRAPPER_CLASS = 'chart-wrapper';

    it('should append a SVG element to given selection', () => {
        const div = getDefaultSizeContainer();
        const data = [{
            label: 'foo',
            data: []
        }];

        const chart = new TimelineChart(div, data);
        expect(div.querySelectorAll('svg').length).toBe(1);
    });

    describe('custom class', () => {
        describe('point element', () => {
            it('should add to the circle element', () => {
                const div = getDefaultSizeContainer();
                const data = [{
                    label: 'Group 1',
                    data: [{
                        at: new Date([2015, 1, 1]),
                        type: TimelineChart.TYPE.POINT,
                        customClass: 'custom-class'
                    }]
                }];

                const chart = new TimelineChart(div, data);
                expect(div.querySelectorAll('circle.custom-class').length).toBe(1);
            });
        });

        describe('interval element', () => {
            it('should add class to rect and to text', () => {
                const div = getDefaultSizeContainer();
                const data = [{
                    label: 'Group 1',
                    data: [{
                        from: new Date([2015, 1, 1]),
                        to: new Date([2015, 1, 2]),
                        type: TimelineChart.TYPE.INTERVAL,
                        customClass: 'custom-class-interval',
                        label: 'Test'
                    }]
                }];

                const chart = new TimelineChart(div, data);
                expect(div.querySelectorAll('rect.custom-class-interval').length).toBe(1);
                expect(div.querySelectorAll('text.custom-class-interval').length).toBe(1);
            })
        });
    });


    describe('min interval width', () => {
        function matchWidth(w, cfg) {
            return function() {
                const div = getDefaultSizeContainer();
                const data = [{
                    label: 'Group 1',
                    data: [{
                        from: new Date([2015, 1, 1]),
                        to: new Date([2015, 1, 1]),
                        type: TimelineChart.TYPE.INTERVAL,
                        customClass: 'custom-class-interval',
                        label: 'Test'
                    }]
                }];

                const chart = new TimelineChart(div, data, cfg);
                const currentWidth = div.querySelector('rect.custom-class-interval').getAttribute('width');
                expect(currentWidth == w).toBeTruthy();
            }
        }

        it('should default equals to 8', matchWidth(8, {}));

        it('should be able to change default min width', matchWidth(5, {intervalMinWidth: 5}));
    });

    describe('hiding group labels', () => {
        const div = getDefaultSizeContainer();
        const data = [{
            label: 'Group 1',
            data: [{
                from: new Date([2015, 1, 1]),
                to: new Date([2015, 1, 1]),
                type: TimelineChart.TYPE.INTERVAL,
                customClass: 'custom-class-interval',
                label: 'Test'
            }]
        }];
        it('should hide group labels when options.hideGroupLabels is true', () => {
            const chart = new TimelineChart(div, data, {hideGroupLabels: true});
            expect(div.querySelectorAll('text.group-label').length).toBe(0);
        });
        it('should show group labels by default', () => {
            const chart = new TimelineChart(div, data, {});
            expect(div.querySelectorAll('text.group-label').length).toBe(1);
        })
    });

    describe('i18n', () => {
        it('shoulld be translated', () => {
            const div = getDefaultSizeContainer();
            const data = [{
                label: 'Name',
                data: [{
                    type: TimelineChart.TYPE.POINT,
                    at: new Date([2016, 5, 1])
                }, {
                    type: TimelineChart.TYPE.POINT,
                    at: new Date([2016, 6, 1])
                }, {
                    type: TimelineChart.TYPE.POINT,
                    at: new Date([2016, 7, 1])
                }, {
                    type: TimelineChart.TYPE.POINT,
                    at: new Date([2016, 8, 1])
                }, {
                    type: TimelineChart.TYPE.POINT,
                    at: new Date([2016, 9, 1])
                }, {
                    type: TimelineChart.TYPE.POINT,
                    at: new Date([2016, 10, 1]),
                    customClass: 'blue-dot'
                }]
            }];
            var localeFormatter = d3.locale({
                "decimal": ",",
                "thousands": ".",
                "grouping": [3],
                "currency": ["", "€"],
                "dateTime": "%a %b %e %X %Y",
                "date": "%m/%d/%Y",
                "time": "%H:%M:%S",
                "periods": ["AM", "PM"],
                "days": ["Domingo", "Luns", "Martes", "Mércores", "Xoves", "Venres", "Sábado"],
                "shortDays": ["Do", "Lu", "Ma", "Mé", "Xo", "Ve", "Sa"],
                "months": ["Xaneiro", "Febreiro", "Marzo", "Abril", "Maio", "Xuño", "Xullo", "Agosto", "Setembro", "Outubro", "Novembro", "Decembro"],
                "shortMonths": ["Xan", "Feb", "Mar", "Abr", "Mai", "Xuñ", "Xul", "Ago", "Set", "Out", "Nov", "Dec"]
            });
            d3.time.format = localeFormatter.timeFormat;
            var tickFormat = localeFormatter.timeFormat.multi([
                ["%H:%M", function(d) { return d.getMinutes(); }],
                ["%H:%M", function(d) { return d.getHours(); }],
                ["%a %d", function(d) { return d.getDay() && d.getDate() != 1; }],
                ["%b %d", function(d) { return d.getDate() != 1; }],
                ["%B", function(d) { return d.getMonth(); }],
                ["%Y", function() { return true; }]
            ]);

            const chart = new TimelineChart(div, data, {tickFormat: tickFormat});
            const tickText = div.querySelector('g.tick text').textContent;
            expect(tickText).toBe('Maio');
        });
    });

    function getDefaultSizeContainer() {
        const div = document.createElement('div');
        div.setAttribute('class', WRAPPER_CLASS);
        div.setAttribute('style','width:800px; height: 200px;');
        return div;
    }
});
