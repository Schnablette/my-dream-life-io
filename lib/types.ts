// ─── Enums ────────────────────────────────────────────────────────────────────

export type Frequency = 'weekly' | 'monthly' | 'annually';

export type EventType =
  | 'loan_purchase'
  | 'cash_purchase'
  | 'salary_change'
  | 'windfall'
  | 'large_withdrawal'
  | 'other';

export type InvestmentAccountType = 'taxable_brokerage' | '401k_ira' | 'mix';

// ─── TermsJson discriminated union ────────────────────────────────────────────

export type LoanPurchaseTerms = {
  event_type: 'loan_purchase';
  apr: number;
  term_months: number;
  principal: number;
};

export type CashPurchaseTerms = {
  event_type: 'cash_purchase';
  description?: string;
};

export type SalaryChangeTerms = {
  event_type: 'salary_change';
  previous_salary: number;
  new_salary: number;
};

export type WindfallTerms = {
  event_type: 'windfall';
  source?: string;
};

export type LargeWithdrawalTerms = {
  event_type: 'large_withdrawal';
  reason?: string;
};

export type OtherTerms = {
  event_type: 'other';
  notes?: string;
};

export type TermsJson =
  | LoanPurchaseTerms
  | CashPurchaseTerms
  | SalaryChangeTerms
  | WindfallTerms
  | LargeWithdrawalTerms
  | OtherTerms;

// ─── Table types ──────────────────────────────────────────────────────────────

export type User = {
  id: string;
  name: string;
  email: string;
  created_at: string;
};

export type Forecast = {
  id: string;
  user_id: string;
  label: string;
  start_date: string;
  horizon_months: number;
  starting_net_worth: number;
  created_at: string;
};

export type ForecastParameters = {
  id: string;
  forecast_id: string;
  annual_salary: number;
  monthly_take_home: number;
  investment_return_rate_pct: number;
  savings_rate_pct: number;
  annual_bonus_pct: number;
  bonus_month: number;
  inflation_rate_pct: number;
  investment_account_type: InvestmentAccountType;
};

export type Expense = {
  id: string;
  forecast_id: string;
  name: string;
  category: string;
  amount: number;
  frequency: Frequency;
  effective_from: string;
  effective_until: string | null;
};

export type FinancialEvent = {
  id: string;
  forecast_id: string;
  description: string;
  event_date: string;
  event_type: EventType;
  amount: number;
  terms_json: TermsJson | null;
  is_recurring_impact: boolean;
};

export type LoanSchedule = {
  id: string;
  financial_event_id: string;
  principal: number;
  apr: number;
  term_months: number;
  monthly_payment: number;
  first_payment_date: string;
};

export type MonthlySnapshot = {
  id: string;
  forecast_id: string;
  month: string;
  net_worth: number;
  income: number;
  total_expenses: number;
  amount_invested: number;
  investment_gains: number;
  event_impact: number;
  mom_delta: number;
};

// ─── Insert / Update variants ─────────────────────────────────────────────────

export type InsertUser = Omit<User, 'id' | 'created_at'>;
export type UpdateUser = Partial<InsertUser>;

export type InsertForecast = Omit<Forecast, 'id' | 'created_at'>;
export type UpdateForecast = Partial<InsertForecast>;

export type InsertForecastParameters = Omit<ForecastParameters, 'id'>;
export type UpdateForecastParameters = Partial<InsertForecastParameters>;

export type InsertExpense = Omit<Expense, 'id'>;
export type UpdateExpense = Partial<InsertExpense>;

export type InsertFinancialEvent = Omit<FinancialEvent, 'id'>;
export type UpdateFinancialEvent = Partial<InsertFinancialEvent>;

export type InsertLoanSchedule = Omit<LoanSchedule, 'id'>;
export type UpdateLoanSchedule = Partial<InsertLoanSchedule>;

export type InsertMonthlySnapshot = Omit<MonthlySnapshot, 'id'>;
export type UpdateMonthlySnapshot = Partial<InsertMonthlySnapshot>;

// ─── Composed types ───────────────────────────────────────────────────────────

export type ForecastWithRelations = Forecast & {
  parameters: ForecastParameters;
  expenses: Expense[];
  events: (FinancialEvent & { loan_schedule: LoanSchedule | null })[];
  snapshots: MonthlySnapshot[];
};
