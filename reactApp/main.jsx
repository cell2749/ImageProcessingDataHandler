let React = require("react");
let ReactDOM = require("react-dom");
let createReactClass = require('create-react-class');
let socketClient = require('socket.io-client').connect("https://g6-os.herokuapp.com");

let App = createReactClass({
    getInitialState: function () {
        return {
            maxSize: 36,
            capacity:0,
            data: null,
            table: (
                <table key={'table'} className="table-bordered">
                    <tbody key={'body'}>
                    </tbody>
                </table>
            )
        }
    },
    componentDidMount: function () {
        let parentTarget = this;
        let request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            let data = JSON.parse(this.responseText);
            let td = [];
            let tr = [];
            for (let i = 0; i < data.map.length; i++) {
                let bgcolor="#DDDD00";
                let prob = data.map[i].prob;
                if (prob<0.33){
                    bgcolor="#007700";
                }else if( prob>0.6 ){
                    bgcolor="#990000";
                }
                td.push(<td key={i + "td"} bgcolor={bgcolor}><img src="/images/carTop.png" alt="car" width={document.documentElement.clientWidth/10}/></td>);
                if (i !== 0 && td.length % 9 === 0) {
                    tr.push(<tr key={i + "tr"}>{td}</tr>);
                    td = [];
                }
            }
            let table = (
                <table key={'table'} className="table-bordered">
                    <tbody key={'body'}>
                    {tr}
                    </tbody>
                </table>
            );
            parentTarget.setState({data: data, table: table, capacity:data.currentSize});
        };
        request.open("GET", "/getDefaultParkingLot");
        request.send();
    },
    update: function(data){
        let td = [];
        let tr = [];
        for (let i = 0; i < data.map.length; i++) {
            let bgcolor="#DDDD00";
            let prob = data.map[i].prob;
            if (prob<0.33){
                bgcolor="#007700";
            }else if( prob>0.6 ){
                bgcolor="#990000";
            }
            td.push(<td key={i + "td"} bgcolor={bgcolor}><img src="/images/carTop.png" alt="car" width={document.documentElement.clientWidth/10}/></td>);
            if (i !== 0 && td.length % 9 === 0) {
                tr.push(<tr key={i + "tr"}>{td}</tr>);
                td = [];
            }
        }
        let table = (
            <table key={'table'} className="table-bordered">
                <tbody key={'body'}>
                {tr}
                </tbody>
            </table>
        );
        this.setState({data: data, table: table, capacity:data.currentSize});
    },
    render: function () {
        return (
            <div>
                <h2 align="center">Guaranteed free spaces: {this.state.maxSize-this.state.capacity} / {this.state.maxSize}</h2>
                {this.state.table}
            </div>

        )
    }
});

let Application = ReactDOM.render(<App/>, document.getElementById('app'));
socketClient.on('update',Application.update);