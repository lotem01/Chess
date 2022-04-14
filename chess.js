window.addEventListener('load', () => {
    console.log('HTML page is loaded');
    let table = document.createElement("table");
    document.body.appendChild(table);
    table.className= 'table';
    let tb = document.createElement("tbody");
    table.appendChild(tb);
    for (let i=1; i<=8; i++)
    {
        let tr = document.createElement("tr");
        tb.appendChild(tr);
        for (let y=1; y<=8; y++)
    {
            let td = document.createElement("td");
            tr.appendChild(td);
            if ((y%2==1&& i%2==1) || (y%2==0&& i%2==0) ) {
                td.className= 'white';
        }   else {
            
                td.className= 'black';
            
                
        }
    }
    }
});