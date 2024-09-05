import SVGTable from './components/svgTable/SVGTable';

const WaveTableController = () => {
    return (
        <div>
            <h2>Graphs with React</h2>
            <SVGTable optionsKey="real" />
            <SVGTable optionsKey="imag" />
        </div>
    );
};

export default WaveTableController;
