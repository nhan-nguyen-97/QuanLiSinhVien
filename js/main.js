//Lớp : Employee
// Chức năng
/*
	1. Thêm nhân viên mới vào danh sách
	2. Hiển thị danh sách nhân viên dưới dạng bảng
	3. Xóa nhân viên mới vào danh sách
	4. Cập nhật thông tin nhân viên
	5. Tìm kiếm nhân viên theo tên hoặc mã
	6. Validate thông tin
 */
//Tạo đối tượng service để thực hiện các phương thức GET, POST, PUT, DELETE
var empService = new EmployeeService();

//Xây dựng lớp đối tượng
function Employee(lastName, firstName, id, birthday, position) {
  this.lastName = lastName;
  this.firstName = firstName;
  this.id = id;
  this.birthday = birthday;
  this.position = position;
  this.calcSalary = function () {
    //position = "Sep"
    //position = "Truong Phong"
    //position = "Nhan Vien"
    var coBan = 1000;
    if (this.position === "Sếp") return coBan * 5;
    if (this.position === "Trưởng phòng") return coBan * 3;
    return coBan;
  };
}

var employeeList = [];

//FUNCTION 1: Thêm nhân viên
const addEmployee = function () {
  //1. Lấy thông tin từ form, DOM
  const lastName = document.getElementById("ho").value.trim();
  const firstName = document.getElementById("ten").value.trim();
  const id = document.getElementById("msnv").value.trim();
  const birthday = document.getElementById("datepicker").value;
  const position = document.getElementById("chucvu").value;

  var isValid = true;
  //Kiểm tra dữ liệu
  isValid &=
    checkRequired(lastName, "lastnameerror", "Vui lòng nhập Họ!") && // check tuần tự
    checkLength(lastName, "lastnameerror", "Độ dài không phù hợp!", 1, 10) &&
    checkString(lastName, "lastnameerror", "Tên không đúng định dạng");
  isValid &=
    checkRequired(firstName, "firstnameerror", "Vui lòng nhập Tên!") &&
    checkLength(firstName, "firstnameerror", "Độ dài không phù hợp!", 1, 20) &&
    checkString(firstName, "firstnameerror", "Tên không đúng định dạng");
  //checkRequired(id, 'iderror', 'Vui lòng nhập ID!');
  if (isValid) {
    //2.1 Kiểm tra tồn tại nhân viên
    for (var i = 0; i < employeeList.length; i++) {
      if (id === employeeList[i].id) {
        alert("Mã nhân viên đã tồn tại");
        return;
      }
    }
    //2. Khởi tạo Object, lưu thông tin lấy được vào Object đó
    const newEmployee = new Employee(
      lastName,
      firstName,
      id,
      birthday,
      position
    );
    //3. Bỏ vào mảng employeeList (object nhân viên)
    employeeList.push(newEmployee);
    //Gọi API lưu vào Server
    var promise = empService.add(newEmployee);

    promise
      .then(function (res) {
        //Xử lý dữ liệu thành công, gọi lại hàm getData lấy dữ liệu mới nhất về
        getData();
        console.log("data", res.data);
      })
      .catch(function (error) {
        console.log("error", error);
      });
    //lưu data nhân viên xuống localStorage
    saveData();

    //4. render giao diện
    renderEmployees();
  } else {
    alert("Vui lòng nhập đúng thông tin");
  }
};

//function 2: tạo giao diện bảng nhân viên
const renderEmployees = function (arr) {
  var htmlContent = "";
  arr = arr || employeeList;
  for (var i = 0; i < arr.length; i++) {
    const currentEmp = arr[i];
    htmlContent += `<tr> 
				<td>${i + 1}</td> 
				<td>${currentEmp.lastName + " " + currentEmp.firstName}</td> 
				<td>${currentEmp.id}</td> 
				<td>${currentEmp.birthday}</td> 
				<td>${currentEmp.position}</td> 
				<td>${currentEmp.calcSalary()}</td> 
				<td>
					<button class = "btn btn-danger" onclick = "deleteEmpl('${
            currentEmp.id
          }')">Xóa</button>
					<button class = "btn btn-info" onclick = "getUpdateEmpl('${
            currentEmp.id
          }')">Cập nhật</button>
			</tr>`;
  }
  // console.log(htmlContent);
  document.getElementById("tbodyEmployees").innerHTML = htmlContent;
};

//function: save data to local storage
const saveData = function () {
  //chuyển sang chuỗi JSON
  const employeeListJSON = JSON.stringify(employeeList);
  console.log(employeeListJSON);
  localStorage.setItem("employees", employeeListJSON);
};

const getData = function () {
  //Dùng axios để call lên api của backend lấy danh sách nhân viên có sẵn
  const fetchEmplPromise = axios({
    url: "https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/employee",
    method: "GET",
  });
  // resolve trả về thành công
  const resolve = function (res) {
    // console.log(res.data);
    for (var i = 0; i < res.data.length; i++) {
      const currentEmp = res.data[i];
      const newEmployee = new Employee(
        currentEmp.lastName,
        currentEmp.firstName,
        currentEmp.id,
        currentEmp.birthday,
        currentEmp.position
      );
      employeeList.push(newEmployee);
    }
    renderEmployees();
  };
  // reject trả về lỗi
  const reject = function (err) {
    console.log(err);
  };
  fetchEmplPromise.then(resolve).catch(reject);

  // //lúc vào trang
  // /*
  // 	1. Xuống local lấy lại danh sách cũ lên
  // 	2. Chuyển từ chuỗi ra mảng (lúc lưu là lưu chuỗi => lấy là lấy chuỗi)
  // 	3. Gán employeeList = mảng data cũ
  //  */
  // var employeeListJSON = localStorage.getItem("employees");
  // // nếu data cũ có tồn tại thì lấy lên và gán vào employeeList
  // if (employeeListJSON) {
  //   employeeListFromLocal = JSON.parse(employeeListJSON);
  //   for (var i = 0; i < employeeListFromLocal.length; i++) {
  //     const currentEmp = employeeListFromLocal[i];
  //     const newEmployee = new Employee(
  //       currentEmp.lastName,
  //       currentEmp.firstName,
  //       currentEmp.id,
  //       currentEmp.birthday,
  //       currentEmp.position
  //     );
  //     employeeList.push(newEmployee);
  //   }

  //   /*
  //    * 1. Viết hàm map
  //    * [EMP1, EMP2] => [new Employee(EMP1), new Employee(EMP2)]
  //    */
  //   renderEmployees();
  // }
};

//function 3: xóa nhân viên khỏi danh sách

const deleteEmpl = function (id) {
  //input: mã nhân viên
  //process: 1. Tìm vị trí => xóa => render lại giao diện mới
  const index = findById(id);
  // kiểm tra nếu tìm được thì xóa
  if (index !== -1) {
    employeeList.splice(index, 1);
    renderEmployees();
  }
  //gọi API xóa dữ liệu trên server
  empService
    .delete(id)
    .then(function (res) {
      getData();
      console.log("Xóa thành công!");
    })
    .catch(function (error) {
      console.log(error);
    });
  saveData();
};

//function: tìm vị trí theo id
const findById = function (id) {
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeList[i].id === id) {
      return i;
    }
  }
  return -1;
};

//function 4: cập nhật thông tin nhân viên
const getUpdateEmpl = function (id) {
  const index = findById(id);
  if (index !== -1) {
    const updateUser = employeeList[index];

    //show thông tin lên form
    document.getElementById("ho").value = updateUser.lastName;
    document.getElementById("ten").value = updateUser.firstName;
    document.getElementById("msnv").value = updateUser.id;
    document.getElementById("datepicker").value = updateUser.birthday;
    document.getElementById("chucvu").value = updateUser.position;
    //disable ô msnv
    document.getElementById("msnv").setAttribute("disabled", true);

    //ẩn nút thêm và hiện nút Update
    document.getElementById("btnAdd").style.display = "none";
    document.getElementById("btnUpdate").style.display = "block";
  }
};

const updatedEmpl = function () {
  const lastName = document.getElementById("ho").value;
  const firstName = document.getElementById("ten").value;
  const id = document.getElementById("msnv").value;
  const birthday = document.getElementById("datepicker").value;
  const position = document.getElementById("chucvu").value;
  const updatedEmpl = new Employee(lastName, firstName, id, birthday, position);
  // dựa vào id không đổi, tìm vị trí nhân viên cũ trong mảng,
  // đè nhân viên mới vào
  const index = findById(id);
  if (index !== -1) {
    employeeList[index] = updatedEmpl;
    renderEmployees();
    saveData();
    document.getElementById("btnAdd").style.display = "block";
    document.getElementById("btnUpdate").style.display = "none";
    //Bỏ thuộc tính Readonly trong ID
    document.getElementById("msnv").removeAttribute("disabled");
    //Tự xóa form khi ckick cập nhật
    document.getElementById("btnReset").click();
  }

  //Gọi service cập nhật dữ liệu server
  var promise = empService.update(updatedEmpl.id, updatedEmpl);
  promise
    .then(function (res) {
      console.log("result", res.data);
    })
    .catch(function (error) {
      console.log("error");
    });
  getData();
  // document.getElementById("ho").value = "";
  // document.getElementById("ten").value = "";
  // document.getElementById("msnv").value = "";
  // document.getElementById("chucvu").value = "Chọn chức vụ";
};

//Hàm tìm nhân viên theo ID hoặc Tên
const findEmpl = function () {
  // 1. Lấy Keyword
  const keyWord = document.getElementById("txtSearch").value;
  const results = [];
  for (var i = 0; i < employeeList.length; i++) {
    const currentEmpl = employeeList[i];
    const fullName = currentEmpl.lastName + "" + currentEmpl.firstName;
    const convertFullName = nonAccentVietnamese(fullName);
    const convertKeyWord = nonAccentVietnamese(keyWord);
    if (keyWord === currentEmpl.id) {
      results.push(currentEmpl);
      break;
    } else if (
      convertFullName
        .toLowerCase()
        .indexOf(convertKeyWord.toLowerCase().trim()) !== -1
    ) {
      //trim() xóa khoảng trắng 2 đầu
      results.push(currentEmpl);
    }
  }
  renderEmployees(results);
};
function nonAccentVietnamese(str) {
  str = str.toLowerCase();
  //     We can also use this instead of from line 11 to line 17
  //     str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
  //     str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
  //     str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
  //     str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
  //     str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
  //     str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
  //     str = str.replace(/\u0111/g, "d");
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
  return str;
}

//-----------VALIDATION------------------
const checkRequired = function (value, idMessage, message) {
  if (!value.length) {
    document.getElementById(idMessage).innerHTML = message;
    return false;
  }
  document.getElementById(idMessage).innerHTML = "";
  return true;
};

const checkLength = function (value, idMessage, message, min, max) {
  if (value.length < min || value.length > max) {
    document.getElementById(idMessage).innerHTML = message;
    return false;
  }
  document.getElementById(idMessage).innerHTML = "";
  return true;
};

const checkString = function (value, idMessage, message) {
  const stringPattern = new RegExp(
    "^[a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ" +
      "ẸẺẼẾỀỂưăạảấầẩẫậắằẳẵặẹẻẽếềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ" +
      "ụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\\s]+$"
  );
  if (stringPattern.test(value)) {
    document.getElementById(idMessage).innerHTML = "";
    return true;
  }
  document.getElementById(idMessage).innerHTML = message;
  return false;
};
getData();

const showMessage = function () {
  console.log("this is a message");
};

setTimeout(showMessage, 1000);
