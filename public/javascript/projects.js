var getData = async function(id){
    //really ugly function to create a table of inventory history
    const url = `/api/projects/${id}/items`;
    const resp = await fetch(url, {credentials: 'include'})
    const data = await resp.json()
    const rows = data.results
    let tbl = document.querySelector('#projectItemTable')
    if(tbl) tbl.remove();
    let errH3 = document.querySelector('#error-h3')
    if(errH3) errH3.remove();
    if (data.results.length < 1){
        // document.querySelector('#hiddenvalue').value = "No Item History."
        var modalBod = document.querySelector('.modal-body')
        errH3 = document.createElement('H3');
        errH3.id = 'error-h3';
        errH3.textContent = 'This project has no items yet.';
        modalBod.appendChild(errH3);
    }else {
        var containerDiv = document.createElement('DIV')
        tbl = document.createElement('TABLE');
        tbl.id = "projectItemTable"
        tbl.classList.add('table')
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
                var tabTh = document.createElement('TD')
                tabTh.textContent = row[key]
                tabTr.appendChild(tabTh)
                // document.querySelector('#hiddenvalue').value += key;
                // document.querySelector('#hiddenvalue').value += ": " + row[key];
            }
        })
        var modalBod = document.querySelector('.modal-body')
        containerDiv.appendChild(tbl)
        containerDiv.classList.add('table')
        containerDiv.classList.add('table-hover')
        containerDiv.classList.add('table-responsive-sm')
        containerDiv.classList.add('table-condensed')
        modalBod.appendChild(containerDiv)
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
    const url = `/api/projects/${id}/`;
    const resp = await fetch(url, {credentials: 'include'})
    const data = await resp.json()
    if (data.results.length < 1){
        document.getElementById('description-input').value = 'Error';
    } else {
        rows = data.results;
        document.getElementById('name-input').value = rows[0].name;
        //document.getElementById('manager-input').value = rows[0].manager_id;
    }
}

const updateItem = async function(){
    //this function sends data obj to api to update db
    const data_id = document.querySelector('#modal-inv-id').value;
    const url = `/api/projects/${data_id}`;
    const data = {
        name: document.getElementById('name-input').value,
        manager: document.getElementById('inputManager').value,
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
        fetched.json()
        .then(responseData =>{
            if(responseData.error){
                console.log(responseData.error)
            }
            else{
                location.reload()
            }
        })
    })
    .catch(err => console.log('Error: ',err))

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

        var reserveBtn = document.querySelector("#reserveBtn");
        reserveBtn.href = `/projects/${data_id}/reserve`;

        loadDataOnForms(data_id);

        getData(data_id);
    })
});
