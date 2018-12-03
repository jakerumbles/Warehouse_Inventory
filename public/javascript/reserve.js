const reserveItem = async function(args){
    // this function sends data obj to api to update db
    // reserving item for a project with projectID and data_id as
    // the primary key
    const data_id = document.querySelector('#modal-inv-id').value;
    const url = `/api/projects/${projectID}/reserve/${data_id}`;
    const data = {
        reserve: document.getElementById('reserve-input').value,
    }
    if(args === 'remove'){
        data.remove = true;
    }

    const resp = fetch(url, {
        method: "PUT",
        credentials: 'include',
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(data),
    })
    .then(fetched =>{
        fetched.json()
        .then(responseData =>{
            if(responseData.error){
                console.log(responseData.error)
                let errorLbl = document.querySelector("#error-message");
                errorLbl.textContent = responseData.error;
                errorLbl.removeAttribute("hidden")
            }
            else{
                location.reload()
            }
        })
    })
    .catch(err => console.log('Error: ',err))

}
