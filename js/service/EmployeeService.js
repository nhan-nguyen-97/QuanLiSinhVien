//File tương tác dữ liệu với BE thông qua API
var EmployeeService = function(){
    this.add = function (newEmployee){
        return axios({
            url:'https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/employee',// lấy đường dẫn đến file dữ liệu của BE
            method: 'POST',//Phương thức trao đổi dữ liệu với BE
            data: newEmployee
        })
    }

    this.update = function(id, employeeUpdate){
        return axios({
            url:'https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/employee/' + id,
            method:'PUT',
            data:employeeUpdate
        })
    }
    this.delete = function(id){
        return axios({
            url:'https://5bd2959ac8f9e400130cb7e9.mockapi.io/api/employee/' + id,
            method:'DELETE',
        })
    }
};
