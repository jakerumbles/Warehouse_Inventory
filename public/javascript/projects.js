var getData = async function(id){
    //really ugly function to create a table of inventory history
    const url = `/projects/${id}/items`;
    const resp = await fetch(url, {credentials: 'include'})
    const data = await resp.json()
    const rows = data.results
    let tbl = document.querySelector('.inv-his-table')
    if(tbl) tbl.remove();
    let errH3 = document.querySelector('#error-h3')
    if(errH3) errH3.remove();
    if (data.results.length < 1){
        // document.querySelector('#hiddenvalue').value = "No Item History."
        var modalBod = document.querySelector('.modal-body')
        errH3 = document.createElement('H3');
        errH3.id = 'error-h3';
        errH3.textContent = 'ERROR FETCHING TABLE';
        modalBod.appendChild(errH3);
    }else {

        tbl = document.createElement('TABLE');
        tbl.classList.add('inv-his-table')
        tbl.classList.add('table')
        tbl.classList.add('table-condensed')
        tbl.classList.add('table-responsive')
        tbl.border = '5px';
        var thead = document.createElement('THEAD')
        tbl.appendChild(thead)
        var tabTr = document.createElement('TR')
        thead.appendChild(tabTr)
        for (var key in rows[0]){
            var tabTh = document.createElement('TH')
            tabTh.textContent = key;
            tabTr.appendChild(tabTh)
        }
        var tabBod = document.createElement('tbody')
        tbl.appendChild(tabBod)

        rows.forEach(row => {
            var tabTr = document.createElement('TR');
            tabBod.appendChild(tabTr);
            for(var key in row){
                var tabTh = document.createElement('TH')
                tabTh.textContent = row[key]
                tabTr.appendChild(tabTh)
                // document.querySelector('#hiddenvalue').value += key;
                // document.querySelector('#hiddenvalue').value += ": " + row[key];
            }
        })
        var modalBod = document.querySelector('.modal-body')
        modalBod.appendChild(tbl)
    }
}

const changeBtnText = () => {
    let btnText = document.querySelector('#show-hide-history-btn').textContent;
    if(btnText === 'Show Items'){
        document.querySelector('#show-hide-history-btn').textContent = 'Hide Items';
    } else {
        document.querySelector('#show-hide-history-btn').textContent = 'Show Items';
    }
}

const loadDataOnForms = async function(id){
    const url = `/projects/${id}/`;
    const resp = await fetch(url, {credentials: 'include'})
    const data = await resp.json()
    if (data.results.length < 1){
        document.getElementById('description-input').value = 'Error';
    } else {
        rows = data.results;
        document.getElementById('name-input').value = rows[0].name;
        document.getElementById('manager-input').value = rows[0].manager_id;
    }
}

const updateItem = async function(){
    //this function sends data obj to api to update db
    const data_id = document.querySelector('#modal-inv-id').value;
    const url = `/projects/${data_id}`;
    const data = {
        name: document.getElementById('name-input').value,
        manager: document.getElementById('manager-input').value,
    }
    
    console.log(data);

    const resp = fetch(url, {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
    })
    .then(fetched =>{
        // location.reload()
    })

}

$(document).ready(function() {

    $('a[data-toggle=modal], button[data-toggle=modal]').click(function () {

        var data_id = '';
        var data_desc = '';

        if (typeof $(this).data('id') !== 'undefined') {
            data_id = $(this).data('id');
            document.querySelector('#modal-inv-id').value = data_id;
        }

        if (typeof $(this).data('description') !== 'undefined') {
            data_desc = $(this).data('description');
        }

        loadDataOnForms(data_id);

        getData(data_id);
    })
});
