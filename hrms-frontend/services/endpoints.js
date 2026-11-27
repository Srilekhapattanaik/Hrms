// ALL backend URLs live here. If Naresh changes a URL, change ONLY this file.
// Base URL (http://localhost:8080) comes from NEXT_PUBLIC_API_URL in .env.local
export const ENDPOINTS = {
  // S-4 Add User
  roles: "/api/v1/roles",
  createUser: "/api/v1/users",
   

  // S-6 Recruitment
  candidates: "/api/v1/recruitment/candidates",
  candidateStatus: (id) => `/api/v1/recruitment/candidates/${id}/status`,
  convertCandidate: (id) => `/api/v1/recruitment/candidates/${id}/convert`,
  jobOpenings: "/api/v1/recruitment/job-openings",

  // S-7 Documents
  documents: "/api/v1/documents",
  documentFile: (id) => `/api/v1/documents/${id}/file`,
  documentVerify: (id) => `/api/v1/documents/${id}/verify`,
  documentReject: (id) => `/api/v1/documents/${id}/reject`,
  documentReupload: (id) => `/api/v1/documents/${id}/request-reupload`,

  // S-8 Shift Management        GET, POST  |  PUT, DELETE /shifts/{id}
  shifts: "/api/v1/shifts",
  shift: (id) => `/api/v1/shifts/${id}`,

  // S-9 Attendance History      GET ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
  attendanceHistory: "/api/v1/attendance/history",
  attendanceDaily: (date) => `/api/v1/attendance/daily/${date}`,

  // T-8 Employee check-in/check-out (confirm these routes with Naresh)
  attendanceToday: (employeeId) => `/api/v1/attendance/today/${employeeId}`,
  attendanceCheckIn: "/api/v1/attendance/check-in",
  attendanceCheckOut: "/api/v1/attendance/check-out",

  // S-10 Apply for Leave
  leavePolicies: "/api/v1/leave/policies", // GET  leave types
  employeeLeaveBalances: (employeeId) => `/api/v1/employees/${employeeId}/leave-balances`, // GET
  leaves: "/api/v1/leaves", // POST apply  |  GET ?status=PENDING  (also ?employeeId=)

  // S-11 Manager approvals      POST body { comment }
  leaveApprove: (id) => `/api/v1/leaves/${id}/approve`,
  leaveReject: (id) => `/api/v1/leaves/${id}/reject`,

  // S-12 Salary Structure
  payrollComponents: "/api/v1/payroll/components", // POST
  payrollStructure: "/api/v1/payroll/structure", // POST

  // S-15 Payroll Processing
  payrollProcess: (month) => `/api/v1/payroll/process/${month}`, // POST, month = YYYY-MM

  // S-17 .. S-20 Payroll (ASSUMED URLs - confirm with Naresh / Varma)
  payrollProcessStatus: (month) => `/api/v1/payroll/process/${month}/status`, // GET progress
  payrollProcessErrors: (month) => `/api/v1/payroll/process/${month}/errors`, // GET failed employees
  statutoryConfig: "/api/v1/payroll/statutory-config", // GET, PUT
  ptSlabs: "/api/v1/payroll/professional-tax-slabs", // GET, POST
  ptSlab: (id) => `/api/v1/payroll/professional-tax-slabs/${id}`, // PUT, DELETE

  // N-18 / N-19 Payroll batches: DRAFT -> PROCESSING -> APPROVED -> LOCKED
  payrollBatches: "/api/v1/payroll/batches", // GET all, POST { payrollMonth }
  payrollBatch: (month) => `/api/v1/payroll/batches/${month}`, // GET summary of one month
  payrollBatchStatus: (id) => `/api/v1/payroll/batches/${id}/status`, // PUT { status }
  payrollBatchApprove: (id) => `/api/v1/payroll/batches/${id}/approve`, // PUT
  payrollBatchLock: (id) => `/api/v1/payroll/batches/${id}/lock`, // PUT

  // Dashboard
  //employees: "/api/employees",
   employees: "/api/v1/employees",
};
