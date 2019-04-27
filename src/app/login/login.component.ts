import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  validateForm: FormGroup;

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    if (this.validateForm.value && this.validateForm.value.userName === 'Demo' && this.validateForm.value.password === 'Demo') {
      localStorage.setItem('userData', JSON.stringify(this.validateForm.value));
      this.router.navigateByUrl('/');
    } else {
      this.notification.create(
        'error',
        'Invalid credentials',
        'Invalid username or password'
      );
    }
  }

  constructor(private fb: FormBuilder, private notification: NzNotificationService, private router: Router) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

}
