let title = document.querySelector("#title");
let price = document.querySelector("#price");
let taxes = document.querySelector("#taxes");
let ads = document.querySelector("#ads");
let discount = document.querySelector("#discount");
let total = document.querySelector("#total");
let count = document.querySelector("#count");
let category = document.querySelector("#category");
let submit = document.querySelector("#submit");

let mood = "create";
let tmp;


const productManager = {
  createNewProduct() {
    return {
      title: title.value.trim() || "-",
      price: price.value.trim() || "-",
      taxes: taxes.value.trim() || "-",
      ads: ads.value.trim() || "-",
      discount: discount.value.trim() || "-",
      total: total.innerHTML.trim() || "-",
      count: count.value.trim() || "-",
      category: category.value.trim() || "-",
    };
  },

  clearData() {
    title.value = "";
    price.value = "";
    taxes.value = "";
    ads.value = "";
    discount.value = "";
    total.innerHTML = 0;
    count.value = "";
    category.value = "";
  },

  getTotal() {
    if (price.value !== "") {
      let result = +price.value + +taxes.value + +ads.value - +discount.value;
      total.innerHTML = result;
    } else {
      total.innerHTML = 0;
    }
  },

  createTableRow(product, index) {
    return `
            <tr>
                <td>${index}</td>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.taxes}</td>
                <td>${product.ads}</td>
                <td>${product.discount}</td>
                <td>${product.total}</td>
                <td>${product.category}</td>
                <td><button onclick="productManager.updateData(${index})" id="update">update</button></td>
                <td><button onclick="productManager.deleteData(${index})" id="delete">delete</button></td>
            </tr>
        `;
  },

  showData() {
    let table = dataPro
      .map((product, index) => this.createTableRow(product, index))
      .join("");
    document.querySelector("#tbody").innerHTML = table;
    this.updateDeleteAllButton();
  },

  deleteData(index) {
    dataPro.splice(index, 1);
    localStorage.product = JSON.stringify(dataPro);
    this.showData();
  },

  deleteAll() {
    if (confirm("Are you sure you want to delete all products?")) {
      localStorage.clear();
      dataPro = [];
      this.showData();
    }
  },

  updateData(index) {
    let product = dataPro[index];
    title.value = product.title;
    price.value = product.price;
    taxes.value = product.taxes;
    ads.value = product.ads;
    discount.value = product.discount;
    this.getTotal();
    count.style.display = "none";
    category.value = product.category;
    submit.innerHTML = "Update";
    mood = "update";
    tmp = index;
    scroll({ top: 0, behavior: "smooth" });
  },

  getSearchMood(id) {
    let searchBtn = document.querySelector("#search");
    searchMood = id === "search-title" ? "Title" : "Category";
    searchBtn.placeholder = "Search By " + searchMood;
    searchBtn.focus();
    searchBtn.value = "";
    this.showData();
  },

  searchData(value) {
    let table = dataPro
      .filter((product) =>
        product[searchMood.toLowerCase()].includes(value.toLowerCase())
      )
      .map((product, index) => this.createTableRow(product, index))
      .join("");
    document.querySelector("#tbody").innerHTML = table;
  },

  updateDeleteAllButton() {
    let btnDelete = document.querySelector("#deleteAll");
    if (dataPro.length > 0) {
      btnDelete.innerHTML = `<button onclick="productManager.deleteAll()">Delete All (${dataPro.length})</button>`;
    } else {
      btnDelete.innerHTML = "";
    }
  },
};

// إنشاء المنتج أو تحديثه عند النقر على زر الحفظ
submit.onclick = function () {
  let newPro = productManager.createNewProduct();

  if (mood === "create") {
    for (let i = 0; i < (newPro.count === "-" ? 1 : +newPro.count); i++) {
      dataPro.push(newPro);
    }
  } else {
    dataPro[tmp] = newPro;
    mood = "create";
    submit.innerHTML = "Create";
    count.style.display = "block";
  }
  localStorage.setItem("product", JSON.stringify(dataPro));
  productManager.clearData();
  productManager.showData();
};

// تحميل البيانات من التخزين المحلي
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// عرض البيانات عند تحميل الصفحة
productManager.showData();
