/* eslint-disable jsx-a11y/no-access-key */

/* eslint-disable react/no-unknown-property */

/* eslint-disable jsx-a11y/label-has-associated-control */
import './styles.scss';

const Knob = () => {
    return (
        <div className="knob-group">
            <legend data-key="space / return">Knob Group</legend>
            {/* <hr /> */}
            <div className="knob">
                <input
                    type="number"
                    id="k"
                    value="2.5"
                    min="0"
                    max="12"
                    step="0.1"
                    placeholder="-"
                    autoComplete="off"
                    required
                />
                <label htmlFor="k" accessKey="k" data-unit="db">
                    K Knob
                </label>
            </div>
            <fieldset className="knob">
                <input
                    type="number"
                    id="l"
                    value="6"
                    min="0"
                    max="12"
                    step="0.1"
                    placeholder="-"
                    autoComplete="off"
                    required
                />
                <label htmlFor="l" accessKey="l" data-unit="Amp">
                    L Knob
                </label>
            </fieldset>
            <fieldset className="knob">
                <input
                    type="number"
                    id="m"
                    value="0"
                    min="0"
                    max="100"
                    step="1"
                    placeholder="-"
                    autoComplete="off"
                    required
                />
                <label htmlFor="m" accessKey="m" data-unit="cm">
                    M Knob
                </label>
            </fieldset>
        </div>
    );
};

export default Knob;
