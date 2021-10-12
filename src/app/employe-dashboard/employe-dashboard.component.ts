import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { EmployeeModel } from './employee-dashboard-model';
import { ApiService } from '../shared/api.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-employe-dashboard',
  templateUrl: './employe-dashboard.component.html',
  styleUrls: ['./employe-dashboard.component.css']
})
export class EmployeDashboardComponent implements OnInit {

  formValue !: FormGroup;
  employeeModelobj : EmployeeModel = new EmployeeModel(); 
  employeeData !: any;
  showAdd!: boolean;
  showUpdate !: boolean;


  constructor(private formBuilder : FormBuilder, private api: ApiService) { }

  ngOnInit(): void {
    this.formValue = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      salary: ['']
    })
    this.getAllEmployee();
  }

  clickAddEmployee() {
    this.formValue.reset();
    this.showAdd = true;
    this.showUpdate = false;
  }

  postEmployeeDetails() {
    this.employeeModelobj.firstName = this.formValue.value.firstName;
    this.employeeModelobj.lastName = this.formValue.value.lastName;
    this.employeeModelobj.salary = this.formValue.value.salary;

    this.api.postEmployee(this.employeeModelobj)
    .subscribe(res=> {
      console.log(res);
      alert("Employee Added Successfully");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    },
    err=> {
      alert("something went wrong")
    })
  }

  getAllEmployee() {
    this.api.getEmployee()
    .subscribe(res=> {
      this.employeeData = res;
    })
  }

  deleteEmployee(row: any) {
    this.api.deleteEmployee(row.id)
    .subscribe(res=> {
      alert("employee deleted");
      this.getAllEmployee();
    })
  }

  onEdit(row: any) {
    this.showAdd = false;
    this.showUpdate = true;
    this.employeeModelobj.id = row.id;
    this.formValue.controls['firstName'].setValue(row.firstName);
    this.formValue.controls['lastName'].setValue(row.lastName);
    this.formValue.controls['salary'].setValue(row.salary);
  }

  updateEmployeeDetails() {
    this.employeeModelobj.firstName = this.formValue.value.firstName;
    this.employeeModelobj.lastName = this.formValue.value.lastName;
    this.employeeModelobj.salary = this.formValue.value.salary;

    this.api.updateEmployee(this.employeeModelobj, this.employeeModelobj.id)
    .subscribe(res => {
      alert("updated successfullay");
      let ref = document.getElementById('cancel');
      ref?.click();
      this.formValue.reset();
      this.getAllEmployee();
    })
  }

}
