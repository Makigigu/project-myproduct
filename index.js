function loadProduct() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5000/product-flook");
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            console.log(objects);
            let trHTML = '';
            for (let object of objects) {
                trHTML += `<tr>
                    <td>${object['id']}</td>
                    <td><img width="50px" src="${object['product_image']}"></td>
                    <td>${object['product_name']}</td>
                    <td>${object['product_price']}</td>
                    <td>${object['product_cost']}</td>
                    <td>
                        <button type="button" class="btn btn-outline-warning" onclick="showProductEditBox(${object['id']})">Edit</button>
                        <button type="button" class="btn btn-outline-danger" onclick="productDelete(${object['id']})">Delete</button>
                    </td>
                </tr>`;
            }
            document.getElementById("mytable").innerHTML = trHTML;
        }
    }
}

loadProduct();

function showProductEditBox(id) {
    console.log(id);

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:5000/product-flook/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            console.log(objects);

            Swal.fire({
                title: 'Edit Product',
                html: `ID: <input id="id" type="text" disabled class="swal2-input" value="${objects[0].id}">
                       <br>Product Name: <input id="product_name" type="text" class="swal2-input" value="${objects[0].product_name}">
                       <br>Product Price: <input id="product_price" type="text" class="swal2-input" value="${objects[0].product_price}">
                       <br>Product Cost: <input id="product_cost" type="text" class="swal2-input" value="${objects[0].product_cost}">
                       <br>Image: <input id="product_image" type="text" class="swal2-input" value="${objects[0].product_image}">`,
                focusConfirm: false,
                preConfirm: () => {
                    ProductEdit();
                }
            })
        }
    }
}

function ProductEdit() {
    const id = document.getElementById("id").value;
    const product_name = document.getElementById("product_name").value;
    const product_price = document.getElementById("product_price").value;
    const product_cost = document.getElementById("product_cost").value;
    const product_image = document.getElementById("product_image").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:5000/product-flook/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhttp.send(JSON.stringify({
        "id": id, "product_name": product_name, "product_price": product_price, "product_cost": product_cost, "product_image": product_image
    }));

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            Swal.fire(objects['message']);
            loadProduct();
        }
    }
}

function productDelete(id) {
    if (!id) {
        Swal.fire("Error", "Product ID is required!", "error");
        return;
    }

    Swal.fire({
        title: "Are you sure?",
        text: "This Product will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel"
    }).then((result) => {
        if (result.isConfirmed) {
            const xhttp = new XMLHttpRequest();
            xhttp.open("DELETE", "http://localhost:5000/product-flook/delete");
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify({ "id": id }));

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        const objects = JSON.parse(this.responseText);
                        Swal.fire("Deleted!", objects['message'], "success");
                        loadProduct();
                    } else {
                        Swal.fire("Error", "Failed to delete Product!", "error");
                    }
                }
            };
        }
    });
}