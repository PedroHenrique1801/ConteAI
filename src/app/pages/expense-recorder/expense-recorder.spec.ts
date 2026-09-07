import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExpenseRecorder } from './expense-recorder';

describe('ExpenseRecorder', () => {
  let component: ExpenseRecorder;
  let fixture: ComponentFixture<ExpenseRecorder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseRecorder],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseRecorder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
