import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  // Fields
  transaction_hour = 22;
  log_amount = 4.448165;

  merchant_category: string = 'Electronics';
  foreign_transaction: number = 0;
  location_mismatch: number = 0;
  age_category: string = 'adult';
  amount_category: string = 'low';
  velocity_category: string = 'high';

  // Options
  merchant_categories = ['Food', 'Clothing', 'Travel', 'Grocery', 'Electronics'];
  age_categories = ['adult', 'senior'];
  amount_categories = ['lowest', 'low', 'meduim', 'upper_medium', 'high'];
  velocity_categories = ['low', 'mid', 'high'];

  // Result
  result: any = null;
  loading = false;
  error: string | null = null;
  submitted = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  buildPayload() {
    return {
      transaction_hour:    this.transaction_hour,
      merchant_category:   this.merchant_category,
      foreign_transaction: this.foreign_transaction,
      location_mismatch:   this.location_mismatch,
      age_category:        this.age_category,
      amount_category:     this.amount_category,
      velocity_category:   this.velocity_category,
      log_amount:          this.log_amount
    };
  }

  submit() {
    this.loading = true;
    this.error = null;
    this.result = null;
    this.submitted = true;
    this.cdr.detectChanges();

    const payload = this.buildPayload();
    this.http.post('https://fraud-plum.vercel.app/predict', payload).subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err?.error?.detail || err?.message || 'An error occurred';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  resetForm() {
    this.transaction_hour = 22;
    this.log_amount = 4.448165;
    this.merchant_category = 'Electronics';
    this.foreign_transaction = 0;
    this.location_mismatch = 0;
    this.age_category = 'adult';
    this.amount_category = 'low';
    this.velocity_category = 'high';
    this.result = null;
    this.error = null;
    this.submitted = false;
    this.loading = false;
  }

  isFraud(): boolean {
    if (!this.result) return false;
    const val = this.result?.prediction;
    return val === 1;
  }

  get payloadPreview(): string {
    return JSON.stringify(this.buildPayload(), null, 2);
  }
}
