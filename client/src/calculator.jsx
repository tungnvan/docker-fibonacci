import React, { Component } from 'react';
import axios from 'axios';

export default class Calculator extends Component {

    constructor(props) {
        super(props);
        this.state = {
            index: '',
            known_indexes: [],
            calculated: {},
        };
        this._getKnownIndexes = this._getKnownIndexes.bind(this);
        this._getCalculated = this._getCalculated.bind(this);
        this._calculate = this._calculate.bind(this);
    };

    componentDidMount() {
        this._getKnownIndexes();
        this._getCalculated();
    };

    async _getKnownIndexes() {
        try {
            const route = '/api/values/all';
            const {data: known_indexes} = await axios.get(route);
            this.setState({known_indexes});
        } catch (err) {
            console.error(err);
        }
    };

    async _getCalculated() {
        try {
            const route = '/api/values/current';
            const {data: calculated} = await axios.get(route);
            this.setState({calculated});
        } catch (err) {
            console.error(err);
        }

    };

    async _calculate(e) {
        e.preventDefault();
        try {
            const route = '/api/values'
            const payload = {index: this.state.index};
            await axios.post(route, payload);
            this._getKnownIndexes();
            this._getCalculated();
        } catch (err) {
            console.error(err);
        }
    };

    render() {
        const {known_indexes, calculated} = this.state;
        return (
            <div className="calculator">
                <form className="form" onSubmit={this._calculate}>
                    <input onChange={(e) => {this.setState({index: e.target.value})}} />
                    <button type="submit" onClick={this._calculate}>
                        Calculate
                    </button>
                </form>
                <div className="info">
                    <p>
                        Calculated index: {
                            known_indexes.map((index, i) => <span key={index.number}>{`${index.number}${i === known_indexes.length - 1 ? "" : ", "}`}</span>)
                        }
                    </p>
                    {
                        Object.keys(calculated).map(key => (
                            <div key={key}>For index {key} i calculated {calculated[key]}</div>
                        ))
                    }
                </div>
            </div>
        )
    };

}
