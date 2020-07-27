// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const moment = require('moment');
const request = require("request");

const isEmptyObj = (obj) => {
    return Object.entries(obj).length === 0 && obj.constructor === Object;
}

const renderApp = (list = []) => {
    const app = document.getElementById('app');
    app.innerHTML = '';
    if (list.length === 0) {
        console.log('no data');
        const noData = document.createElement('h1' );
        noData.innerHTML = "NO DATA";
        app.appendChild(noData);
    } else {
        console.log(list);
        list.forEach(item => {
            const elm = document.createElement('div');
            elm.innerHTML = item;
            app.appendChild(elm);
        })
    }

}
const doRequest = () => {
    var options = {
        method: 'POST',
        rejectUnauthorized: false,
        url: 'https://www.maccabi-dent.com/wp-admin/admin-ajax.php',
        headers:
            {
                'cache-control': 'no-cache',
                'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW',
                'accept-encoding': 'gzip, deflate',
                Host: 'www.maccabi-dent.com',
                'Cache-Control': 'no-cache',
                Accept: '*/*'
            },
        formData:
            {
                action: 'get_lines',
                'data[macabi_id]': '21',
                'data[service_type]': 'dentist',
                // 'data[service_type]': 'hygenist',
                'data[age]': 'Y',
                paged: '1',
                getnearby: 'false',
                updateminicalander: 'true',
                specificdate: '',
                bday: '1985-02-22'
            }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        const data = JSON.parse(response.toJSON().body);
        let lines = [];
        if (!isEmptyObj(data.lines) && !Array.isArray(data.lines)) {
            Object.entries(data.lines).forEach(([date, slots]) => {
                Object.entries(slots).forEach(([timestamp, soltInfo]) => {
                    const result = `${moment.unix(date).format("MM/DD/YYYY")} - ${soltInfo.dayname} - ${timestamp}`;
                    lines.push(result);
                })
            });
        }
        renderApp(lines);
    });
}
doRequest();
setInterval(doRequest,  5 * 60 * 1000);
