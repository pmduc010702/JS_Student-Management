var studentApi = "http://localhost:3000/students";

function start() {
  getStudents(renderStudents);
  handleCreateForm();
  handleEditStudent();
  handleSearchCourse();
}

start();


function getStudents(callback) {
  fetch(studentApi)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

// Tạo student
function createStudent(data, callback) {
  var options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(studentApi, options)
    .then(function (response) {
      return response.json();
    })
    .then(callback);
}

// Xóa
function handleDeleteStudent(id) {
  var options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(studentApi + "/" + id, options)
    .then(function (response) {
      return response.json();
    })
    .then(function () {
      var studentItem = document.querySelector(".student-item-" + id);
      if (studentItem) {
        studentItem.remove();
      }
    });
}

// Render ra danh sách Student
function renderStudents(students) {
  var listStudentsBlock = document.querySelector("#list-students");

  var html = students.map(student => {
    return `
            <li class="student-item-${student.id}">
                <p>Name : <b>${student.name}</b></p>
                <p>Class : <b>${student.class}</b></p>
                <p>Address : <b>${student.address}</b></p>
                <p>Score : <b>${student.score}</b></p>
                <img src="img/${student.img}">
                <button onclick="handleDeleteStudent(${student.id})">Delete</button>
                
                <button onclick="handleEditStudent(${student.id})" type="button" data-bs-toggle="modal" data-bs-target="#updateModal">
                Update
                </button>
                
            </li>
        `;
  });
  listStudentsBlock.innerHTML = html.join("");
}

// Xử lý tạo form
function handleCreateForm() {
  var createBtn = document.querySelector("#btn-create");
  createBtn.onclick = function () {
    var name = document.querySelector('input[name="name"]').value;
    var yourClass = document.querySelector('input[name="class"]').value;
    var address = document.querySelector('input[name="address"]').value;
    var score = document.querySelector('input[name="score"]').value;
    var imgInput = document.querySelector('input[name="img"]');

    var imgFile = imgInput.files[0]; // Lấy tệp hình ảnh đã chọn

    if (imgFile) {
      var imgName = imgFile.name; // Lấy tên tệp

      var formData = {
        name: name,
        class: yourClass,
        address: address,
        score: score,
        img: imgName,
      };

      createStudent(formData, function () {
        getStudents(renderStudents);
      });
    } else {
      alert("Vui lòng chọn một tệp hình ảnh.");
    }
  };
}

// Chỉnh sửa
function handleEditStudent(id) {
  fetch(studentApi + "/" + id)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      document.querySelector("#update-name").value = data.name;
      document.querySelector("#update-class").value = data.class;
      document.querySelector("#update-address").value = data.address;
      document.querySelector("#update-score").value = data.score;
    });

  var editElement = document.querySelector("#btn-update");

  editElement.onclick = function () {
    var dataEditedSaveChange = {
      name: document.querySelector("#update-name").value,
      class: document.querySelector("#update-class").value,
      address: document.querySelector("#update-address").value,
      score: document.querySelector("#update-score").value,
    };

    var imgInput = document.querySelector('input[name="update-img"]');
    var imgFile = imgInput.files[0]; // Lấy tệp hình ảnh đã chọn

    if (imgFile) {
      var imgName = imgFile.name; // Lấy tên tệp

      dataEditedSaveChange.img = imgName;

      var options = {
        method: "PATCH", // Sử dụng method PATCH để cập nhật thông tin học sinh
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataEditedSaveChange),
      };

      fetch(studentApi + "/" + id, options).then(function () {
        getStudents(renderStudents);
      });
    } else {
      alert("Vui lòng chọn một tệp hình ảnh.");
    }
  };
}

// Tìm kiếm
function handleSearchCourse() {
  var searchInput = document.querySelector("#searchInput");
  var searchButton = document.querySelector("#searchButton");
  searchButton.addEventListener("click", function () {
    var searchKeyword = searchInput.value.toLowerCase();
    getStudents(function (students) {
      var filteredStudents = students.filter(function (student) {
        return student.name.toLowerCase().includes(searchKeyword);
      });
      renderStudents(filteredStudents);
    });
  });
}

// Sắp xếp theo tên, lớp, điểm
function handleSortChange() {
  var sortSelect = document.querySelector("#sort");
  var selectedValue = sortSelect.value;

  if (selectedValue === "name") {
    // Sắp xếp theo tên (sử dụng hàm sortStudents)
    getStudents(function (students) {
      students.sort(function (a, b) {
        return a.name.localeCompare(b.name);
      });
      renderStudents(students);
    });
  } else if (selectedValue === "class") {
    // Sắp xếp theo lớp (sử dụng hàm sortStudents)
    getStudents(function (students) {
      students.sort(function (a, b) {
        return a.class.localeCompare(b.class);
      });
      renderStudents(students);
    });
  } else if (selectedValue === "score") {
    // Sắp xếp theo điểm (sử dụng hàm sortStudents)
    getStudents(function (students) {
      students.sort(function (a, b) {
        return b.score - a.score; // Sắp xếp giảm dần theo điểm
      });
      renderStudents(students);
    });
  }
}
