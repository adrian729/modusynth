import SVGTable from './components/svgTable/SVGTable';

const WaveTableController = () => {
    return (
        <div>
            <h2 className="control-label mb-2">wavetable</h2>
            <SVGTable optionsKey="real" />
            <SVGTable optionsKey="imag" />
        </div>
    );
};

export default WaveTableController;
