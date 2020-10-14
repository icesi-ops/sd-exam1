{
    /**
     * Puts some data into the data table.
     * @param {HTMLDivElement} root 
     */
    async function updateTable(root){
        console.log("Hi");
        const table = root.querySelector(".database-table");
        const response = await fetch(root.dataset.url);
        const data = await response.json();

        console.log(data);

        //Clear table
        table.querySelector("thead tr").innerHTML="";
        table.querySelector("tbody").innerHTML="";

        //Table headers
        headers = ["Title", "Author", "Genre"];
        for (const header of headers){
            table.querySelector("thead tr").insertAdjacentHTML("beforeend", `<th>${ header }</th>`);
        }

        //Table rows
        for (const row of data){
            console.log(row);
            table.querySelector("tbody").insertAdjacentHTML("beforeend", `
                <tr>
                    <td>${ row.Title }</td>
                    <td>${ row.Author }</td>
                    <td>${ row.Genre }</td>
                </tr>
            `);
        }
    }

    for (const root of document.querySelectorAll(".data-displayer[data-url]")){
        const table = document.createElement("table");
        table.classList.add("database-table");

        table.innerHTML = `
            <thead>
                <tr></tr>
            </thead> 
            <tbody>
                <tr>
                    <td>Loading</td>
                </tr>
            </tbody>   
        `;

        root.append(table);
        updateTable(root);
    }
}