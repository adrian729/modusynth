import SVGTable from './components/svgTable/SVGTable';

const WaveTableController = () => {
    return (
        <div className="flex flex-col gap-3">
            <div>
                <h2 className="control-label mb-1">real</h2>
                <SVGTable optionsKey="real" />
            </div>
            <div>
                <h2 className="control-label mb-1">imag</h2>
                <SVGTable optionsKey="imag" />
            </div>
        </div>
    );
};

export default WaveTableController;
