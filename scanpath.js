const width = d3.select('#canvas').attr('width');
const height = d3.select('#canvas').attr('height');
const margin = {top:10,left:16,right:16,bottom:10};
const acessor = string => d => d[string];
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;
const svg = d3.select('#canvas');
const plot = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
const files = [
    "P10_T1_C.txt","P10_T2_C.txt","P10_T3_C.txt","P10_T4_C.txt","P10_T5_C.txt","P10_T6_C.txt","P10_T7_C.txt","P10_T8_C.txt","P11_T1_B.txt","P11_T2_B.txt","P11_T3_B.txt","P11_T4_B.txt","P11_T5_B.txt","P11_T6_B.txt","P11_T7_B.txt","P11_T8_B.txt","P12_T1_C.txt","P12_T2_C.txt","P12_T3_C.txt","P12_T4_C.txt","P12_T5_C.txt","P12_T6_C.txt","P12_T7_C.txt","P12_T8_C.txt","P13_T1_B.txt","P13_T2_B.txt","P13_T3_B.txt","P13_T4_B.txt","P13_T5_B.txt","P13_T6_B.txt","P13_T7_B.txt","P13_T8_B.txt","P14_T1_C.txt","P14_T2_C.txt","P14_T3_C.txt","P14_T4_C.txt","P14_T5_C.txt","P14_T6_C.txt","P14_T7_C.txt","P14_T8_C.txt","P15_T1_B.txt","P15_T2_B.txt","P15_T3_B.txt","P15_T4_B.txt","P15_T5_B.txt","P15_T6_B.txt","P15_T7_B.txt","P15_T8_B.txt","P16_T1_C.txt","P16_T2_C.txt","P16_T3_C.txt","P16_T4_C.txt","P16_T5_C.txt","P16_T6_C.txt","P16_T7_C.txt","P16_T8_C.txt","P18_T1_C.txt","P18_T2_C.txt","P18_T3_C.txt","P18_T4_C.txt","P18_T5_C.txt","P18_T6_C.txt","P18_T7_C.txt","P18_T8_C.txt","P19_T1_B.txt","P19_T2_B.txt","P19_T3_B.txt","P19_T4_B.txt","P19_T5_B.txt","P19_T6_B.txt","P19_T7_B.txt","P19_T8_B.txt","P1_T1_B.txt","P1_T2_B.txt","P1_T3_B.txt","P1_T4_B.txt","P1_T5_B.txt","P1_T6_B.txt","P1_T7_B.txt","P1_T8_B.txt","P20_T1_B.txt","P20_T2_B.txt","P20_T3_B.txt","P20_T4_B.txt","P20_T5_B.txt","P20_T6_B.txt","P20_T7_B.txt","P20_T8_B.txt","P21_T1_C.txt","P21_T2_C.txt","P21_T3_C.txt","P21_T4_C.txt","P21_T5_C.txt","P21_T6_C.txt","P21_T7_C.txt","P21_T8_C.txt","P3_T1_B.txt","P3_T2_B.txt","P3_T3_B.txt","P3_T4_B.txt","P3_T5_B.txt","P3_T6_B.txt","P3_T7_B.txt","P3_T8_B.txt","P4_T1_C.txt","P4_T2_C.txt","P4_T3_C.txt","P4_T4_C.txt","P4_T5_C.txt","P4_T6_C.txt","P4_T7_C.txt","P4_T8_C.txt","P5_T1_B.txt","P5_T2_B.txt","P5_T3_B.txt","P5_T4_B.txt","P5_T5_B.txt","P5_T6_B.txt","P5_T7_B.txt","P5_T8_B.txt","P6_T1_C.txt","P6_T2_C.txt","P6_T3_C.txt","P6_T4_C.txt","P6_T5_C.txt","P6_T6_C.txt","P6_T7_C.txt","P6_T8_C.txt","P7_T1_B.txt","P7_T3_B.txt","P7_T4_B.txt","P7_T5_B.txt","P7_T6_B.txt","P7_T7_B.txt","P7_T8_B.txt","P8_T1_C.txt","P8_T2_C.txt","P8_T3_C.txt","P8_T4_C.txt","P8_T5_C.txt","P8_T6_C.txt","P8_T7_C.txt","P8_T8_C.txt","P9_T1_B.txt","P9_T2_B.txt","P9_T3_B.txt","P9_T4_B.txt","P9_T5_B.txt","P9_T6_B.txt","P9_T7_B.txt","P9_T8_B.txt"];
const colors = d3.schemeCategory10;

plot.append('rect')
    .attr('fill', 'none')
    .attr('width', innerWidth)
    .attr('height', innerHeight)
    .attr('stroke', 'black');


const x = d3.scaleLinear().domain([0,1]).range([0,innerWidth]);
const y = d3.scaleLinear().domain([0,1]).range([0,innerHeight]);
const line = d3.line()
    .x(d=> x(d3.mean(d, acessor("x"))))
    .y(d=> y(d3.mean(d, acessor("y"))));


const task = "T8_C";

d3.select('title').text(task)
const selectedFiles = files.filter(str => str.includes(task)).sort(d3.ascending);
const promises = selectedFiles.map(str => get_and_process(str));
Promise.all(promises).then(datum => {
    datum.forEach((d,i) => drawUser(colors[i])(d))
});



async function get_and_process(filename) {
    const parserModifier = d => ({x:+d.x/2560, y:+d.y/1440,fix:eval(d.fix)});
    const rawdata = await d3.tsv('./eye-data/'+filename, parserModifier);
    const valid = object => !(+object.x <= 0 || +object.y <= 0);

    const filtered = rawdata.filter(valid);
    const groups = filtered.reduce((acc, curr, i, src)=>{
        const {fix} = curr;

        if(i===0){
            if(fix) acc.push([curr]);
            return acc
        }

        if(fix){
            const prevFix = src[i-1].fix;
            if(!prevFix) {
                acc.push([])
            }
            acc[acc.length-1].push(curr)
        }
        return acc

    },[]);

    return groups.filter(g=>g.length> 15)
}
function drawUser(color){
    const userPlot = plot.append('g').attr('id', color);
    const radialGradient = userPlot.append("defs")
        .append("radialGradient")
        .attr("id", "gradient"+color);
    radialGradient.append("stop")
        .attr("offset", "30%")
        .attr("stop-color", "white")
        .attr('id', 'start-color');
    radialGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", color)
        .attr('id', 'end-color');


    return function(data) {
        const radii = d3.scalePow().domain(d3.extent(data, acessor('length'))).range([10, 30]);

        const lines = userPlot.selectAll('path.empty').data([data]).enter()
            .append('path')
            .attr('stroke', color)
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('opacity', 0.7)
            .attr('d', line);

        const circleGroups = userPlot.selectAll('circle.empty').data(data).enter()
            .append('g')
            .attr('transform', d => {
                const xPos = x(d3.mean(d, acessor('x')));
                const yPos = y(d3.mean(d, acessor('y')));
                return `translate(${xPos},${yPos})`
            });

        circleGroups
            .append('circle')
            .attr('r', d => radii(d.length))
            .attr('fill', `url(#gradient${color})`)
            .attr('stroke', '#1c4780')
            .attr('fill-opacity', 0.5);


        circleGroups.append('text')
            .attr('alignment-baseline', 'middle')
            .attr('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', d => radii(d.length))
            .attr('font-family', 'monospace')
            .attr('font-weight', 'bold')
            .attr('x', 0)
            .attr('y', 2)
            .text((d, i) => i + 1);
    }

}

