// Code sourced from Urvashi in Better Programming
// https://betterprogramming.pub/react-d3-plotting-a-line-chart-with-tooltips-ed41a4c31f4f

import React, { useEffect } from 'react';
import * as d3 from 'd3';

import './index.css';

function LineChart(props) {
    // LineChart accepts three props: data (the data to plot on the chart), width, and height of the chart.
    const { data, width, height } = props;

    // Added useEffect Hook that will call drawChart() function
    // Hook depends on data props since we want to redraw the chart every time the data changes
    useEffect(() => {
        drawChart();
    }, [data]);

    function drawChart() {
        // Remove the old chart
        d3.select('#container')
            .select('svg')
            .remove();

        // Remove the old tooltip
        d3.select('#container')
            .select('.tooltip')
            .remove();

        // Add logic to draw the chart here

        // First define some constants
        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const yMinValue = d3.min(data, d => d.value);
        const yMaxValue = d3.max(data, d => d.value);
        const xMinValue = d3.min(data, d => d.label);
        const xMaxValue = d3.max(data, d => d.label);

        // Define the axes scales and the line/path generator
        // d3.scaleLinear() maps any given number within the given domain to the given range
        const xScale = d3
            .scaleLinear()
            .domain([xMinValue, xMaxValue])
            .range([0, width]);
        const yScale = d3
            .scaleLinear()
            .range([height, 0])
            .domain([0, yMaxValue]);
        const line = d3
            .line()
            .x(d => xScale(d.label))
            .y(d => yScale(d.value))
            .curve(d3.curveMonotoneX);

        // Add SVG element
        const svg = d3
            .select('#container') // select the #container element
            .append('svg') // apppend an SVG inside it
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g') // append a g element to group other SVG elements
            .attr('transform', `translate(${margin.left},${margin.top})`); // translate it, leaving the top and left margins

        // Draw the gridlines, the X-axis, and the Y-axis as well as the data line
        svg
            .append('g') // First append another group of SVG elements that will contain the gridlines along the Y-axis
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`) // Height of gridlines is set equal to the height of the chart
            .call(
                d3.axisBottom(xScale)
                    .tickSize(-height) // Add '-' so that they are drawn above the axisBottom and not below it
                    .tickFormat(''), // set tickFormat as empty string becuase don't want any lables drawn with them
            );
        svg
            .append('g')
            .attr('class', 'grid')
            .call(
                d3.axisLeft(yScale)
                    .tickSize(-width)
                    .tickFormat(''),
            );
        svg
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom().scale(xScale).tickSize(15));
        svg
            .append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale));
        svg
            .append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#f6c3d0')
            .attr('stroke-width', 4)
            .attr('class', 'line')
            .attr('d', line);


        // Add circle marker for the point we are hovering over
        const focus = svg
            .append('g')
            .attr('class', 'focus')
            .style('display', 'none');
        focus.append('circle').attr('r', 5).attr('class', 'circle');

        // Define tooltip element
        const tooltip = d3
            .select('#container')
            .append('div') // Append div element which will contain our tooltipContent
            .attr('class', 'tooltip')
            .style('opacity', 0); // Tooltip opacity initially set to 0 and circle marker will not be displayed unless some mouse event happens

        // Append a rect over our chart to capture mouse events
        // Will not be visible, set opacity to 0
        svg
            .append('rect')
            .attr('class', 'overlay')
            .attr('width', width)
            .attr('height', height)
            .style('opacity', 0)
            .on('mouseover', () => {
                focus.style('display', null);
            })
            .on('mouseout', () => {
                tooltip
                    .transition()
                    .duration(300)
                    .style('opacity', 0);
            })
            .on('mousemove', mousemove); // mousemove() function responsible for finding out position of cursor, figuring out nearest plot point, and translating tooltip as well as circle marker to nearest point
        function mousemove(event) {
            const bisect = d3.bisector(d => d.label).left; // bisect help find nearest point to left of invert point
            const xPos = d3.mouse(this)[0];
            const x0 = bisect(data, xScale.invert(xPos)); // xScale.invert takes a nubmer from the scale's range (width of chart) and maps it to the scale's domain (i.e., a number b/w the values on the X-axis)
            const d0 = data[x0];
            focus.attr(
                'transform',
                `translate(${xScale(d0.label)},${yScale(d0.value)})`,
            );
            tooltip
                .transition()
                .duration(300)
                .style('opacity', 0.9);
            tooltip
                .html(d0.tooltipContent || d0.label)
                .style(
                    'transform',
                    `translate(${xScale(d0.label) + 30}px,${yScale(d0.value) - 30}px)`,
                );
        }

    }
    return <div id="container" />; // Contains SVG elements
}

export default LineChart;