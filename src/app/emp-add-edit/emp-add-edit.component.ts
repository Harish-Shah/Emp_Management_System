import { Component,Inject,OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core-service.service';
import { spamNameValidator } from '../common/spam-check';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.scss']
})
export class EmpAddEditComponent implements OnInit {
   
    empForm :FormGroup ;

    education :string[]=[
      'HSC',
      'Diploma',
      'Graduate',
      'Post Graduate',
    ] ;

    constructor(
      private _fb:FormBuilder,
      private _empService:EmployeeService,
      private _dialogRef:MatDialogRef<EmpAddEditComponent>,
      private _coreService:CoreService,
      @Inject(MAT_DIALOG_DATA) public data:any,

       ){
        this.empForm=this._fb.group({
          firstName:['',[Validators.required,Validators.minLength(3),spamNameValidator(/user|admin/)]],
          lastName:['',[Validators.required,Validators.minLength(3)]],
          email:['',[Validators.required,Validators.minLength(3)]],
          dob:'',
          gender:'',
          education:'',
          company:'',
          experience:'',
          package:'',
      })
    }

ngOnInit(): void {
    this.empForm.patchValue(this.data) ;
}


onFormSubmit() {
  if (this.empForm.valid) {
    if (this.data) {
      this._empService
        .updateEmployee(this.data.id, this.empForm.value)
        .subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar('Employee detail updated!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    } else {
      this._empService.addEmployee(this.empForm.value).subscribe({
        next: (val: any) => {
          this._coreService.openSnackBar('Employee added successfully');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }
}
}