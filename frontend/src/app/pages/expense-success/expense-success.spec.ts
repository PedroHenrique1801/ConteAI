import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseSuccess } from './expense-success';

describe('ExpenseSuccess', () => {
  let component: ExpenseSuccess;
  let fixture: ComponentFixture<ExpenseSuccess>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseSuccess],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseSuccess);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
